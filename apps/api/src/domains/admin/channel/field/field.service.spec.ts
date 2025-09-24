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
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { FieldFormatEnum, isSelectFieldFormat } from '@/common/enums';
import { createFieldDto, updateFieldDto } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { FieldServiceProviders } from '../../../../test-utils/providers/field.service.providers';
import { OptionEntity } from '../option/option.entity';
import type { CreateFieldDto, ReplaceFieldDto } from './dtos';
import { CreateManyFieldsDto, ReplaceManyFieldsDto } from './dtos';
import {
  FieldKeyDuplicatedException,
  FieldNameDuplicatedException,
} from './exceptions';
import { FieldEntity } from './field.entity';
import { FieldService } from './field.service';

const countSelect = (prev: number, curr: CreateFieldDto): number => {
  return (
      isSelectFieldFormat(curr.format) &&
        curr.options &&
        curr.options.length > 0
    ) ?
      prev + 1
    : prev;
};

describe('FieldService suite', () => {
  let fieldService: FieldService;
  let fieldRepo: Repository<FieldEntity>;
  let optionRepo: Repository<OptionEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: FieldServiceProviders,
    }).compile();

    fieldService = module.get<FieldService>(FieldService);
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    optionRepo = module.get(getRepositoryToken(OptionEntity));
  });

  describe('createMany', () => {
    it('creating many fields succeeds with valid inputs', async () => {
      const channelId = faker.number.int();
      const fieldCount = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);
      const selectFieldCount = dto.fields.reduce(countSelect, 0);
      jest.spyOn(fieldRepo, 'save');
      jest.spyOn(optionRepo, 'save');

      const fields = await fieldService.createMany(dto);

      expect(fields.length).toBe(fieldCount + 4);

      expect(optionRepo.save).toHaveBeenCalledTimes(selectFieldCount);
    });
    it('creating many fields fails with duplicate names', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: 2 }).map(() =>
        createFieldDto({ name: 'duplicateName' }),
      );

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        FieldNameDuplicatedException,
      );
    });
    it('creating many fields fails with duplicate keys', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: 2 }).map(() =>
        createFieldDto({ key: 'duplicateKey' }),
      );

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        FieldKeyDuplicatedException,
      );
    });
    it('creating many fields fails with options in non-select format field', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: 1 }).map(() =>
        createFieldDto({
          format: FieldFormatEnum.text,
          options: [
            { key: faker.string.sample(), name: faker.string.sample() },
          ],
        }),
      );

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        new BadRequestException('only select format field has options'),
      );
    });
  });
  describe('replaceMany', () => {
    it('replacing many fields succeeds with valid inputs', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(updateFieldDto);
      const creatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(createFieldDto);
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos, ...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);
      jest.spyOn(fieldRepo, 'save');

      await fieldService.replaceMany(dto);

      expect(fieldRepo.save).toHaveBeenCalledTimes(
        updatingFieldDtos.length + creatingFieldDtos.length,
      );
    });
    it('replacing many fields fails with duplicate names', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: 2,
      }).map(() => updateFieldDto({ name: 'duplicateName' }));
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        FieldNameDuplicatedException,
      );
    });
    it('replacing many fields fails with duplicate keys', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: 2,
      }).map(() => updateFieldDto({ key: 'duplicateKey' }));
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        FieldKeyDuplicatedException,
      );
    });
    it('replacing many fields fails with options in non-select format field', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: 1,
      }).map(() =>
        updateFieldDto({
          format: FieldFormatEnum.text,
          options: [
            { key: faker.string.sample(), name: faker.string.sample() },
          ],
        }),
      );
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('only select format field has options'),
      );
    });
    it('replacing many fields fails with a nonexistent field', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(updateFieldDto);
      const creatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(createFieldDto);
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos, ...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos.splice(1) as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('field must be included'),
      );
    });
    it('replacing many fields fails with a format change', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(() => updateFieldDto({ format: FieldFormatEnum.keyword }));
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = JSON.parse(
        JSON.stringify(updatingFieldDtos),
      ) as ReplaceFieldDto[];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue(
        updatingFieldDtos.map((field) => {
          field.format = FieldFormatEnum.text;
          return field;
        }) as FieldEntity[],
      );
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('field format cannot be changed'),
      );
    });
    it('replacing many fields fails with a key change', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(updateFieldDto);
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = JSON.parse(
        JSON.stringify(updatingFieldDtos),
      ) as ReplaceFieldDto[];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue(
        updatingFieldDtos.map((field) => {
          field.key = faker.string.sample();
          return field;
        }) as FieldEntity[],
      );
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('field key cannot be changed'),
      );
    });
  });
});
