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
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TestConfig } from '@/test-utils/util-functions';
import { OptionServiceProviders } from '../../../../test-utils/providers/option.service.providers';
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
import { OptionService } from './option.service';

describe('Option Test suite', () => {
  let optionService: OptionService;
  let optionRepo: Repository<OptionEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: OptionServiceProviders,
    }).compile();

    optionService = module.get<OptionService>(OptionService);
    optionRepo = module.get(getRepositoryToken(OptionEntity));
  });

  describe('create', () => {
    it('creating an option succeeds with a new valid input', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.string.sample();
      dto.name = faker.string.sample();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          key: faker.string.sample(),
          name: faker.string.sample(),
        },
      ] as OptionEntity[]);
      jest.spyOn(optionRepo, 'save');

      await optionService.create(dto);

      expect(optionRepo.findBy).toBeCalledTimes(1);
      expect(optionRepo.findBy).toBeCalledWith({
        field: { id: fieldId },
      });
      expect(optionRepo.save).toBeCalledTimes(1);
      expect(optionRepo.save).toBeCalledWith({
        key: dto.key,
        name: dto.name,
        field: { id: fieldId },
      });
    });
    it('creating an option succeeds with an inactive input', async () => {
      const fieldId = faker.number.int();
      const optionId = faker.number.int();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.string.sample();
      dto.name = faker.string.sample();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          id: optionId,
          key: 'deleted_' + dto.key,
          name: dto.name,
        },
      ] as OptionEntity[]);
      jest.spyOn(optionRepo, 'save');

      await optionService.create(dto);

      expect(optionRepo.findBy).toBeCalledTimes(1);
      expect(optionRepo.findBy).toBeCalledWith({
        field: { id: fieldId },
      });
      expect(optionRepo.save).toBeCalledTimes(1);
      expect(optionRepo.save).toBeCalledWith({
        id: optionId,
        deletedAt: null,
        key: dto.key,
        name: dto.name,
      });
    });
    it('creating an option fais with a duplicate name', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.string.sample();
      dto.name = faker.string.sample();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          key: faker.string.sample(),
          name: dto.name,
        },
      ] as OptionEntity[]);
      jest.spyOn(optionRepo, 'save');

      await expect(optionService.create(dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );

      expect(optionRepo.findBy).toBeCalledTimes(1);
      expect(optionRepo.findBy).toBeCalledWith({
        field: { id: fieldId },
      });
      expect(optionRepo.save).not.toBeCalled();
    });
    it('creating an option fais with a duplicate key', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.string.sample();
      dto.name = faker.string.sample();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          key: dto.key,
          name: faker.string.sample(),
        },
      ] as OptionEntity[]);
      jest.spyOn(optionRepo, 'save');

      await expect(optionService.create(dto)).rejects.toThrow(
        OptionKeyDuplicatedException,
      );

      expect(optionRepo.findBy).toBeCalledTimes(1);
      expect(optionRepo.findBy).toBeCalledWith({
        field: { id: fieldId },
      });
      expect(optionRepo.save).not.toBeCalled();
    });
  });

  describe('createMany', () => {
    it('creating many options succeeds with valid inputs', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(() => ({
        key: faker.string.sample(),
        name: faker.string.sample(),
      }));
      jest.spyOn(optionRepo, 'save');

      await optionService.createMany(dto);

      expect(optionRepo.save).toBeCalledTimes(1);
      expect(optionRepo.save).toBeCalledWith(
        dto.options.map(({ name, key }) => ({
          name,
          key,
          field: { id: fieldId },
        })),
      );
    });
    it('creating many options fails with duplicate names', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.number.int({ min: 2, max: 10 }),
      }).map(() => ({
        key: faker.string.sample(),
        name: 'duplicateName',
      }));
      jest.spyOn(optionRepo, 'save');

      await expect(optionService.createMany(dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );

      expect(optionRepo.save).not.toBeCalled();
    });
    it('creating many options fails with duplicate keys', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.number.int({ min: 2, max: 10 }),
      }).map(() => ({
        key: 'duplicateKey',
        name: faker.string.sample(),
      }));
      jest.spyOn(optionRepo, 'save');

      await expect(optionService.createMany(dto)).rejects.toThrow(
        OptionKeyDuplicatedException,
      );

      expect(optionRepo.save).not.toBeCalled();
    });
  });
  describe('replaceMany', () => {
    it('replacing many options succeeds with valid inputs', async () => {
      const fieldId = faker.number.int();
      const length = faker.number.int({ min: 1, max: 10 });
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length,
      }).map(() => ({
        id: faker.number.int(),
        key: faker.string.sample(),
        name: faker.string.sample(),
      }));
      jest.spyOn(optionRepo, 'find').mockResolvedValue(
        Array.from({
          length: faker.number.int({ min: 1, max: 10 }),
        }).map(() => ({
          id: faker.number.int(),
          key: faker.string.sample(),
          name: faker.string.sample(),
          deletedAt: null,
        })) as OptionEntity[],
      );
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.find).toBeCalledTimes(1);
      expect(optionRepo.find).toBeCalledWith({
        where: { field: { id: fieldId } },
        withDeleted: true,
      });
      expect(optionRepo.query).toBeCalledTimes(1);
      expect(optionRepo.save).toBeCalledTimes(length);
    });
  });
});
