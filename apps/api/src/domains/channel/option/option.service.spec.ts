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
import { Repository } from 'typeorm';

import { mockRepository } from '@/utils/test-utils';

import { OptionEntity } from '../../channel/option/option.entity';
import {
  CreateManyOptionsDto,
  CreateOptionDto,
  ReplaceManyOptionsDto,
} from './dtos';
import {
  OptionKeyDuplicatedException,
  OptionNameDuplicatedException,
} from './exceptions';
import { OptionService } from './option.service';

export const OptionServiceProviders = [
  OptionService,
  {
    provide: getRepositoryToken(OptionEntity),
    useValue: mockRepository(),
  },
];

describe('Option Test suite', () => {
  let optionService: OptionService;
  let optionRepo: Repository<OptionEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: OptionServiceProviders,
    }).compile();

    optionService = module.get<OptionService>(OptionService);
    optionRepo = module.get(getRepositoryToken(OptionEntity));
  });

  describe('create', () => {
    it('creating an option succeeds with a new valid input', async () => {
      const fieldId = faker.datatype.number();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.datatype.string();
      dto.name = faker.datatype.string();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          key: faker.datatype.string(),
          name: faker.datatype.string(),
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
      const fieldId = faker.datatype.number();
      const optionId = faker.datatype.number();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.datatype.string();
      dto.name = faker.datatype.string();
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
      const fieldId = faker.datatype.number();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.datatype.string();
      dto.name = faker.datatype.string();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          key: faker.datatype.string(),
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
      const fieldId = faker.datatype.number();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.datatype.string();
      dto.name = faker.datatype.string();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([
        {
          key: dto.key,
          name: faker.datatype.string(),
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
      const fieldId = faker.datatype.number();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.datatype.number({ min: 1, max: 10 }),
      }).map(() => ({
        key: faker.datatype.string(),
        name: faker.datatype.string(),
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
      const fieldId = faker.datatype.number();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.datatype.number({ min: 2, max: 10 }),
      }).map(() => ({
        key: faker.datatype.string(),
        name: 'duplicateName',
      }));
      jest.spyOn(optionRepo, 'save');

      await expect(optionService.createMany(dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );

      expect(optionRepo.save).not.toBeCalled();
    });
    it('creating many options fails with duplicate keys', async () => {
      const fieldId = faker.datatype.number();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.datatype.number({ min: 2, max: 10 }),
      }).map(() => ({
        key: 'duplicateKey',
        name: faker.datatype.string(),
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
      const fieldId = faker.datatype.number();
      const length = faker.datatype.number({ min: 1, max: 10 });
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length,
      }).map(() => ({
        id: faker.datatype.number(),
        key: faker.datatype.string(),
        name: faker.datatype.string(),
      }));
      jest.spyOn(optionRepo, 'find').mockResolvedValue(
        Array.from({
          length: faker.datatype.number({ min: 1, max: 10 }),
        }).map(() => ({
          id: faker.datatype.number(),
          key: faker.datatype.string(),
          name: faker.datatype.string(),
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
