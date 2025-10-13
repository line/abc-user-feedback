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
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { CreateOptionRequestDto } from './dtos/requests';
import {
  OptionKeyDuplicatedException,
  OptionNameDuplicatedException,
} from './exceptions';
import { OptionController } from './option.controller';
import type { OptionEntity } from './option.entity';
import { OptionService } from './option.service';

const MockSelectOptionService = {
  findByFieldId: jest.fn(),
  create: jest.fn(),
};

describe('SelectOptionController', () => {
  let optionController: OptionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [
        getMockProvider(OptionService, MockSelectOptionService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    optionController = module.get<OptionController>(OptionController);
  });

  describe('getOptions', () => {
    it('should return transformed options for valid fieldId', async () => {
      const fieldId = faker.number.int();
      const mockOptions = [
        { id: 1, name: 'Option 1', key: 'option1', fieldId },
        { id: 2, name: 'Option 2', key: 'option2', fieldId },
      ] as unknown as OptionEntity[];

      jest
        .spyOn(MockSelectOptionService, 'findByFieldId')
        .mockResolvedValue(mockOptions);

      const result = await optionController.getOptions(fieldId);

      expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledWith({
        fieldId,
      });
      expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('name', 'Option 1');
      expect(result[0]).toHaveProperty('key', 'option1');
    });

    it('should return empty array when no options found', async () => {
      const fieldId = faker.number.int();

      jest
        .spyOn(MockSelectOptionService, 'findByFieldId')
        .mockResolvedValue([]);

      const result = await optionController.getOptions(fieldId);

      expect(result).toEqual([]);
      expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledWith({
        fieldId,
      });
    });

    it('should handle service errors', async () => {
      const fieldId = faker.number.int();
      const error = new Error('Database connection failed');

      jest
        .spyOn(MockSelectOptionService, 'findByFieldId')
        .mockRejectedValue(error);

      await expect(optionController.getOptions(fieldId)).rejects.toThrow(error);
    });
  });
  describe('createOption', () => {
    it('should create option successfully with valid data', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.key = faker.string.alphanumeric(10);

      const mockCreatedOption = {
        id: faker.number.int(),
        name: dto.name,
        key: dto.key,
        fieldId,
      } as unknown as OptionEntity;

      jest
        .spyOn(MockSelectOptionService, 'create')
        .mockResolvedValue(mockCreatedOption);

      const result = await optionController.createOption(fieldId, dto);

      expect(MockSelectOptionService.create).toHaveBeenCalledWith({
        fieldId,
        name: dto.name,
        key: dto.key,
      });
      expect(MockSelectOptionService.create).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('id', mockCreatedOption.id);
    });

    it('should throw OptionNameDuplicatedException when name is duplicated', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.key = faker.string.alphanumeric(10);

      jest
        .spyOn(MockSelectOptionService, 'create')
        .mockRejectedValue(new OptionNameDuplicatedException());

      await expect(optionController.createOption(fieldId, dto)).rejects.toThrow(
        OptionNameDuplicatedException,
      );
    });

    it('should throw OptionKeyDuplicatedException when key is duplicated', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.key = faker.string.alphanumeric(10);

      jest
        .spyOn(MockSelectOptionService, 'create')
        .mockRejectedValue(new OptionKeyDuplicatedException());

      await expect(optionController.createOption(fieldId, dto)).rejects.toThrow(
        OptionKeyDuplicatedException,
      );
    });

    it('should handle service errors', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.key = faker.string.alphanumeric(10);

      const error = new Error('Database connection failed');
      jest.spyOn(MockSelectOptionService, 'create').mockRejectedValue(error);

      await expect(optionController.createOption(fieldId, dto)).rejects.toThrow(
        error,
      );
    });

    it('should handle empty name and key', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = '';
      dto.key = '';

      const mockCreatedOption = {
        id: faker.number.int(),
        name: '',
        key: '',
        fieldId,
      } as unknown as OptionEntity;

      jest
        .spyOn(MockSelectOptionService, 'create')
        .mockResolvedValue(mockCreatedOption);

      const result = await optionController.createOption(fieldId, dto);

      expect(result).toHaveProperty('id', mockCreatedOption.id);
    });
  });

  describe('parameter validation', () => {
    it('should handle invalid fieldId parameter', async () => {
      const invalidFieldId = 'invalid' as unknown as number;

      await expect(
        optionController.getOptions(invalidFieldId),
      ).rejects.toThrow();
    });

    it('should handle negative fieldId', async () => {
      const negativeFieldId = -1;

      jest
        .spyOn(MockSelectOptionService, 'findByFieldId')
        .mockResolvedValue([]);

      const result = await optionController.getOptions(negativeFieldId);

      expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledWith({
        fieldId: negativeFieldId,
      });
      expect(result).toEqual([]);
    });

    it('should handle zero fieldId', async () => {
      const zeroFieldId = 0;

      jest
        .spyOn(MockSelectOptionService, 'findByFieldId')
        .mockResolvedValue([]);

      const result = await optionController.getOptions(zeroFieldId);

      expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledWith({
        fieldId: zeroFieldId,
      });
      expect(result).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle very large fieldId', async () => {
      const largeFieldId = Number.MAX_SAFE_INTEGER;

      jest
        .spyOn(MockSelectOptionService, 'findByFieldId')
        .mockResolvedValue([]);

      const result = await optionController.getOptions(largeFieldId);

      expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledWith({
        fieldId: largeFieldId,
      });
      expect(result).toEqual([]);
    });

    it('should handle null DTO properties', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = null as unknown as string;
      dto.key = null as unknown as string;

      const mockCreatedOption = {
        id: faker.number.int(),
        name: null,
        key: null,
        fieldId,
      } as unknown as OptionEntity;

      jest
        .spyOn(MockSelectOptionService, 'create')
        .mockResolvedValue(mockCreatedOption);

      const result = await optionController.createOption(fieldId, dto);

      expect(result).toHaveProperty('id', mockCreatedOption.id);
    });

    it('should handle undefined DTO properties', async () => {
      const fieldId = faker.number.int();
      const dto = new CreateOptionRequestDto();
      dto.name = undefined as unknown as string;
      dto.key = undefined as unknown as string;

      const mockCreatedOption = {
        id: faker.number.int(),
        name: undefined,
        key: undefined,
        fieldId,
      } as unknown as OptionEntity;

      jest
        .spyOn(MockSelectOptionService, 'create')
        .mockResolvedValue(mockCreatedOption);

      const result = await optionController.createOption(fieldId, dto);

      expect(result).toHaveProperty('id', mockCreatedOption.id);
    });
  });
});
