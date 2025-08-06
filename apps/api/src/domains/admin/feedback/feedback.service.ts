/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { TimeRange } from '@/common/dtos';
import {
  EventTypeEnum,
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
  IssueStatusEnum,
} from '@/common/enums';
import { calculateDaysBetweenDates } from '@/utils/date-utils';
import { ChannelService } from '../channel/channel/channel.service';
import { RESERVED_FIELD_KEYS } from '../channel/field/field.constants';
import type { FieldEntity } from '../channel/field/field.entity';
import { FieldService } from '../channel/field/field.service';
import { OptionService } from '../channel/option/option.service';
import { IssueService } from '../project/issue/issue.service';
import { ProjectService } from '../project/project/project.service';
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
import { FindFeedbacksByChannelIdDtoV2 } from './dtos/find-feedbacks-by-channel-id-v2.dto';
import type { Feedback } from './dtos/responses/find-feedbacks-by-channel-id-response.dto';
import { validateValue } from './feedback.common';
import { FeedbackMySQLService } from './feedback.mysql.service';
import { FeedbackOSService } from './feedback.os.service';

interface File {
  fieldname: string;
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

interface ImageUrl extends File {
  url: string;
}

type ImageUrlsByKeys = Record<string, string[]>;

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackMySQLService: FeedbackMySQLService,
    private readonly feedbackOSService: FeedbackOSService,
    private readonly fieldService: FieldService,
    private readonly issueService: IssueService,
    private readonly optionService: OptionService,
    private readonly channelService: ChannelService,
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private validateQuery(
    query: FindFeedbacksByChannelIdDto['query'],
    fields: FieldEntity[],
    feedbackSearchMaxDays: number,
  ) {
    const fieldsByKey = fields.reduce(
      (fields: Record<string, FieldEntity>, field) => {
        fields[field.key] = field;
        return fields;
      },
      {},
    );

    if (query === undefined) {
      throw new BadRequestException('query is required');
    }

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
      if ('fieldKey' === fieldKey) {
        continue;
      }
      if ('issueName' === fieldKey) {
        continue;
      }
      if ('condition' === fieldKey) {
        continue;
      }
      if (!(fieldKey in fieldsByKey)) {
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

          if (
            feedbackSearchMaxDays >= 0 &&
            calculateDaysBetweenDates(
              (query[fieldKey] as TimeRange).gte,
              (query[fieldKey] as TimeRange).lt,
            ) > feedbackSearchMaxDays
          ) {
            throw new BadRequestException(
              `${fieldKey} must be less than ${feedbackSearchMaxDays} days`,
            );
          }
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
        case FieldFormatEnum.aiField:
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

  private validateQueryV2(
    queries: FindFeedbacksByChannelIdDtoV2['queries'],
    fields: FieldEntity[],
    feedbackSearchMaxDays: number,
  ) {
    const fieldsByKey = fields.reduce(
      (fields: Record<string, FieldEntity>, field) => {
        fields[field.key] = field;
        return fields;
      },
      {},
    );

    if (queries === undefined) {
      return;
    }

    for (const query of queries) {
      const fieldKey = query.key;
      const fieldValue = query.value;

      if (['ids', 'issueIds'].includes(fieldKey)) {
        if (!Array.isArray(fieldValue)) {
          throw new BadRequestException(`${fieldKey} must be array`);
        }
        continue;
      }
      if (!(fieldKey in fieldsByKey)) {
        throw new BadRequestException(`invalid key in query: ${fieldKey}`);
      }

      switch (fieldsByKey[fieldKey].format) {
        case FieldFormatEnum.keyword:
          if (typeof fieldValue !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.date:
          if (
            typeof fieldValue !== 'object' ||
            !(
              Object.prototype.hasOwnProperty.call(fieldValue, 'gte') &&
              Object.prototype.hasOwnProperty.call(fieldValue, 'lt')
            )
          )
            throw new BadRequestException(`${fieldKey} must be DateTimeRange`);

          if (
            feedbackSearchMaxDays >= 0 &&
            calculateDaysBetweenDates(
              (fieldValue as TimeRange).gte,
              (fieldValue as TimeRange).lt,
            ) > feedbackSearchMaxDays
          ) {
            throw new BadRequestException(
              `${fieldKey} must be less than ${feedbackSearchMaxDays} days`,
            );
          }
          break;
        case FieldFormatEnum.multiSelect:
          if (!Array.isArray(fieldValue))
            throw new BadRequestException(
              `${fieldKey} must be array of string`,
            );
          break;
        case FieldFormatEnum.number:
          if (typeof fieldValue !== 'number')
            throw new BadRequestException(`${fieldKey} must be number`);
          break;
        case FieldFormatEnum.select:
          if (typeof fieldValue !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.text:
        case FieldFormatEnum.aiField:
          if (typeof fieldValue !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.images:
          if (!Array.isArray(fieldValue))
            throw new BadRequestException(
              `${fieldKey} must be array of string`,
            );
          break;
      }
    }
  }

  private convertFeedback(
    timezone: string,
    feedback: Feedback,
    fieldsByKey: Record<string, FieldEntity>,
    fieldsToExport: FieldEntity[],
  ) {
    const convertedFeedback: Record<string, any> = {};
    for (const key of Object.keys(feedback)) {
      convertedFeedback[fieldsByKey[key].name] =
        Array.isArray(feedback[key]) ?
          key === 'issues' ?
            feedback[key].map((issue) => issue.name).join(', ')
          : feedback[key].sort().join(', ')
        : (feedback[key] as string);

      if (fieldsByKey[key].format === FieldFormatEnum.date) {
        convertedFeedback[fieldsByKey[key].name] = DateTime.fromJSDate(
          new Date(feedback[key] as string),
        )
          .setZone(timezone)
          .toFormat('yyyy-MM-dd HH:mm:ss');
      }

      if (fieldsByKey[key].format === FieldFormatEnum.aiField) {
        try {
          convertedFeedback[fieldsByKey[key].name] = (
            JSON.parse(feedback[key] as string) as {
              status: string;
              message: string;
            }
          ).message;
        } catch {
          convertedFeedback[fieldsByKey[key].name] = feedback[key] as string;
        }
      }
    }

    return Object.keys(convertedFeedback)
      .filter((key) => fieldsToExport.find((field) => field.name === key))
      .reduce((obj, key) => {
        obj[key] = convertedFeedback[key] as object;
        return obj;
      }, {});
  }

  private async generateXLSXFile({
    projectId,
    channelId,
    queries,
    defaultQueries,
    operator,
    sort,
    fields,
    fieldsByKey,
    fieldsToExport,
    filterFeedbackIds,
  }: {
    projectId: number;
    channelId: number;
    queries: FindFeedbacksByChannelIdDtoV2['queries'];
    defaultQueries: FindFeedbacksByChannelIdDtoV2['defaultQueries'];
    operator: FindFeedbacksByChannelIdDtoV2['operator'];
    sort: FindFeedbacksByChannelIdDtoV2['sort'];
    fields: FieldEntity[];
    fieldsByKey: Record<string, FieldEntity>;
    fieldsToExport: FieldEntity[];
    filterFeedbackIds: number[] | undefined;
  }) {
    if (!existsSync('/tmp')) {
      await fs.mkdir('/tmp');
    }
    const project = await this.projectService.findById({ projectId });
    const timezone = project.timezone.name;

    const tempFilePath = path.join(
      '/tmp',
      `temp_${new Date().toString()}.xlsx`,
    );
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: tempFilePath,
    });
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headers = fieldsToExport.map((field) => ({
      header: field.name,
      key: field.name,
    })) as Partial<ExcelJS.Column>[];
    worksheet.columns = headers;

    const pageSize = 1000;
    let feedbacks: Feedback[] = [];
    let currentScrollId: string | null = null;
    let page = 1;
    const feedbackIds: number[] = [];

    do {
      if (this.configService.get('opensearch.use')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data, scrollId } = await this.feedbackOSService.scrollV2({
          channelId,
          queries,
          defaultQueries,
          operator,
          sort,
          fields,
          size: pageSize,
          scrollId: currentScrollId,
        });
        feedbacks = data;
        currentScrollId = scrollId as unknown as string;
      } else {
        const { items } = await this.feedbackMySQLService.findByChannelIdV2({
          channelId,
          queries,
          defaultQueries,
          operator,
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
          feedbacks.map((feedback) => feedback.id as number),
        );

      for (const feedback of feedbacks) {
        if (
          filterFeedbackIds &&
          !filterFeedbackIds.includes(feedback.id as number)
        )
          continue;
        feedback.issues = issuesByFeedbackIds[feedback.id as number];
        const convertedFeedback = this.convertFeedback(
          timezone,
          feedback,
          fieldsByKey,
          fieldsToExport,
        );
        worksheet.addRow(convertedFeedback).commit();
        feedbackIds.push(feedback.id as number);
      }
    } while (feedbacks.length === pageSize);
    worksheet.commit();
    await workbook.commit();

    const fileStream = createReadStream(tempFilePath);

    fileStream.on('end', () => {
      void fs.unlink(tempFilePath);
    });

    return { streamableFile: new StreamableFile(fileStream), feedbackIds };
  }

  private async generateCSVFile({
    projectId,
    channelId,
    queries,
    defaultQueries,
    operator,
    sort,
    fields,
    fieldsByKey,
    fieldsToExport,
    filterFeedbackIds,
  }: {
    projectId: number;
    channelId: number;
    queries: FindFeedbacksByChannelIdDtoV2['queries'];
    defaultQueries: FindFeedbacksByChannelIdDtoV2['defaultQueries'];
    operator: FindFeedbacksByChannelIdDtoV2['operator'];
    sort: FindFeedbacksByChannelIdDtoV2['sort'];
    fields: FieldEntity[];
    fieldsByKey: Record<string, FieldEntity>;
    fieldsToExport: FieldEntity[];
    filterFeedbackIds: number[] | undefined;
  }) {
    const stream = new PassThrough();
    const csvStream = fastcsv.format({
      headers: fieldsToExport.map((field) => field.name),
    });

    csvStream.pipe(stream);

    const project = await this.projectService.findById({ projectId });
    const timezone = project.timezone.name;

    const pageSize = 1000;
    let feedbacks: Record<string, any>[] = [];
    let currentScrollId: number | null = null;
    let page = 1;
    const feedbackIds: number[] = [];

    do {
      if (this.configService.get('opensearch.use')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data, scrollId } = await this.feedbackOSService.scrollV2({
          channelId: channelId,
          queries: queries,
          defaultQueries: defaultQueries,
          operator: operator,
          sort: sort,
          fields: fields,
          size: pageSize,
          scrollId: currentScrollId as unknown as string,
        });
        feedbacks = data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        currentScrollId = scrollId;
      } else {
        const { items } = await this.feedbackMySQLService.findByChannelIdV2({
          channelId: channelId,
          queries: queries,
          defaultQueries: defaultQueries,
          operator: operator,
          sort: sort,
          fields: fields,
          limit: pageSize,
          page,
        });
        feedbacks = items;
        page++;
      }
      const issuesByFeedbackIds =
        await this.issueService.findIssuesByFeedbackIds(
          feedbacks.map((feedback: Feedback) => feedback.id as number),
        );

      for (const feedback of feedbacks) {
        if (
          filterFeedbackIds &&
          !filterFeedbackIds.includes(feedback.id as number)
        )
          continue;

        feedback.issues = issuesByFeedbackIds[feedback.id as number];
        const convertedFeedback = this.convertFeedback(
          timezone,
          feedback,
          fieldsByKey,
          fieldsToExport,
        );
        csvStream.write(convertedFeedback);
        feedbackIds.push(feedback.id as number);
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
      if (
        RESERVED_FIELD_KEYS.filter((key) => key !== 'createdAt').includes(
          fieldKey,
        )
      ) {
        throw new BadRequestException(
          'reserved field key is unavailable: ' + fieldKey,
        );
      }

      const value: number | string | string[] = data[fieldKey] as
        | number
        | string
        | string[];
      const field = fields.find((v) => v.key === fieldKey);

      if (!field) {
        throw new BadRequestException('invalid field key: ' + fieldKey);
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
        const domainWhiteList = channel.imageConfig?.domainWhiteList ?? [];

        if (domainWhiteList.length !== 0) {
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
            status: IssueStatusEnum.INIT,
            description: '',
            externalIssueId: '',
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
    if (dto.query?.fieldKey) {
      const field = fields.find((v) => v.key === dto.query?.fieldKey);
      if (!field) {
        throw new BadRequestException(
          'invalid field key: ' + dto.query.fieldKey.toString(),
        );
      }
      dto.fields = [field];
    } else {
      dto.fields = fields;
    }
    delete dto.query?.fieldKey;

    if (dto.query?.issueName) {
      const issue = await this.issueService.findByName({
        name: dto.query.issueName as string,
      });
      if (issue) {
        dto.query.issueIds = [issue.id];
      } else {
        dto.query.issueIds = [];
      }
    }
    delete dto.query?.issueName;
    if (!dto.query?.searchText) delete dto.query?.searchText;

    let feedbackSearchMaxDays = (
      await this.channelService.findById({
        channelId: dto.channelId,
      })
    ).feedbackSearchMaxDays;

    if (dto.query?.feedbackSearchMaxDays) {
      feedbackSearchMaxDays = dto.query.feedbackSearchMaxDays as number;
      delete dto.query.feedbackSearchMaxDays;
    }

    this.validateQuery(dto.query ?? {}, fields, feedbackSearchMaxDays);

    const feedbacksByPagination =
      this.configService.get('opensearch.use') ?
        await this.feedbackOSService.findByChannelId(dto)
      : await this.feedbackMySQLService.findByChannelId(dto);

    const issuesByFeedbackIds = await this.issueService.findIssuesByFeedbackIds(
      feedbacksByPagination.items.map(
        (feedback: Feedback) => feedback.id as number,
      ),
    );

    feedbacksByPagination.items.forEach((feedback: Feedback) => {
      feedback.issues = issuesByFeedbackIds[feedback.id as number];
      fields.forEach((field) => {
        if (field.format === FieldFormatEnum.aiField) {
          try {
            feedback[field.key] = JSON.parse(
              feedback[field.key] as string,
            ) as object;
          } catch {
            // do nothing when JSON parsing fails
          }
        }
      });
    });

    return feedbacksByPagination;
  }

  async findByChannelIdV2(
    dto: FindFeedbacksByChannelIdDtoV2,
  ): Promise<Pagination<Feedback, IPaginationMeta>> {
    const fields = await this.fieldService.findByChannelId({
      channelId: dto.channelId,
    });
    if (fields.length === 0) {
      throw new BadRequestException('invalid channel');
    }
    dto.fields = fields;

    const feedbackSearchMaxDays = (
      await this.channelService.findById({
        channelId: dto.channelId,
      })
    ).feedbackSearchMaxDays;

    this.validateQueryV2(dto.queries, fields, feedbackSearchMaxDays);
    this.validateQueryV2(dto.defaultQueries, fields, feedbackSearchMaxDays);

    const feedbacksByPagination =
      this.configService.get('opensearch.use') ?
        await this.feedbackOSService.findByChannelIdV2(dto)
      : await this.feedbackMySQLService.findByChannelIdV2(dto);

    const issuesByFeedbackIds = await this.issueService.findIssuesByFeedbackIds(
      feedbacksByPagination.items.map(
        (feedback: Feedback) => feedback.id as number,
      ),
    );

    feedbacksByPagination.items.forEach((feedback: Feedback) => {
      feedback.issues = issuesByFeedbackIds[feedback.id as number];
      fields.forEach((field) => {
        if (field.format === FieldFormatEnum.aiField) {
          try {
            feedback[field.key] = JSON.parse(
              feedback[field.key] as string,
            ) as object;
          } catch {
            // do nothing when JSON parsing fails
          }
        }
      });
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
      if (!(fieldKey in fieldsByKey)) {
        throw new BadRequestException('invalid field name');
      }

      const field = fieldsByKey[fieldKey];

      if (field.property === FieldPropertyEnum.READ_ONLY) {
        throw new BadRequestException('this field is read-only');
      }

      if (field.status === FieldStatusEnum.INACTIVE) {
        throw new BadRequestException('this field is disabled');
      }

      if (field.format === FieldFormatEnum.multiSelect) {
        const values = data[fieldKey] as string[];
        const newValues = values.filter(
          (v) => !(field.options ?? []).find(({ name }) => name === v),
        );
        const newOptions = await this.optionService.createMany({
          fieldId: field.id,
          options: newValues.map((v) => ({ name: v, key: v })),
        });
        field.options = (field.options ?? []).concat(newOptions);
      }

      const value = data[fieldKey] as string;
      if (
        field.format === FieldFormatEnum.select &&
        value &&
        !(field.options ?? []).find((v) => v.name === value)
      ) {
        const newOption = await this.optionService.create({
          fieldId: field.id,
          key: value,
          name: value,
        });
        field.options = (field.options ?? []).concat(newOption);
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
    const {
      projectId,
      channelId,
      queries,
      defaultQueries,
      operator,
      sort,
      type,
      fieldIds,
      filterFeedbackIds,
    } = dto;

    const fields = await this.fieldService.findByChannelId({
      channelId: channelId,
    });
    if (fields.length === 0) throw new BadRequestException('invalid channel');

    let fieldsToExport: FieldEntity[] = fields;
    if (fieldIds) {
      fieldsToExport = await this.fieldService.findByIds(fieldIds);
      if (fields.length === 0) {
        throw new BadRequestException('invalid fieldIds');
      }
    }

    const feedbackSearchMaxDays = (
      await this.channelService.findById({
        channelId: dto.channelId,
      })
    ).feedbackSearchMaxDays;

    this.validateQueryV2(dto.queries, fields, feedbackSearchMaxDays);
    this.validateQueryV2(dto.defaultQueries, fields, feedbackSearchMaxDays);

    const fieldsByKey: Record<string, FieldEntity> = fields.reduce(
      (prev: Record<string, FieldEntity>, field) => {
        prev[field.key] = field;
        return prev;
      },
      {},
    );

    switch (type) {
      case 'xlsx':
        return this.generateXLSXFile({
          projectId,
          channelId,
          queries,
          defaultQueries,
          operator,
          sort,
          fields,
          fieldsByKey,
          fieldsToExport,
          filterFeedbackIds,
        });
      case 'csv':
        return this.generateCSVFile({
          projectId,
          channelId,
          queries,
          defaultQueries,
          operator,
          sort,
          fields,
          fieldsByKey,
          fieldsToExport,
          filterFeedbackIds,
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
        await this.issueService.findIssuesByFeedbackIds([
          feedback.id as number,
        ]);
      feedback.issues = issuesByFeedbackIds[feedback.id as number];

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
    files: File[];
  }) {
    const channel = await this.channelService.findById({ channelId });

    const s3 = new S3Client({
      credentials: {
        accessKeyId: channel.imageConfig?.accessKeyId ?? '',
        secretAccessKey: channel.imageConfig?.secretAccessKey ?? '',
      },
      endpoint: channel.imageConfig?.endpoint,
      region: channel.imageConfig?.region,
    });
    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const key = `${channelId}_${Date.now()}_${file.originalname}`;
          const command = new PutObjectCommand({
            Bucket: channel.imageConfig?.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
          });
          await s3.send(command);

          return {
            ...file,
            url: `${channel.imageConfig?.endpoint}/${channel.imageConfig?.bucket}/${key}`,
          } as ImageUrl;
        }),
      );
      const imageUrlsByKeys: ImageUrlsByKeys = imageUrls.reduce(
        (prev: ImageUrlsByKeys, curr: ImageUrl) => {
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
        },
        {} as ImageUrlsByKeys,
      );

      return imageUrlsByKeys;
    } catch {
      throw new InternalServerErrorException('failed to upload images');
    }
  }
}
