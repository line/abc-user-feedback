/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { createReadStream, existsSync } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';
import { PassThrough } from 'stream';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as ExcelJS from 'exceljs';
import * as fastcsv from 'fast-csv';
import { DateTime } from 'luxon';
import type { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional';

import {
  EventTypeEnum,
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '@/common/enums';
import { ChannelService } from '../channel/channel/channel.service';
import { RESERVED_FIELD_KEYS } from '../channel/field/field.constants';
import type { FieldEntity } from '../channel/field/field.entity';
import { FieldService } from '../channel/field/field.service';
import { OptionService } from '../channel/option/option.service';
import { IssueService } from '../project/issue/issue.service';
import type {
  CountByProjectIdDto,
  FindFeedbacksByChannelIdDto,
  GenerateExcelDto,
} from './dtos';
import {
  AddIssueDto,
  CreateFeedbackDto,
  DeleteByIdsDto,
  RemoveIssueDto,
  UpdateFeedbackDto,
} from './dtos';
import type { Feedback } from './dtos/responses/find-feedbacks-by-channel-id-response.dto';
import { validateValue } from './feedback.common';
import { FeedbackMySQLService } from './feedback.mysql.service';
import { FeedbackOSService } from './feedback.os.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackMySQLService: FeedbackMySQLService,
    private readonly feedbackOSService: FeedbackOSService,
    private readonly fieldService: FieldService,
    private readonly issueService: IssueService,
    private readonly optionService: OptionService,
    private readonly channelService: ChannelService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private validateQuery(
    query: FindFeedbacksByChannelIdDto['query'],
    fields: FieldEntity[],
  ) {
    const fieldsByKey = fields.reduce(
      (fields: Record<string, FieldEntity>, field) => {
        fields[field.key] = field;
        return fields;
      },
      {},
    );

    for (const fieldKey of Object.keys(query)) {
      if (['ids', 'issueIds'].includes(fieldKey)) {
        if (!Array.isArray(query[fieldKey])) {
          throw new BadRequestException(`${fieldKey} must be array`);
        }
        continue;
      }
      if ('searchText' === fieldKey) {
        continue;
      }
      if (!fieldsByKey[fieldKey]) {
        throw new BadRequestException(`invalid key in query: ${fieldKey}`);
      }

      switch (fieldsByKey[fieldKey].format) {
        case FieldFormatEnum.keyword:
          if (typeof query[fieldKey] !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.date:
          if (
            typeof query[fieldKey] !== 'object' ||
            !(
              Object.prototype.hasOwnProperty.call(query[fieldKey], 'gte') &&
              Object.prototype.hasOwnProperty.call(query[fieldKey], 'lt')
            )
          )
            throw new BadRequestException(`${fieldKey} must be DateTimeRange`);
          break;
        case FieldFormatEnum.multiSelect:
          if (!Array.isArray(query[fieldKey]))
            throw new BadRequestException(
              `${fieldKey} must be array of string`,
            );
          break;
        case FieldFormatEnum.number:
          if (typeof query[fieldKey] !== 'number')
            throw new BadRequestException(`${fieldKey} must be number`);
          break;
        case FieldFormatEnum.select:
          if (typeof query[fieldKey] !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.text:
          if (typeof query[fieldKey] !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.images:
          if (!Array.isArray(query[fieldKey]))
            throw new BadRequestException(
              `${fieldKey} must be array of string`,
            );
          break;
      }
    }
  }

  private convertFeedback(
    feedback: any,
    fieldsByKey: Record<string, FieldEntity>,
    fieldsToExport: FieldEntity[],
  ) {
    const convertedFeedback: Record<string, any> = {};
    for (const key of Object.keys(feedback)) {
      convertedFeedback[fieldsByKey[key].name] = Array.isArray(feedback[key])
        ? key === 'issues'
          ? feedback[key].map((issue) => issue.name).join(', ')
          : feedback[key].join(', ')
        : feedback[key];
    }

    return Object.keys(convertedFeedback)
      .filter((key) => fieldsToExport.find((field) => field.name === key))
      .reduce((obj, key) => {
        obj[key] = convertedFeedback[key];
        return obj;
      }, {});
  }

  private async generateXLSXFile({
    channelId,
    query,
    sort,
    fields,
    fieldsByKey,
    fieldsToExport,
  }) {
    if (!existsSync('/tmp')) {
      await fs.mkdir('/tmp');
    }
    const tempFilePath = path.join('/tmp', `temp_${new Date()}.xlsx`);
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: tempFilePath,
    });
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headers = fieldsToExport.map((field) => ({
      header: field.name,
      key: field.name,
    }));
    worksheet.columns = headers;

    const pageSize = 1000;
    let feedbacks = [];
    let currentScrollId = null;
    let page = 1;
    const feedbackIds = [];

    do {
      if (this.configService.get('opensearch.use')) {
        const { data, scrollId } = await this.feedbackOSService.scroll({
          channelId,
          query,
          sort,
          fields,
          size: pageSize,
          scrollId: currentScrollId,
        });
        feedbacks = data;
        currentScrollId = scrollId;
      } else {
        const { items } = await this.feedbackMySQLService.findByChannelId({
          channelId,
          query,
          sort,
          fields,
          limit: pageSize,
          page,
        });
        feedbacks = items;
        page++;
      }
      const issuesByFeedbackIds =
        await this.issueService.findIssuesByFeedbackIds(
          feedbacks.map((feedback) => feedback.id),
        );

      for (const feedback of feedbacks) {
        feedback.issues = issuesByFeedbackIds[feedback.id];
        const convertedFeedback = this.convertFeedback(
          feedback,
          fieldsByKey,
          fieldsToExport,
        );
        worksheet.addRow(convertedFeedback).commit();
        feedbackIds.push(feedback.id);
      }
    } while (feedbacks.length === pageSize);
    worksheet.commit();
    await workbook.commit();

    const fileStream = createReadStream(tempFilePath);

    fileStream.on('end', async () => {
      await fs.unlink(tempFilePath);
    });

    return { streamableFile: new StreamableFile(fileStream), feedbackIds };
  }

  private async generateCSVFile({
    channelId,
    query,
    sort,
    fields,
    fieldsByKey,
    fieldsToExport,
  }) {
    const stream = new PassThrough();
    const csvStream = fastcsv.format({
      headers: fieldsToExport.map((field) => field.name),
    });

    csvStream.pipe(stream);

    const pageSize = 1000;
    let feedbacks = [];
    let currentScrollId = null;
    let page = 1;
    const feedbackIds = [];

    do {
      if (this.configService.get('opensearch.use')) {
        const { data, scrollId } = await this.feedbackOSService.scroll({
          channelId,
          query,
          sort,
          fields,
          size: pageSize,
          scrollId: currentScrollId,
        });
        feedbacks = data;
        currentScrollId = scrollId;
      } else {
        const { items } = await this.feedbackMySQLService.findByChannelId({
          channelId,
          query,
          sort,
          fields,
          limit: pageSize,
          page,
        });
        feedbacks = items;
        page++;
      }
      const issuesByFeedbackIds =
        await this.issueService.findIssuesByFeedbackIds(
          feedbacks.map((feedback) => feedback.id),
        );

      for (const feedback of feedbacks) {
        feedback.issues = issuesByFeedbackIds[feedback.id];
        const convertedFeedback = this.convertFeedback(
          feedback,
          fieldsByKey,
          fieldsToExport,
        );
        csvStream.write(convertedFeedback);
        feedbackIds.push(feedback.id);
      }
    } while (feedbacks.length === pageSize);

    csvStream.end();

    return { streamableFile: new StreamableFile(stream), feedbackIds };
  }

  @Transactional()
  async create(dto: CreateFeedbackDto) {
    const { channelId, data } = dto;
    const fields = await this.fieldService.findByChannelId({
      channelId,
    });
    if (fields.length === 0) {
      throw new BadRequestException('invalid channel');
    }

    const { issueNames, ...feedbackData } = data;

    if (issueNames && !Array.isArray(issueNames)) {
      throw new BadRequestException('issueNames must be array');
    }

    for (const fieldKey of Object.keys(feedbackData)) {
      if (RESERVED_FIELD_KEYS.includes(fieldKey)) {
        throw new BadRequestException(
          'reserved field key is unavailable: ' + fieldKey,
        );
      }

      const value = data[fieldKey];
      const field = fields.find((v) => v.key === fieldKey);

      if (!field) {
        throw new BadRequestException('invalid field key: ' + fieldKey);
      }

      if (field.type === FieldTypeEnum.ADMIN) {
        throw new BadRequestException('this field is for admin: ' + fieldKey);
      }

      if (!validateValue(field, value)) {
        throw new BadRequestException(
          `invalid value: (value: ${JSON.stringify(value)}, type: ${
            field.format
          }, fieldKey: ${field.key})`,
        );
      }

      if (field.format === FieldFormatEnum.images) {
        const channel = await this.channelService.findById({ channelId });
        const domainWhiteList = channel.imageConfig.domainWhiteList;

        if (domainWhiteList) {
          const images = value as string[];
          for (const image of images) {
            const url = new URL(image);
            if (!domainWhiteList.includes(url.hostname)) {
              throw new BadRequestException(
                `invalid domain in image link: ${url.hostname} (fieldKey: ${field.key})`,
              );
            }
          }
        }
      }
    }

    const feedback = await this.feedbackMySQLService.create({
      channelId,
      data: feedbackData,
    });

    if (issueNames) {
      for (const issueName of issueNames) {
        let issue = await this.issueService.findByName({ name: issueName });
        if (!issue) {
          const channel = await this.channelService.findById({ channelId });

          issue = await this.issueService.create({
            name: issueName,
            projectId: channel.project.id,
          });
        }

        await this.feedbackMySQLService.addIssue({
          channelId,
          feedbackId: feedback.id,
          issueId: issue.id,
        });
      }
    }

    if (this.configService.get('opensearch.use')) {
      await this.feedbackOSService.create({ channelId, feedback });
    }

    this.eventEmitter.emit(EventTypeEnum.FEEDBACK_CREATION, {
      feedbackId: feedback.id,
    });

    return { id: feedback.id };
  }

  async findByChannelId(
    dto: FindFeedbacksByChannelIdDto,
  ): Promise<Pagination<Feedback, IPaginationMeta>> {
    const fields = await this.fieldService.findByChannelId({
      channelId: dto.channelId,
    });
    if (fields.length === 0) {
      throw new BadRequestException('invalid channel');
    }
    dto.fields = fields;

    this.validateQuery(dto.query || {}, fields);

    const feedbacksByPagination = this.configService.get('opensearch.use')
      ? await this.feedbackOSService.findByChannelId(dto)
      : await this.feedbackMySQLService.findByChannelId(dto);

    const issuesByFeedbackIds = await this.issueService.findIssuesByFeedbackIds(
      feedbacksByPagination.items.map((feedback) => feedback.id),
    );

    feedbacksByPagination.items.forEach((feedback) => {
      feedback.issues = issuesByFeedbackIds[feedback.id];
    });

    return feedbacksByPagination;
  }

  @Transactional()
  async updateFeedback(dto: UpdateFeedbackDto) {
    const { feedbackId, data, channelId } = dto;

    const fields = await this.fieldService.findByChannelId({ channelId });
    const fieldsByKey = fields.reduce(
      (fields: Record<string, FieldEntity>, field) => {
        fields[field.key] = field;
        return fields;
      },
      {},
    );

    for (const fieldKey of Object.keys(data)) {
      const field = fieldsByKey[fieldKey];

      if (!field || field.type === FieldTypeEnum.DEFAULT) {
        throw new BadRequestException('invalid field name');
      }

      if (field.type !== FieldTypeEnum.ADMIN) {
        throw new BadRequestException('this field is not for admin');
      }

      if (field.status === FieldStatusEnum.INACTIVE) {
        throw new BadRequestException('this field is disabled');
      }
      // create option

      if (field.format === FieldFormatEnum.multiSelect) {
        const values = data[fieldKey] as string[];
        const newValues = values.filter(
          (v) => !field.options.find(({ name }) => name === v),
        );
        const newOptions = await this.optionService.createMany({
          fieldId: field.id,
          options: newValues.map((v) => ({ name: v, key: v })),
        });
        field.options = field.options.concat(newOptions);
      }

      const value = data[fieldKey] as string;
      if (
        field.format === FieldFormatEnum.select &&
        value &&
        !field.options.find((v) => v.name === value)
      ) {
        const newOption = await this.optionService.create({
          fieldId: field.id,
          key: value,
          name: value,
        });
        field.options = field.options.concat(newOption);
      }

      if (!validateValue(field, data[fieldKey])) {
        throw new BadRequestException(
          `${fieldKey}: invalid value (value: ${data[fieldKey]}, format: ${field.format})`,
        );
      }
    }

    await this.feedbackMySQLService.updateFeedback({
      feedbackId,
      data,
    });

    if (this.configService.get('opensearch.use')) {
      await this.feedbackOSService.upsertFeedbackItem({
        feedbackId,
        data,
        channelId,
      });
    }
  }

  @Transactional()
  async addIssue(dto: AddIssueDto) {
    await this.feedbackMySQLService.addIssue(dto);

    if (this.configService.get('opensearch.use')) {
      await this.feedbackOSService.upsertFeedbackItem({
        channelId: dto.channelId,
        feedbackId: dto.feedbackId,
        data: { updatedAt: DateTime.utc().toISO() },
      });
    }

    this.eventEmitter.emit(EventTypeEnum.ISSUE_ADDITION, {
      feedbackId: dto.feedbackId,
      issueId: dto.issueId,
    });
  }

  @Transactional()
  async removeIssue(dto: RemoveIssueDto) {
    await this.feedbackMySQLService.removeIssue(dto);

    if (this.configService.get('opensearch.use')) {
      await this.feedbackOSService.upsertFeedbackItem({
        channelId: dto.channelId,
        feedbackId: dto.feedbackId,
        data: { updatedAt: DateTime.utc().toISO() },
      });
    }
  }

  async countByProjectId(dto: CountByProjectIdDto) {
    return { total: await this.feedbackMySQLService.countByProjectId(dto) };
  }

  @Transactional()
  async deleteByIds(dto: DeleteByIdsDto) {
    await this.feedbackMySQLService.deleteByIds(dto);

    if (this.configService.get('opensearch.use')) {
      await this.feedbackOSService.deleteByIds(dto);
    }
  }

  async generateFile(dto: GenerateExcelDto): Promise<{
    streamableFile: StreamableFile;
    feedbackIds: number[];
  }> {
    const { channelId, query, sort, type, fieldIds } = dto;

    const fields = await this.fieldService.findByChannelId({
      channelId: channelId,
    });
    if (fields.length === 0) throw new BadRequestException('invalid channel');

    let fieldsToExport = fields;
    if (fieldIds) {
      fieldsToExport = await this.fieldService.findByIds(fieldIds);
      if (fields.length === 0) {
        throw new BadRequestException('invalid fieldIds');
      }
    }

    this.validateQuery(query, fields);
    const fieldsByKey = fields.reduce(
      (prev: Record<string, FieldEntity>, field) => {
        prev[field.key] = field;
        return prev;
      },
      {},
    );

    if (type === 'xlsx') {
      return this.generateXLSXFile({
        channelId,
        query,
        sort,
        fields,
        fieldsByKey,
        fieldsToExport,
      });
    } else if (type === 'csv') {
      return this.generateCSVFile({
        channelId,
        query,
        sort,
        fields,
        fieldsByKey,
        fieldsToExport,
      });
    }
  }

  async findById({
    channelId,
    feedbackId,
  }: {
    channelId: number;
    feedbackId: number;
  }) {
    if (this.configService.get('opensearch.use')) {
      const { items } = await this.feedbackOSService.findById({
        channelId,
        feedbackId,
      });
      const feedback = items[0];
      const issuesByFeedbackIds =
        await this.issueService.findIssuesByFeedbackIds([feedback.id]);
      feedback.issues = issuesByFeedbackIds[feedback.id];

      return feedback;
    } else {
      return await this.feedbackMySQLService.findById({ feedbackId });
    }
  }

  async uploadImages({
    channelId,
    files,
  }: {
    channelId: number;
    files: Array<any>;
  }) {
    const channel = await this.channelService.findById({ channelId });
    if (!channel) {
      throw new BadRequestException('invalid channel id');
    }

    const s3 = new S3Client({
      credentials: {
        accessKeyId: channel.imageConfig.accessKeyId,
        secretAccessKey: channel.imageConfig.secretAccessKey,
      },
      endpoint: channel.imageConfig.endpoint,
      region: channel.imageConfig.region,
    });
    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const key = `${channelId}_${Date.now()}_${file.originalname}`;
          const command = new PutObjectCommand({
            Bucket: channel.imageConfig.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
          });
          await s3.send(command);

          return {
            ...file,
            url: `${channel.imageConfig.endpoint}/${channel.imageConfig.bucket}/${key}`,
          };
        }),
      );
      const imageUrlsByKeys = imageUrls.reduce((prev, curr) => {
        if (curr.fieldname in prev) {
          return {
            ...prev,
            [curr.fieldname]: prev[curr.fieldname].concat(curr.url),
          };
        } else {
          return {
            ...prev,
            [curr.fieldname]: [curr.url],
          };
        }
      }, {});

      return imageUrlsByKeys;
    } catch (e) {
      throw new InternalServerErrorException('failed to upload images');
    }
  }
}
