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
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TestConfigs, clearEntities } from '@/utils/test-utils';

import { FieldEntity } from '../entities/field.entity';
import { OptionEntity } from '../entities/option.entity';
import { FieldTypeEnum } from './dtos/enums';
import { CreateManyOptionsDto, ReplaceManyOptionsDto } from './dtos/options';
import { CreateOptionDto } from './dtos/options/create-option.dto';
import { OptionService } from './option.service';

describe('SelectOption Test suite', () => {
  let optionService: OptionService;

  let dataSource: DataSource;
  let fieldRepo: Repository<FieldEntity>;
  let optionRepo: Repository<OptionEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...TestConfigs,
        TypeOrmModule.forFeature([FieldEntity, OptionEntity]),
      ],
      providers: [OptionService],
    }).compile();

    optionService = module.get<OptionService>(OptionService);

    dataSource = module.get(DataSource);
    fieldRepo = dataSource.getRepository(FieldEntity);
    optionRepo = dataSource.getRepository(OptionEntity);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });
  beforeEach(async () => {
    await clearEntities([fieldRepo, optionRepo]);
  });

  describe('create', () => {
    let field: FieldEntity;
    beforeEach(async () => {
      field = await fieldRepo.save({
        order: 0,
        isDisabled: false,
        name: faker.datatype.string(),
        type: FieldTypeEnum.select,
        isAdmin: false,
      });
    });

    it('', async () => {
      const dto = new CreateOptionDto();

      dto.fieldId = field.id;
      dto.name = faker.datatype.string();

      await optionService.create(dto);

      const option = await optionRepo.findOneBy({
        field: { id: dto.fieldId },
        name: dto.name,
      });

      expect(option).toBeDefined();
    });

    it('duplicated option name', async () => {
      await optionRepo.save({ field: { id: field.id }, name: 'option' });

      const dto = new CreateOptionDto();
      dto.fieldId = field.id;
      dto.name = 'option';

      await expect(optionService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createMany', () => {
    let field: FieldEntity;
    beforeEach(async () => {
      field = await fieldRepo.save({
        order: 0,
        isDisabled: false,
        name: faker.datatype.string(),
        type: FieldTypeEnum.select,
        isAdmin: false,
      });
    });
    it('', async () => {
      const total = faker.datatype.number({ min: 1, max: 10 });

      await optionService.createMany({
        fieldId: field.id,
        options: Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
        })),
      });

      const options = await optionRepo.findBy({
        field: { id: field.id },
      });
      expect(options).toHaveLength(total);
    });
    it('duplicated option name', async () => {
      const dto = new CreateManyOptionsDto();
      dto.fieldId = field.id;
      dto.options = Array.from({ length: 2 }).map(() => ({
        name: 'option',
      }));
      await expect(optionService.createMany(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('replace many', () => {
    let field: FieldEntity;
    let options: OptionEntity[];
    beforeEach(async () => {
      const optionCount = faker.datatype.number({ min: 5, max: 10 });

      options = optionRepo.create(
        Array.from({ length: optionCount }).map(() => ({
          name: faker.datatype.string(),
        })),
      );
      field = await fieldRepo.save({
        order: 0,
        isDisabled: false,
        name: faker.datatype.string(),
        description: faker.datatype.string(),
        type: FieldTypeEnum.select,
        isAdmin: false,
        options,
      });
    });

    it('', async () => {
      const existingSelectOptions = faker.helpers.arrayElements(options);

      const updatingDtos = existingSelectOptions.map((v) => ({
        id: v.id,
        name: faker.datatype.string(),
      }));

      const creatingDtos = Array.from({
        length: faker.datatype.number({ min: 1, max: 10 }),
      }).map(() => ({ name: faker.datatype.string() }));

      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = field.id;
      dto.options = [...creatingDtos, ...updatingDtos];

      await optionService.replaceMany(dto);

      const results = await optionRepo.findBy({
        field: { id: field.id },
      });

      expect(results.map((v) => v.name).sort()).toMatchObject(
        dto.options.map((v) => v.name).sort(),
      );
    });
  });
});
