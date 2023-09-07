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
import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '@/common/enums';
import { OS_USE } from '@/configs/opensearch.config';

import { ChannelService } from '../channel/channel/channel.service';
import { RESERVED_FIELD_KEYS } from '../channel/field/field.constants';
import { FieldEntity } from '../channel/field/field.entity';
import { FieldService } from '../channel/field/field.service';
import { OptionService } from '../channel/option/option.service';
import { IssueService } from '../project/issue/issue.service';
import {
  AddIssueDto,
  CountByProjectIdDto,
  CreateFeedbackDto,
  DeleteByIdsDto,
  FindFeedbacksByChannelIdDto,
  FindFeedbacksForDownloadDto,
  FindFeedbacksForDownloadInMysqlDto,
  RemoveIssueDto,
  UpdateFeedbackDto,
} from './dtos';
import { Feedback } from './dtos/responses/find-feedbacks-by-channel-id-response.dto';
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
        case FieldFormatEnum.boolean:
          if (typeof query[fieldKey] !== 'boolean')
            throw new BadRequestException(`${fieldKey} must be boolean`);
          break;
        case FieldFormatEnum.keyword:
          if (typeof query[fieldKey] !== 'string')
            throw new BadRequestException(`${fieldKey} must be string`);
          break;
        case FieldFormatEnum.date:
          if (
            typeof query[fieldKey] !== 'object' ||
            !(
              query[fieldKey].hasOwnProperty('gte') &&
              query[fieldKey].hasOwnProperty('lt')
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
      }
    }
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

      if (field.status === FieldStatusEnum.INACTIVE) {
        throw new BadRequestException('this field is inactive: ' + fieldKey);
      }

      if (!validateValue(field, value)) {
        throw new BadRequestException(
          `invalid value: (value: ${JSON.stringify(value)}, type: ${
            field.format
          }, fieldKey: ${field.key})`,
        );
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

    if (OS_USE) {
      await this.feedbackOSService.create({ channelId, feedback });
    }

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

    const feedbacksByPagination = OS_USE
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

  async findForDownload(dto: FindFeedbacksForDownloadDto) {
    const fields = await this.fieldService.findByChannelId({
      channelId: dto.channelId,
    });
    if (fields.length === 0) throw new BadRequestException('invalid channel');

    this.validateQuery(dto.query, fields);

    const feedbacks = OS_USE
      ? await this.feedbackOSService.findForDownload({ ...dto, fields })
      : await this.getAllFeedbacksInMySql({ ...dto, fields });

    const issuesByFeedbackIds = await this.issueService.findIssuesByFeedbackIds(
      feedbacks.map((feedback) => feedback.id),
    );

    feedbacks.forEach((feedback) => {
      feedback.issues = issuesByFeedbackIds[feedback.id];
    });

    const fieldsByKey = fields.reduce(
      (prev: Record<string, FieldEntity>, field) => {
        prev[field.key] = field;
        return prev;
      },
      {},
    );

    return {
      feedbacks: feedbacks.map((feedback) => {
        const convertedFeedback: Record<string, any> = {};
        for (const key of Object.keys(feedback)) {
          convertedFeedback[fieldsByKey[key].name] = Array.isArray(
            feedback[key],
          )
            ? key === 'issues'
              ? feedback[key].map((issue) => issue.name).join(', ')
              : feedback[key].join(', ')
            : feedback[key];
        }
        return convertedFeedback;
      }),
      fields,
    };
  }

  private async getAllFeedbacksInMySql(
    dto: FindFeedbacksForDownloadInMysqlDto,
  ) {
    const results = [];
    let page = 1;
    while (true) {
      const { items } = await this.feedbackMySQLService.findByChannelId({
        ...dto,
        limit: dto.size,
        page: page++,
      });
      if (items.length === 0) break;
      results.push(...items);
    }

    return results;
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

    if (OS_USE) {
      await this.feedbackOSService.upsertFeedbackItem({
        feedbackId,
        data,
        channelId,
      });
    }
  }

  @Transactional()
  async addIssue(dto: AddIssueDto) {
    return this.feedbackMySQLService.addIssue(dto);
  }

  @Transactional()
  async removeIssue(dto: RemoveIssueDto) {
    return this.feedbackMySQLService.removeIssue(dto);
  }

  async countByProjectId(dto: CountByProjectIdDto) {
    return { total: await this.feedbackMySQLService.countByProjectId(dto) };
  }

  @Transactional()
  async deleteByIds(dto: DeleteByIdsDto) {
    await this.feedbackMySQLService.deleteByIds(dto);

    if (OS_USE) {
      await this.feedbackOSService.deleteByIds(dto);
    }
  }
}
