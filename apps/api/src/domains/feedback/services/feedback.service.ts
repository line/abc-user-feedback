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
import dayjs from 'dayjs';

import { FieldEntity } from '../entities/field.entity';
import { ElasticsearchRepository } from '../repositories';
import {
  CreateFeedbackDto,
  FieldTypeEnum,
  FindFeedbacksByChannelIdDto,
} from './dtos';
import { EsQueryDto, MustItem, timeRange } from './dtos/feedbacks/es-query.dto';
import { UpsertFeedbackItemDto } from './dtos/feedbacks/upsert-feedback-item.dto';
import { RESERVED_FIELD_NAMES } from './field.constants';
import { FieldService } from './field.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly fieldService: FieldService,
    private readonly esRepository: ElasticsearchRepository,
  ) {}

  private esQueryBulider(
    query: FindFeedbacksByChannelIdDto['query'],
    fields: FieldEntity[],
  ): EsQueryDto {
    const fieldsByName = fields.reduce(
      (fields: Record<string, FieldEntity>, field) => {
        fields[field.name] = field;
        return fields;
      },
      {},
    );

    return Object.keys(query).reduce(
      (esQuery, fieldName) => {
        const { type, id, options } = fieldsByName[fieldName];

        const must_item: MustItem = {};
        if (type === FieldTypeEnum.select) {
          must_item.match_phrase = {
            [id]: options.find((option) => option.name === query[fieldName]).id,
          };
        } else if (type === FieldTypeEnum.date) {
          must_item.range = {
            [id]: query[fieldName] as timeRange,
          };
        } else if (type === FieldTypeEnum.text) {
          must_item.match_phrase = {
            [id]: query[fieldName] as string,
          };
        } else {
          must_item.term = {
            [id]: query[fieldName] as string,
          };
        }

        esQuery.bool.must.push(must_item);

        return esQuery;
      },
      { bool: { must: [] } },
    );
  }

  async create({ channelId, data }: CreateFeedbackDto) {
    const fields = await this.fieldService.findByChannelId({ channelId });

    const feedbackData: Record<string, any> = {};

    for (const fieldName of Object.keys(data)) {
      if (RESERVED_FIELD_NAMES.includes(fieldName)) {
        throw new BadRequestException('reserved field is not created');
      }

      const value = data[fieldName];
      const field = fields.find((v) => v.name === fieldName);

      if (!field) {
        throw new BadRequestException('invalid field name: ' + fieldName);
      }

      if (field.isAdmin) {
        throw new BadRequestException('this field is for admin: ' + fieldName);
      }

      if (field.isDisabled) {
        throw new BadRequestException('this field is disabled: ' + fieldName);
      }

      if (!this.validateValue(field, value)) {
        throw new BadRequestException(
          `invalid value: (value: ${value}, type: ${field.type}, fieldName: ${field.name})`,
        );
      }

      feedbackData[field.id] =
        field.type === FieldTypeEnum.select
          ? field.options.find((v) => v.name === value)?.id
          : field.type === FieldTypeEnum.date
          ? new Date(value)
          : value;
    }

    return await this.esRepository.createData({
      index: channelId,
      data: {
        ...feedbackData,
        [fields.find((v) => v.name === 'createdAt')?.id]: dayjs().toISOString(),
        [fields.find((v) => v.name === 'updatedAt')?.id]: dayjs().toISOString(),
      },
    });
  }

  async findByChannelId(dto: FindFeedbacksByChannelIdDto) {
    const { channelId, limit, page, query } = dto;

    const fields = await this.fieldService.findByChannelId({ channelId });

    const { items, total } = await this.esRepository.getData({
      index: channelId,
      limit,
      page,
      query: this.esQueryBulider(query, fields),
    });

    return {
      items: items.map((data) => {
        return Object.entries(data).reduce((prev, [key, value]) => {
          if (key === 'id') return Object.assign(prev, { [key]: value });
          const field = fields.find((v) => v.id === key);
          return Object.assign(prev, {
            [field.name]:
              field.type === FieldTypeEnum.select
                ? field.options.find((option) => option.id === value)?.name
                : value,
          });
        }, {});
      }),
      total,
    };
  }

  async upsertFeedbackItem(dto: UpsertFeedbackItemDto) {
    const { fieldId, feedbackId, value, channelId } = dto;

    const fields = await this.fieldService.findByChannelId({ channelId });

    const targetField = fields.find((v) => v.id === fieldId);

    if (!targetField) {
      throw new BadRequestException('invalid field name');
    }

    if (!targetField.isAdmin) {
      throw new BadRequestException('this field is for admin');
    }

    if (targetField.isDisabled) {
      throw new BadRequestException('this field is disabled');
    }

    if (!this.validateValue(targetField, value)) {
      throw new BadRequestException(
        `invalid value: (value: ${value}, type: ${targetField.type})`,
      );
    }

    await this.esRepository.updateData({
      id: feedbackId,
      index: channelId,
      key: targetField.id,
      value:
        targetField.type === FieldTypeEnum.select
          ? targetField.options.find((v) => v.name === value)?.id
          : value,
    });

    const updatedAtField = fields.find((v) => v.name === 'updatedAt');

    await this.esRepository.updateData({
      id: feedbackId,
      index: channelId,
      key: updatedAtField.id,
      value: dayjs().toISOString(),
    });
  }

  private validateValue(field: FieldEntity, value: any) {
    switch (field.type) {
      case FieldTypeEnum.boolean:
        return typeof value === 'boolean';
      case FieldTypeEnum.number:
        return typeof value === 'number';
      case FieldTypeEnum.text:
        return typeof value === 'string';
      case FieldTypeEnum.keyword:
        return typeof value === 'string';
      case FieldTypeEnum.select:
        return (
          value === undefined ||
          (typeof value === 'string' &&
            !!field.options.find((v) => v.name === value))
        );
      case FieldTypeEnum.date:
        return !isNaN(Date.parse(value));
      default:
        throw new Error(`${field.type} is error ${value}`);
    }
  }
}
