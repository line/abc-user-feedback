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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { validateUnique } from '@/utils/validate-unique';

import { FieldEntity } from '../entities/field.entity';
import { FieldNameDuplicatedException } from '../exceptions/fields';
import { ElasticsearchRepository } from '../repositories';
import { FieldTypeEnum } from './dtos/enums';
import { CreateManyFieldsDto, ReplaceManyFieldsDto } from './dtos/fields';
import { CreateFieldDto } from './dtos/fields/create-field.dto';
import { ReplaceFieldDto } from './dtos/fields/replace-field.dto';
import { RESERVED_FIELD_NAMES } from './field.constants';
import { OptionService } from './option.service';

export const FIELD_TYPES_TO_MAPPING_TYPES: Record<FieldTypeEnum, string> = {
  text: 'text',
  keyword: 'keyword',
  number: 'integer',
  boolean: 'boolean',
  select: 'keyword',
  date: 'date',
};

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly repository: Repository<FieldEntity>,
    private readonly esRepository: ElasticsearchRepository,
    private readonly optionService: OptionService,
  ) {}

  @Transactional()
  async createMany({ channelId, fields }: CreateManyFieldsDto) {
    this.checkValidation(fields);
    this.chackReservedFieldName(fields);

    const fieldsToCreate: CreateFieldDto[] = [
      ...fields,
      {
        name: 'createdAt',
        type: FieldTypeEnum.date,
        isAdmin: false,
        isDisabled: false,
        order: fields.length + 1,
        description: '',
      },
      {
        name: 'updatedAt',
        type: FieldTypeEnum.date,
        isAdmin: false,
        isDisabled: false,
        order: fields.length + 2,
        description: '',
      },
    ];

    const fieldEntities = [];
    for (const field of fieldsToCreate) {
      const { type, options, name, ...rest } = field;

      const fieldEntity = await this.repository.save({
        ...rest,
        name,
        type,
        channel: { id: channelId },
      });
      fieldEntities.push(fieldEntity);

      if (type === FieldTypeEnum.select && options.length > 0) {
        await this.optionService.createMany({
          fieldId: fieldEntity.id,
          options,
        });
      }
    }

    await this.esRepository.putMappings({
      index: channelId,
      mappings: this.fieldsToMapping(fieldEntities),
    });
  }

  // get options
  async findByChannelId({ channelId }: { channelId: string }) {
    return await this.repository.find({
      where: { channel: { id: channelId } },
      relations: { options: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findById({ id }: { id: string }) {
    return await this.repository.findOne({
      where: { id },
      relations: { options: true },
    });
  }

  // no delete
  @Transactional()
  async replaceMany({ channelId, fields }: ReplaceManyFieldsDto) {
    this.checkValidation(fields);

    const creatingFieldDtos = fields.filter((v) => !v.id);
    this.chackReservedFieldName(creatingFieldDtos);

    const updatingFieldDtos = fields.filter(
      (v) => v.id && v.name !== 'createdAt' && v.name !== 'updatedAt',
    );

    const fieldEntities = await this.repository.findBy({
      channel: { id: channelId },
    });

    for (const { id, type, options, ...rest } of updatingFieldDtos) {
      const fieldEntity = fieldEntities.find((v) => v.id === id);
      if (!fieldEntity) {
        throw new BadRequestException('field must be included');
      }
      if (type !== fieldEntity.type) {
        throw new BadRequestException('field type cannot changed');
      }
      await this.repository.update(id, { id, type, ...rest });
      if (type === FieldTypeEnum.select) {
        await this.optionService.replaceMany({ fieldId: id, options });
      }
    }

    const createdFields = [];
    for (const { type, options, ...rest } of creatingFieldDtos) {
      const createdField = await this.repository.save({
        ...rest,
        type,
        channel: { id: channelId },
      });
      createdFields.push(createdField);

      if (type === FieldTypeEnum.select && options.length > 0) {
        await this.optionService.createMany({
          fieldId: createdField.id,
          options,
        });
      }
    }

    await this.esRepository.putMappings({
      index: channelId,
      mappings: this.fieldsToMapping(createdFields),
    });
  }

  private checkValidation(fields: (CreateFieldDto | ReplaceFieldDto)[]) {
    if (!validateUnique(fields, 'name')) {
      throw new FieldNameDuplicatedException();
    }
    fields.forEach(({ type, options }) => {
      if (!this.isValidField(type, options)) {
        throw new BadRequestException('only select type field has options');
      }
    });
  }

  private chackReservedFieldName(fields: (CreateFieldDto | ReplaceFieldDto)[]) {
    fields.forEach(({ name }) => {
      if (RESERVED_FIELD_NAMES.includes(name)) {
        throw new BadRequestException('name is rejected');
      }
    });
  }

  private isValidField(
    type: FieldTypeEnum,
    options: { id?: string; name: string }[],
  ) {
    if (type === FieldTypeEnum.select) {
      return !options || Array.isArray(options);
    }
    return true;
  }

  private fieldsToMapping(fields: { type: FieldTypeEnum; id: string }[]) {
    return fields.reduce(
      (mapping: Record<string, { type: string }>, field) =>
        Object.assign(mapping, {
          [field.id]:
            field.type === FieldTypeEnum.text
              ? {
                  type: FIELD_TYPES_TO_MAPPING_TYPES[field.type],
                  analyzer: 'ngram_analyzer',
                  search_analyzer: 'ngram_analyzer',
                }
              : { type: FIELD_TYPES_TO_MAPPING_TYPES[field.type] },
        }),
      {},
    );
  }
}
