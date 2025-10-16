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
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyResponseDto } from './dtos/responses/create-api-key-response.dto';
import { FindApiKeysResponseDto } from './dtos/responses/find-api-keys-response.dto';

const MockApiKeyService = {
  create: jest.fn(),
  findAllByProjectId: jest.fn(),
  findByProjectIdAndValue: jest.fn(),
  deleteById: jest.fn(),
  softDeleteById: jest.fn(),
  recoverById: jest.fn(),
};

describe('ApiKeyController', () => {
  let apiKeyController: ApiKeyController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        getMockProvider(ApiKeyService, MockApiKeyService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    apiKeyController = module.get(ApiKeyController);
  });

  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create API key successfully without providing value', async () => {
      const projectId = faker.number.int();
      const mockApiKey = {
        id: faker.number.int(),
        value: faker.string.alphanumeric(20),
        createdAt: faker.date.recent(),
      };

      MockApiKeyService.create.mockResolvedValue(mockApiKey);

      const result = await apiKeyController.create(projectId, {});

      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          value: undefined,
        }),
      );
      expect(result).toBeInstanceOf(CreateApiKeyResponseDto);
      expect(result.id).toBe(mockApiKey.id);
      expect(result.value).toBe(mockApiKey.value);
      expect(result.createdAt).toStrictEqual(mockApiKey.createdAt);
    });

    it('should create API key successfully with provided value', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);
      const mockApiKey = {
        id: faker.number.int(),
        value,
        createdAt: faker.date.recent(),
      };

      MockApiKeyService.create.mockResolvedValue(mockApiKey);

      const result = await apiKeyController.create(projectId, { value });

      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          value,
        }),
      );
      expect(result).toBeInstanceOf(CreateApiKeyResponseDto);
      expect(result.id).toBe(mockApiKey.id);
      expect(result.value).toBe(mockApiKey.value);
      expect(result.createdAt).toStrictEqual(mockApiKey.createdAt);
    });

    it('should throw BadRequestException when API key value is invalid length', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(15); // Invalid length
      const errorMessage = 'Invalid Api Key value';

      MockApiKeyService.create.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        apiKeyController.create(projectId, { value }),
      ).rejects.toThrow(BadRequestException);
      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when API key already exists', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);
      const errorMessage = 'Api Key already exists';

      MockApiKeyService.create.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        apiKeyController.create(projectId, { value }),
      ).rejects.toThrow(BadRequestException);
      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when project does not exist', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);

      MockApiKeyService.create.mockRejectedValue(
        new NotFoundException('Project not found'),
      );

      await expect(
        apiKeyController.create(projectId, { value }),
      ).rejects.toThrow(NotFoundException);
      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate other exceptions from service', async () => {
      const projectId = faker.number.int();
      const error = new Error('Database connection failed');

      MockApiKeyService.create.mockRejectedValue(error);

      await expect(apiKeyController.create(projectId, {})).rejects.toThrow(
        error,
      );
      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return all API keys for a project successfully', async () => {
      const projectId = faker.number.int();
      const mockApiKeys = [
        {
          id: faker.number.int(),
          value: faker.string.alphanumeric(20),
          createdAt: faker.date.recent(),
          deletedAt: null,
        },
        {
          id: faker.number.int(),
          value: faker.string.alphanumeric(20),
          createdAt: faker.date.recent(),
          deletedAt: faker.date.recent(),
        },
      ];

      MockApiKeyService.findAllByProjectId.mockResolvedValue(mockApiKeys);

      const result = await apiKeyController.findAll(projectId);

      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledWith(
        projectId,
      );
      expect(result).toBeInstanceOf(FindApiKeysResponseDto);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe(mockApiKeys[0].id);
      expect(result.items[0].value).toBe(mockApiKeys[0].value);
      expect(result.items[1].id).toBe(mockApiKeys[1].id);
      expect(result.items[1].value).toBe(mockApiKeys[1].value);
    });

    it('should return empty array when no API keys exist for project', async () => {
      const projectId = faker.number.int();

      MockApiKeyService.findAllByProjectId.mockResolvedValue([]);

      const result = await apiKeyController.findAll(projectId);

      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledWith(
        projectId,
      );
      expect(result).toBeInstanceOf(FindApiKeysResponseDto);
      expect(result.items).toHaveLength(0);
    });

    it('should propagate exceptions from service', async () => {
      const projectId = faker.number.int();
      const error = new Error('Database connection failed');

      MockApiKeyService.findAllByProjectId.mockRejectedValue(error);

      await expect(apiKeyController.findAll(projectId)).rejects.toThrow(error);
      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledTimes(1);
    });
  });
  describe('softDelete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should soft delete API key successfully', async () => {
      const apiKeyId = faker.number.int();

      MockApiKeyService.softDeleteById.mockResolvedValue(undefined);

      await apiKeyController.softDelete(apiKeyId);

      expect(MockApiKeyService.softDeleteById).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.softDeleteById).toHaveBeenCalledWith(apiKeyId);
    });

    it('should propagate exceptions from service', async () => {
      const apiKeyId = faker.number.int();
      const error = new Error('Database connection failed');

      MockApiKeyService.softDeleteById.mockRejectedValue(error);

      await expect(apiKeyController.softDelete(apiKeyId)).rejects.toThrow(
        error,
      );
      expect(MockApiKeyService.softDeleteById).toHaveBeenCalledTimes(1);
    });
  });

  describe('recover', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should recover soft deleted API key successfully', async () => {
      const apiKeyId = faker.number.int();

      MockApiKeyService.recoverById.mockResolvedValue(undefined);

      await apiKeyController.recover(apiKeyId);

      expect(MockApiKeyService.recoverById).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.recoverById).toHaveBeenCalledWith(apiKeyId);
    });

    it('should propagate exceptions from service', async () => {
      const apiKeyId = faker.number.int();
      const error = new Error('Database connection failed');

      MockApiKeyService.recoverById.mockRejectedValue(error);

      await expect(apiKeyController.recover(apiKeyId)).rejects.toThrow(error);
      expect(MockApiKeyService.recoverById).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should permanently delete API key successfully', async () => {
      const apiKeyId = faker.number.int();

      MockApiKeyService.deleteById.mockResolvedValue(undefined);

      await apiKeyController.delete(apiKeyId);

      expect(MockApiKeyService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.deleteById).toHaveBeenCalledWith(apiKeyId);
    });

    it('should propagate exceptions from service', async () => {
      const apiKeyId = faker.number.int();
      const error = new Error('Database connection failed');

      MockApiKeyService.deleteById.mockRejectedValue(error);

      await expect(apiKeyController.delete(apiKeyId)).rejects.toThrow(error);
      expect(MockApiKeyService.deleteById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle complete API key lifecycle', async () => {
      const projectId = faker.number.int();
      const apiKeyId = faker.number.int();
      const mockApiKey = {
        id: apiKeyId,
        value: faker.string.alphanumeric(20),
        createdAt: faker.date.recent(),
      };

      // Create API key
      MockApiKeyService.create.mockResolvedValue(mockApiKey);
      const createResult = await apiKeyController.create(projectId, {});
      expect(createResult.id).toBe(apiKeyId);

      // Find all API keys
      MockApiKeyService.findAllByProjectId.mockResolvedValue([mockApiKey]);
      const findAllResult = await apiKeyController.findAll(projectId);
      expect(findAllResult.items).toHaveLength(1);

      // Soft delete API key
      MockApiKeyService.softDeleteById.mockResolvedValue(undefined);
      await apiKeyController.softDelete(apiKeyId);
      expect(MockApiKeyService.softDeleteById).toHaveBeenCalledWith(apiKeyId);

      // Recover API key
      MockApiKeyService.recoverById.mockResolvedValue(undefined);
      await apiKeyController.recover(apiKeyId);
      expect(MockApiKeyService.recoverById).toHaveBeenCalledWith(apiKeyId);

      // Permanently delete API key
      MockApiKeyService.deleteById.mockResolvedValue(undefined);
      await apiKeyController.delete(apiKeyId);
      expect(MockApiKeyService.deleteById).toHaveBeenCalledWith(apiKeyId);
    });

    it('should handle concurrent operations gracefully', async () => {
      const projectId = faker.number.int();
      const apiKeyId = faker.number.int();

      // Simulate concurrent operations
      const operations = [
        apiKeyController.findAll(projectId),
        apiKeyController.softDelete(apiKeyId),
        apiKeyController.recover(apiKeyId),
      ];

      MockApiKeyService.findAllByProjectId.mockResolvedValue([]);
      MockApiKeyService.softDeleteById.mockResolvedValue(undefined);
      MockApiKeyService.recoverById.mockResolvedValue(undefined);

      await Promise.all(operations);

      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.softDeleteById).toHaveBeenCalledTimes(1);
      expect(MockApiKeyService.recoverById).toHaveBeenCalledTimes(1);
    });
  });
});
