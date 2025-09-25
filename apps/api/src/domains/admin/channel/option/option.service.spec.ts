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
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { optionFixture } from '@/test-utils/fixtures';
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

      const option = await optionService.create(dto);

      expect(option.key).toBe(dto.key);
      expect(option.name).toBe(dto.name);
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

      const option = await optionService.create(dto);

      expect(option.key).toBe(dto.key);
      expect(option.name).toBe(dto.name);
    });
    it('creating an option fails with a duplicate name', async () => {
      const fieldId = faker.number.int();
      const duplicateName = optionFixture.name;
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = faker.string.sample();
      dto.name = duplicateName;

      await expect(optionService.create(dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );
    });
    it('creating an option fails with a duplicate key', async () => {
      const fieldId = faker.number.int();
      const duplicateKey = optionFixture.key;
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = duplicateKey;
      dto.name = faker.string.sample();

      await expect(optionService.create(dto)).rejects.toThrow(
        OptionKeyDuplicatedException,
      );
    });
  });

  describe('createMany', () => {
    it('creating many options succeeds with valid inputs', async () => {
      const fieldId = faker.number.int();
      const optionLength = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: optionLength,
      }).map(() => ({
        key: faker.string.sample(),
        name: faker.string.sample(),
      }));
      jest.spyOn(optionRepo, 'save');

      const options = await optionService.createMany(dto);

      for (let i = 0; i < optionLength; i++) {
        expect(options[i].key).toBe(dto.options[i].key);
        expect(options[i].name).toBe(dto.options[i].name);
      }
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

      await expect(optionService.createMany(dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );
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

      await expect(optionService.createMany(dto)).rejects.toThrow(
        OptionKeyDuplicatedException,
      );
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
        })) as unknown as OptionEntity[],
      );
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.save).toHaveBeenCalledTimes(length);
    });

    it('replacing many options fails with duplicate names', async () => {
      const fieldId = faker.number.int();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.number.int({ min: 2, max: 10 }),
      }).map(() => ({
        id: faker.number.int(),
        key: faker.string.sample(),
        name: 'duplicateName',
      }));

      await expect(optionService.replaceMany(dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );
    });

    it('replacing many options fails with duplicate keys', async () => {
      const fieldId = faker.number.int();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = Array.from({
        length: faker.number.int({ min: 2, max: 10 }),
      }).map(() => ({
        id: faker.number.int(),
        key: 'duplicateKey',
        name: faker.string.sample(),
      }));

      await expect(optionService.replaceMany(dto)).rejects.toThrow(
        OptionKeyDuplicatedException,
      );
    });

    it('replacing many options succeeds with empty options array', async () => {
      const fieldId = faker.number.int();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = [];
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.save).toHaveBeenCalledTimes(0);
    });

    it('replacing many options handles inactive options correctly', async () => {
      const fieldId = faker.number.int();
      const optionId = faker.number.int();
      const key = faker.string.sample();
      const name = faker.string.sample();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = [{ id: optionId, key, name }];

      jest.spyOn(optionRepo, 'find').mockResolvedValue([
        {
          id: optionId,
          key: 'deleted_' + key,
          name,
          deletedAt: new Date(),
        },
      ] as unknown as OptionEntity[]);
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.save).toHaveBeenCalledTimes(1);
    });

    it('replacing many options deletes unused options', async () => {
      const fieldId = faker.number.int();
      const existingOptionId = faker.number.int();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = [
        {
          id: faker.number.int(),
          key: faker.string.sample(),
          name: faker.string.sample(),
        },
      ];

      jest.spyOn(optionRepo, 'find').mockResolvedValue([
        {
          id: existingOptionId,
          key: faker.string.sample(),
          name: faker.string.sample(),
          deletedAt: null,
        },
      ] as unknown as OptionEntity[]);
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        expect.arrayContaining([expect.any(String), [existingOptionId]]),
      );
    });
  });

  describe('findByFieldId', () => {
    it('finding options by field id succeeds', async () => {
      const fieldId = faker.number.int();
      const mockOptions = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(() => ({
        id: faker.number.int(),
        key: faker.string.sample(),
        name: faker.string.sample(),
        fieldId,
      })) as unknown as OptionEntity[];

      jest.spyOn(optionRepo, 'findBy').mockResolvedValue(mockOptions);

      const result = await optionService.findByFieldId({ fieldId });

      expect(optionRepo.findBy).toHaveBeenCalledWith({
        field: { id: fieldId },
      });
      expect(result).toEqual(mockOptions);
    });

    it('finding options by field id returns empty array when no options exist', async () => {
      const fieldId = faker.number.int();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([]);

      const result = await optionService.findByFieldId({ fieldId });

      expect(result).toEqual([]);
    });
  });

  describe('create edge cases', () => {
    it('creating an option with empty key succeeds', async () => {
      const fieldId = faker.number.int();
      const name = faker.string.sample();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = '';
      dto.name = name;
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([]);
      jest
        .spyOn(optionRepo, 'save')
        .mockImplementation(() => Promise.resolve({ key: '', name } as any));

      const result = await optionService.create(dto);

      expect(result.key).toBe('');
    });

    it('creating an option with empty name succeeds', async () => {
      const fieldId = faker.number.int();
      const key = faker.string.sample();
      const dto = new CreateOptionDto();
      dto.fieldId = fieldId;
      dto.key = key;
      dto.name = '';
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([]);
      jest
        .spyOn(optionRepo, 'save')
        .mockImplementation(() => Promise.resolve({ key, name: '' } as any));

      const result = await optionService.create(dto);

      expect(result.name).toBe('');
    });

    it('creating an option with null fieldId succeeds', async () => {
      const dto = new CreateOptionDto();

      dto.fieldId = null as any;
      dto.key = faker.string.sample();
      dto.name = faker.string.sample();
      jest.spyOn(optionRepo, 'findBy').mockResolvedValue([]);
      jest
        .spyOn(optionRepo, 'save')
        .mockImplementation(() =>
          Promise.resolve({ key: '', name: faker.string.sample() } as any),
        );

      const result = await optionService.create(dto);

      expect(result).toBeDefined();
    });
  });

  describe('createMany edge cases', () => {
    it('creating many options with empty array succeeds', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = [];
      jest
        .spyOn(optionRepo, 'save')
        .mockImplementation(() => Promise.resolve([] as any));

      const result = await optionService.createMany(dto);

      expect(result).toEqual([]);
      expect(optionRepo.save).toHaveBeenCalledWith([]);
    });

    it('creating many options with single option succeeds', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateManyOptionsDto();
      dto.fieldId = fieldId;
      dto.options = [
        { key: faker.string.sample(), name: faker.string.sample() },
      ];
      jest
        .spyOn(optionRepo, 'save')
        .mockImplementation(() => Promise.resolve([{}] as any));

      const result = await optionService.createMany(dto);

      expect(result).toHaveLength(1);
    });
  });

  describe('replaceMany edge cases', () => {
    it('replacing many options with null options array succeeds', async () => {
      const fieldId = faker.number.int();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;

      dto.options = null as any;
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.save).toHaveBeenCalledTimes(0);
    });

    it('replacing many options with undefined options array succeeds', async () => {
      const fieldId = faker.number.int();
      const dto = new ReplaceManyOptionsDto();
      dto.fieldId = fieldId;

      dto.options = undefined as any;
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);
      jest.spyOn(optionRepo, 'query');
      jest.spyOn(optionRepo, 'save');

      await optionService.replaceMany(dto);

      expect(optionRepo.save).toHaveBeenCalledTimes(0);
    });
  });
});
