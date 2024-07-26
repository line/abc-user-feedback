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
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { validateUnique } from '@/utils/validate-unique';
import {
  CreateManyOptionsDto,
  CreateOptionDto,
  ReplaceManyOptionsDto,
} from './dtos';
import {
  OptionKeyDuplicatedException,
  OptionNameDuplicatedException,
} from './exceptions';
import { OptionEntity } from './option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly repository: Repository<OptionEntity>,
  ) {}

  private getInactiveOption(
    options: OptionEntity[],
    key: string,
    name: string,
  ) {
    return options.find(
      (option) => option.key === 'deleted_' + key && option.name === name,
    );
  }

  @Transactional()
  async create({ fieldId, name, key }: CreateOptionDto) {
    const options = await this.repository.findBy({
      field: { id: fieldId },
    });

    const inactiveOption = this.getInactiveOption(options, key, name);
    if (inactiveOption) {
      await this.repository.save(
        Object.assign(inactiveOption, { deletedAt: null, key }),
      );
      return inactiveOption;
    }

    if (options.map((v) => v.name).includes(name)) {
      throw new OptionNameDuplicatedException();
    }
    if (options.map((v) => v.key).includes(key)) {
      throw new OptionKeyDuplicatedException();
    }
    const option = OptionEntity.from({ fieldId, name, key });

    return await this.repository.save(option);
  }

  @Transactional()
  async createMany({ fieldId, options }: CreateManyOptionsDto) {
    if (!validateUnique(options, 'name')) {
      throw new OptionNameDuplicatedException();
    }
    if (!validateUnique(options, 'key')) {
      throw new OptionKeyDuplicatedException();
    }

    const newOptions = options.map((option) =>
      OptionEntity.from({ fieldId, ...option }),
    );

    return await this.repository.save(newOptions);
  }

  async findByFieldId({ fieldId }: { fieldId: number }) {
    return await this.repository.findBy({ field: { id: fieldId } });
  }

  @Transactional()
  async replaceMany({ fieldId, options }: ReplaceManyOptionsDto) {
    if (!validateUnique(options, 'name')) {
      throw new OptionNameDuplicatedException();
    }
    if (!validateUnique(options, 'key')) {
      throw new OptionKeyDuplicatedException();
    }

    const optionEntities = await this.repository.find({
      where: { field: { id: fieldId } },
      withDeleted: true,
    });

    const deletingOptionIds = optionEntities
      .filter((option) => option.deletedAt.getTime() === 0)
      .filter((option) => (options ?? []).every((dto) => dto.id !== option.id))
      .map((v) => v.id);

    if (deletingOptionIds.length > 0) {
      await this.repository.query(
        `
      UPDATE
        \`options\`
      SET
        \`key\` = CONCAT("deleted_", \`key\`),
        \`deleted_at\` = ?
      where
        \`id\` IN(?)
      `,
        [
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          deletingOptionIds,
        ],
      );
    }

    for (const option of options ?? []) {
      const inactiveOption = this.getInactiveOption(
        optionEntities,
        option.key,
        option.name,
      );
      if (inactiveOption) {
        await this.repository.save(
          Object.assign(inactiveOption, { deletedAt: null, key: option.key }),
        );
        continue;
      }

      const optionEntity = OptionEntity.from({ fieldId, ...option });
      if (option.id) optionEntity.id = option.id;

      await this.repository.save(optionEntity);
    }
  }
}
