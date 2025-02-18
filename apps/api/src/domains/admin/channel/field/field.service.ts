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
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DateProperty,
  Property,
  TextProperty,
} from '@opensearch-project/opensearch/api/_types/_common.mapping';
import { Transactional } from 'typeorm-transactional';

import { FieldFormatEnum } from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { CreateManyFieldsDto, ReplaceManyFieldsDto } from './dtos';
import type { FieldEntity } from './field.entity';
import { FieldMySQLService } from './field.mysql.service';

export const FIELD_TYPES_TO_MAPPING_TYPES: Record<FieldFormatEnum, string> = {
  text: 'text',
  keyword: 'keyword',
  number: 'integer',
  select: 'keyword',
  multiSelect: 'keyword',
  date: 'date',
  images: 'text',
};

@Injectable()
export class FieldService {
  constructor(
    private readonly fieldMySQLService: FieldMySQLService,
    private readonly osRepository: OpensearchRepository,
    private readonly configService: ConfigService,
  ) {}

  fieldsToMapping(fields: FieldEntity[]) {
    return fields.reduce(
      (mapping: Record<string, Property>, field) =>
        Object.assign(mapping, {
          [field.key]:
            (
              [FieldFormatEnum.text, FieldFormatEnum.images].includes(
                field.format,
              )
            ) ?
              ({
                type: FIELD_TYPES_TO_MAPPING_TYPES[field.format],
                analyzer: 'ngram_analyzer',
                search_analyzer: 'ngram_analyzer',
              } as TextProperty)
            : field.format === FieldFormatEnum.date ?
              ({
                type: FIELD_TYPES_TO_MAPPING_TYPES[field.format],
                format: `yyyy-MM-dd HH:mm:ss||yyyy-MM-dd HH:mm:ssZ||yyyy-MM-dd HH:mm:ssZZZZZ||yyyy-MM-dd||epoch_millis||strict_date_optional_time`,
              } as DateProperty)
            : ({
                type: FIELD_TYPES_TO_MAPPING_TYPES[field.format],
              } as Property),
        }),
      {},
    );
  }

  @Transactional()
  async createMany(dto: CreateManyFieldsDto) {
    const fields = await this.fieldMySQLService.createMany(dto);

    if (this.configService.get('opensearch.use')) {
      await this.osRepository.putMappings({
        index: dto.channelId.toString(),
        mappings: this.fieldsToMapping(fields),
      });
    }

    return fields;
  }

  async findByChannelId(dto: { channelId: number }) {
    return this.fieldMySQLService.findByChannelId(dto);
  }

  @Transactional()
  async replaceMany(dto: ReplaceManyFieldsDto) {
    const createdFields = await this.fieldMySQLService.replaceMany(dto);

    if (this.configService.get('opensearch.use')) {
      await this.osRepository.putMappings({
        index: dto.channelId.toString(),
        mappings: this.fieldsToMapping(createdFields),
      });
    }
  }

  async findByIds(ids: number[]) {
    return this.fieldMySQLService.findByIds(ids);
  }
}
