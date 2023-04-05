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
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { validateUnique } from '@/utils/validate-unique';

import { OptionEntity } from '../entities/option.entity';
import { OptionNameDuplicatedException } from '../exceptions/options';
import {
  CreateManyOptionsDto,
  CreateOptionDto,
  ReplaceManyOptionsDto,
} from './dtos/options';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly repository: Repository<OptionEntity>,
  ) {}

  async create({ fieldId, name }: CreateOptionDto) {
    const options = await this.repository.findBy({
      field: { id: fieldId },
    });

    if (options.map((v) => v.name).includes(name)) {
      throw new OptionNameDuplicatedException();
    }

    return await this.repository.save({
      name,
      field: { id: fieldId },
    });
  }

  @Transactional()
  async createMany({ fieldId, options }: CreateManyOptionsDto) {
    if (!validateUnique(options, 'name')) {
      throw new OptionNameDuplicatedException();
    }

    await this.repository.save(
      options.map(({ name }) => ({ name, field: { id: fieldId } })),
    );
  }

  async findByFieldId({ fieldId }: { fieldId: string }) {
    return await this.repository.findBy({ field: { id: fieldId } });
  }

  @Transactional()
  async replaceMany({ fieldId, options }: ReplaceManyOptionsDto) {
    if (!validateUnique(options, 'name')) {
      throw new OptionNameDuplicatedException();
    }

    const optionEntities = await this.repository.findBy({
      field: { id: fieldId },
    });

    const deletingOptionIds = optionEntities
      .filter((option) => options.every((dto) => dto.id !== option.id))
      .map((v) => v.id);

    await this.repository.delete({ id: In(deletingOptionIds) });

    for (const option of options) {
      await this.repository.upsert(
        { ...option, field: { id: fieldId } },
        { conflictPaths: { id: true } },
      );
    }
  }
}
