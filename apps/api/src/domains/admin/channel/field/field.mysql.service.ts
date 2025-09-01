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
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
  isSelectFieldFormat,
} from '@/common/enums';
import { validateUnique } from '@/utils/validate-unique';
import { AIFieldTemplatesEntity } from '../../project/ai/ai-field-templates.entity';
import { OptionService } from '../option/option.service';
import type { CreateFieldDto, ReplaceFieldDto } from './dtos';
import { CreateManyFieldsDto, ReplaceManyFieldsDto } from './dtos';
import {
  FieldKeyDuplicatedException,
  FieldNameDuplicatedException,
} from './exceptions';
import { RESERVED_FIELD_KEYS, RESERVED_FIELD_NAMES } from './field.constants';
import { FieldEntity } from './field.entity';

@Injectable()
export class FieldMySQLService {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly repository: Repository<FieldEntity>,
    private readonly optionService: OptionService,
  ) {}

  private checkValidation(fields: (CreateFieldDto | ReplaceFieldDto)[]) {
    if (!validateUnique(fields, 'name')) {
      throw new FieldNameDuplicatedException();
    }
    if (!validateUnique(fields, 'key')) {
      throw new FieldKeyDuplicatedException();
    }
    fields.forEach(({ key }) => {
      if (/^[a-z0-9_]+$/i.test(key) === false) {
        throw new BadRequestException(
          'field key only should contain alphanumeric and underscore',
        );
      }
    });
    fields.forEach(({ format, options }) => {
      if (!this.isValidField(format, options ?? [])) {
        throw new BadRequestException('only select format field has options');
      }
    });
  }

  private checkReservedFieldName(fields: (CreateFieldDto | ReplaceFieldDto)[]) {
    fields.forEach(({ name }) => {
      if (RESERVED_FIELD_NAMES.includes(name)) {
        throw new BadRequestException('name is rejected');
      }
    });
  }

  private checkReservedFieldKey(fields: (CreateFieldDto | ReplaceFieldDto)[]) {
    fields.forEach(({ key }) => {
      if (RESERVED_FIELD_KEYS.includes(key)) {
        throw new BadRequestException('key is rejected');
      }
    });
  }

  private isValidField(
    type: FieldFormatEnum,
    options: { id?: number; name: string }[],
  ) {
    if (isSelectFieldFormat(type)) {
      return options.length === 0 || Array.isArray(options);
    } else {
      return options.length === 0 || !Array.isArray(options);
    }
  }

  @Transactional()
  async createMany({ channelId, fields }: CreateManyFieldsDto) {
    this.checkValidation(fields);
    this.checkReservedFieldName(fields);
    this.checkReservedFieldKey(fields);

    const fieldsToCreate: CreateFieldDto[] = [
      {
        name: 'ID',
        key: 'id',
        format: FieldFormatEnum.number,
        property: FieldPropertyEnum.READ_ONLY,
        status: FieldStatusEnum.ACTIVE,
        description: '',
      },
      {
        name: 'Created',
        key: 'createdAt',
        format: FieldFormatEnum.date,
        property: FieldPropertyEnum.READ_ONLY,
        status: FieldStatusEnum.ACTIVE,
        description: '',
      },
      {
        name: 'Updated',
        key: 'updatedAt',
        format: FieldFormatEnum.date,
        property: FieldPropertyEnum.READ_ONLY,
        status: FieldStatusEnum.ACTIVE,
        description: '',
      },
      {
        name: 'Issue',
        key: 'issues',
        format: FieldFormatEnum.multiSelect,
        property: FieldPropertyEnum.EDITABLE,
        status: FieldStatusEnum.ACTIVE,
        description: '',
      },
      ...fields,
    ];

    const fieldEntities: FieldEntity[] = [];
    for (const field of fieldsToCreate) {
      const { format, options = [] } = field;
      const newField = FieldEntity.from({ channelId, ...field });
      const { id } = await this.repository.save(newField);
      fieldEntities.push(newField);

      if (isSelectFieldFormat(format) && options.length > 0) {
        await this.optionService.createMany({
          fieldId: id,
          options,
        });
      }
    }

    return fieldEntities;
  }

  async findByChannelId({ channelId }: { channelId: number }) {
    return await this.repository.find({
      where: { channel: { id: channelId } },
      relations: { options: true },
      order: { createdAt: 'ASC' },
    });
  }

  @Transactional()
  async replaceMany({ channelId, fields }: ReplaceManyFieldsDto) {
    this.checkValidation(fields);

    const creatingFieldDtos = fields.filter((v) => !v.id);
    this.checkReservedFieldName(creatingFieldDtos);
    this.checkReservedFieldKey(creatingFieldDtos);

    const updatingFieldDtos = fields.filter(
      (v) =>
        v.id &&
        (!['id', 'createdAt', 'updatedAt', 'issues'].includes(v.key) ||
          v.order),
    );

    const fieldEntities = await this.repository.findBy({
      channel: { id: channelId },
    });

    for (const { id = 0, format, key, options, ...rest } of updatingFieldDtos) {
      const fieldEntity = fieldEntities.find((v) => v.id === id);
      if (!fieldEntity) {
        throw new BadRequestException('field must be included');
      }
      if (format !== fieldEntity.format) {
        throw new BadRequestException('field format cannot be changed');
      }
      if (key !== fieldEntity.key) {
        throw new BadRequestException('field key cannot be changed');
      }
      const field = Object.assign(fieldEntity, rest);
      if (rest.aiFieldTemplateId) {
        field.aiFieldTemplate = new AIFieldTemplatesEntity();
        field.aiFieldTemplate.id = rest.aiFieldTemplateId;
      }
      await this.repository.save(field);
      if (isSelectFieldFormat(format)) {
        await this.optionService.replaceMany({ fieldId: id, options });
      }
    }

    const createdFields: FieldEntity[] = [];
    for (const field of creatingFieldDtos) {
      const { format, options = [] } = field;
      const newField = FieldEntity.from({ channelId, ...field });
      const createdField = await this.repository.save(newField);
      createdFields.push(createdField);

      if (isSelectFieldFormat(format) && options.length > 0) {
        await this.optionService.createMany({
          fieldId: createdField.id,
          options,
        });
      }
    }

    return createdFields;
  }

  async findByIds(ids: number[]) {
    const fields = await this.repository.find({
      where: { id: In(ids) },
      withDeleted: true,
    });
    const fieldMap = new Map(fields.map((field) => [field.id, field]));
    return ids.map((id) => fieldMap.get(id) ?? new FieldEntity());
  }
}
