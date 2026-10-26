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

import { TestConfig } from '@/test-utils/util-functions';
import { ApiKeyServiceProviders } from '../../../../test-utils/providers/api-key.service.providers';
import { ProjectNotFoundException } from '../project/exceptions';
import { ProjectEntity } from '../project/project.entity';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKeyService } from './api-key.service';
import { hashApiKey } from './api-key.util';
import { CreateApiKeyDto } from './dtos';

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService;
  let apiKeyRepo: Repository<ApiKeyEntity>;
  let projectRepo: Repository<ProjectEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: ApiKeyServiceProviders,
    }).compile();

    apiKeyService = module.get(ApiKeyService);
    apiKeyRepo = module.get(getRepositoryToken(ApiKeyEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
  });

  describe('create', () => {
    it('creating an api key succeeds with a valid project id', async () => {
      const projectId = faker.number.int();
      const mockProject = { id: projectId, name: faker.company.name() };
      const mockApiKey = {
        id: faker.number.int(),
        value: faker.string.alphanumeric(20),
        projectId,
      };
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce(mockProject as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce(mockApiKey as any);

      const apiKey = await apiKeyService.create(
        CreateApiKeyDto.from({ projectId }),
      );

      expect(apiKey.value).toHaveLength(20);
      expect(projectRepo.findOneBy).toHaveBeenCalledWith({ id: projectId });
    });

    it('creating an api key succeeds with a valid project id and a key', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);
      const mockProject = { id: projectId, name: faker.company.name() };
      const mockApiKey = {
        id: faker.number.int(),
        value,
        projectId,
      };
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce(mockProject as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce(mockApiKey as any);

      const apiKey = await apiKeyService.create({ projectId, value });

      expect(apiKey.value).toBe(value);
      expect(projectRepo.findOneBy).toHaveBeenCalledWith({ id: projectId });
      expect(apiKeyRepo.findOneBy).toHaveBeenCalledWith({
        hash: hashApiKey(value),
      });
      const saved = jest.mocked(apiKeyRepo.save).mock.calls[0][0];
      expect(saved).toMatchObject({
        hash: hashApiKey(value),
        prefix: value.slice(0, 4),
        expiresAt: null,
      });
      expect(saved).not.toHaveProperty('value');
    });

    it('creating an api key stores the given expiry', async () => {
      const projectId = faker.number.int();
      const expiresAt = faker.date.future();
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce({ id: projectId } as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(apiKeyRepo, 'save')
        .mockImplementationOnce((entity) => Promise.resolve(entity as any));

      const apiKey = await apiKeyService.create(
        CreateApiKeyDto.from({ projectId, expiresAt }),
      );

      expect(apiKey.expiresAt).toEqual(expiresAt);
      expect(apiKey.value).toHaveLength(20);
      expect(apiKey.hash).toBe(hashApiKey(apiKey.value));
    });

    it('creating an api key fails with an expiry in the past', async () => {
      const projectId = faker.number.int();

      await expect(
        apiKeyService.create(
          CreateApiKeyDto.from({ projectId, expiresAt: faker.date.past() }),
        ),
      ).rejects.toThrow(
        new BadRequestException('expiresAt must be in the future'),
      );
    });

    it('creating an api key fails with an invalid project id', async () => {
      const invalidProjectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValueOnce(null);

      await expect(
        apiKeyService.create(
          CreateApiKeyDto.from({ projectId: invalidProjectId }),
        ),
      ).rejects.toThrow(ProjectNotFoundException);
    });

    it('creating an api key fails with an invalid api key length', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(
        faker.number.int({ min: 1, max: 19 }),
      );

      await expect(apiKeyService.create({ projectId, value })).rejects.toThrow(
        new BadRequestException('Invalid Api Key value'),
      );
    });

    it('creating an api key fails with an existent api key', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);
      const mockProject = { id: projectId, name: faker.company.name() };
      const existingApiKey = { id: 1, value, projectId };

      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce(mockProject as ProjectEntity);
      jest
        .spyOn(apiKeyRepo, 'findOneBy')
        .mockResolvedValueOnce(existingApiKey as any);

      await expect(apiKeyService.create({ projectId, value })).rejects.toThrow(
        new BadRequestException('Api Key already exists'),
      );
    });

    it('creating an api key fails with api key longer than 20 characters', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(21);

      await expect(apiKeyService.create({ projectId, value })).rejects.toThrow(
        new BadRequestException('Invalid Api Key value'),
      );
    });
  });

  describe('createMany', () => {
    const projectId = faker.number.int();
    const apiKeyCount = faker.number.int({ min: 2, max: 10 });
    const apiKeys = Array.from({ length: apiKeyCount }).map(() => ({
      projectId,
    })) as CreateApiKeyDto[];
    let dtos: CreateApiKeyDto[];
    beforeEach(() => {
      dtos = apiKeys;
    });

    it('creating api keys succeeds with a valid project id', async () => {
      const mockProject = { id: projectId, name: faker.company.name() };
      const mockApiKeys = dtos.map((_) => ({
        id: faker.number.int(),
        value: faker.string.alphanumeric(20),
        projectId,
      }));
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue(mockProject as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValue(mockApiKeys as any);

      const apiKeys = await apiKeyService.createMany(dtos);

      expect(apiKeys).toHaveLength(apiKeyCount);
      for (const dto of dtos) {
        expect(dto.value).toHaveLength(20);
      }
      expect(projectRepo.findOneBy).toHaveBeenCalledTimes(apiKeyCount);
    });

    it('creating api keys succeeds with a valid project id and keys', async () => {
      const mockProject = { id: projectId, name: faker.company.name() };
      dtos.forEach((apiKey) => {
        apiKey.value = faker.string.alphanumeric(20);
      });
      const mockApiKeys = dtos.map((dto) => ({
        id: faker.number.int(),
        value: dto.value,
        projectId,
      }));
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue(mockProject as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValue(mockApiKeys as any);

      const apiKeys = await apiKeyService.createMany(dtos);

      expect(apiKeys).toHaveLength(apiKeyCount);
      // Imported raw keys must be stored hashed, never as-is.
      expect(apiKeyRepo.save).toHaveBeenCalledWith(
        dtos.map((dto): unknown =>
          expect.objectContaining({
            hash: hashApiKey(dto.value),
            prefix: dto.value.slice(0, 4),
          }),
        ),
      );
    });

    it('creating api keys fails with an invalid project id', async () => {
      const invalidProjectId = faker.number.int();
      dtos[0].projectId = invalidProjectId;
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValueOnce(null);

      await expect(apiKeyService.createMany(dtos)).rejects.toThrow(
        ProjectNotFoundException,
      );
    });

    it('creating api keys fails with duplicate api key values', async () => {
      const duplicateValue = faker.string.alphanumeric(20);
      const mockProject = { id: projectId, name: faker.company.name() };
      dtos.forEach((apiKey) => {
        apiKey.value = duplicateValue;
      });
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue(mockProject as ProjectEntity);
      jest
        .spyOn(apiKeyRepo, 'findOneBy')
        .mockResolvedValueOnce({} as ApiKeyEntity);

      await expect(apiKeyService.createMany(dtos)).rejects.toThrow(
        new BadRequestException('Api Key already exists'),
      );
    });

    it('creating api keys fails with invalid api key length', async () => {
      const mockProject = { id: projectId, name: faker.company.name() };
      dtos[0].value = faker.string.alphanumeric(19); // Invalid length
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue(mockProject as ProjectEntity);

      await expect(apiKeyService.createMany(dtos)).rejects.toThrow(
        new BadRequestException('Invalid Api Key value'),
      );
    });
  });

  describe('findAllByProjectId', () => {
    it('returns all api keys for a valid project id', async () => {
      const projectId = faker.number.int();
      const mockApiKeys = [
        { id: 1, value: faker.string.alphanumeric(20), projectId },
        { id: 2, value: faker.string.alphanumeric(20), projectId },
      ];
      jest.spyOn(apiKeyRepo, 'find').mockResolvedValueOnce(mockApiKeys as any);

      const result = await apiKeyService.findAllByProjectId(projectId);

      expect(result).toEqual(mockApiKeys);
      expect(apiKeyRepo.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        withDeleted: true,
      });
    });

    it('returns empty array when no api keys exist for project', async () => {
      const projectId = faker.number.int();
      jest.spyOn(apiKeyRepo, 'find').mockResolvedValueOnce([]);

      const result = await apiKeyService.findAllByProjectId(projectId);

      expect(result).toEqual([]);
    });
  });

  describe('findUsableByProjectIdAndValue', () => {
    const projectId = faker.number.int();
    const value = faker.string.alphanumeric(20);

    it('looks up the key by its hash within the project', async () => {
      const mockApiKey = { id: 1, hash: hashApiKey(value), expiresAt: null };
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce(mockApiKey as any);

      const result = await apiKeyService.findUsableByProjectIdAndValue(
        projectId,
        value,
      );

      expect(result).toEqual(mockApiKey);
      expect(apiKeyRepo.findOne).toHaveBeenCalledWith({
        where: { project: { id: projectId }, hash: hashApiKey(value) },
      });
    });

    it('returns null when no matching api key is found', async () => {
      jest.spyOn(apiKeyRepo, 'findOne').mockResolvedValueOnce(null);

      const result = await apiKeyService.findUsableByProjectIdAndValue(
        projectId,
        value,
      );

      expect(result).toBeNull();
    });

    it('returns null for an expired api key', async () => {
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce({ id: 1, expiresAt: faker.date.past() } as any);

      const result = await apiKeyService.findUsableByProjectIdAndValue(
        projectId,
        value,
      );

      expect(result).toBeNull();
    });

    it('returns an api key that has not expired yet', async () => {
      const mockApiKey = { id: 1, expiresAt: faker.date.future() };
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce(mockApiKey as any);

      const result = await apiKeyService.findUsableByProjectIdAndValue(
        projectId,
        value,
      );

      expect(result).toEqual(mockApiKey);
    });
  });

  describe('deleteById', () => {
    it('deletes api key by id successfully', async () => {
      const id = faker.number.int();
      jest
        .spyOn(apiKeyRepo, 'remove')
        .mockResolvedValueOnce({} as ApiKeyEntity);

      await apiKeyService.deleteById(id);

      expect(apiKeyRepo.remove).toHaveBeenCalledWith(
        expect.objectContaining({ id }),
      );
    });
  });

  describe('softDeleteById', () => {
    it('soft deletes api key by id when api key exists', async () => {
      const id = faker.number.int();
      const existingApiKey = { id, value: faker.string.alphanumeric(20) };
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce(existingApiKey as any);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({} as ApiKeyEntity);

      await apiKeyService.softDeleteById(id);

      expect(apiKeyRepo.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(apiKeyRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingApiKey,
          deletedAt: expect.any(Date),
        }),
      );
    });

    it('soft deletes api key by id when api key does not exist', async () => {
      const id = faker.number.int();
      jest.spyOn(apiKeyRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({} as ApiKeyEntity);

      await apiKeyService.softDeleteById(id);

      expect(apiKeyRepo.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(apiKeyRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('recoverById', () => {
    it('recovers soft deleted api key by id when api key exists', async () => {
      const id = faker.number.int();
      const existingApiKey = {
        id,
        value: faker.string.alphanumeric(20),
        deletedAt: new Date(),
      };
      jest
        .spyOn(apiKeyRepo, 'findOne')
        .mockResolvedValueOnce(existingApiKey as any);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({} as ApiKeyEntity);

      await apiKeyService.recoverById(id);

      expect(apiKeyRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        withDeleted: true,
      });
      expect(apiKeyRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingApiKey,
          deletedAt: null,
        }),
      );
    });

    it('recovers api key by id when api key does not exist', async () => {
      const id = faker.number.int();
      jest.spyOn(apiKeyRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({} as ApiKeyEntity);

      await apiKeyService.recoverById(id);

      expect(apiKeyRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        withDeleted: true,
      });
      expect(apiKeyRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          deletedAt: null,
        }),
      );
    });
  });
});
