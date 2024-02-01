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
import { randomBytes } from 'crypto';
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
import type { CreateApiKeyDto } from './dtos';

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
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce({ id: projectId } as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({
        value: randomBytes(10).toString('hex').toUpperCase(),
      } as ApiKeyEntity);

      const apiKey = await apiKeyService.create({ projectId });

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: projectId });
      expect(apiKeyRepo.save).toBeCalledTimes(1);
      expect(apiKey.value).toHaveLength(20);
    });
    it('creating an api key succeeds with a valid project id and a key', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce({ id: projectId } as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({
        value: randomBytes(10).toString('hex').toUpperCase(),
      } as ApiKeyEntity);

      const apiKey = await apiKeyService.create({ projectId, value });

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: projectId });
      expect(apiKeyRepo.save).toBeCalledTimes(1);
      expect(apiKey.value).toHaveLength(20);
    });
    it('creating an api key fails with an invalid project id', async () => {
      const invalidProjectId = faker.number.int();
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce(null as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce({
        value: randomBytes(10).toString('hex').toUpperCase(),
      } as ApiKeyEntity);

      await expect(
        apiKeyService.create({ projectId: invalidProjectId }),
      ).rejects.toThrow(ProjectNotFoundException);

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: invalidProjectId });
      expect(apiKeyRepo.save).toBeCalledTimes(0);
    });
    it('creating an api key fails with an invalid api key', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(
        faker.number.int({ min: 1, max: 19 }),
      );

      await expect(apiKeyService.create({ projectId, value })).rejects.toThrow(
        new BadRequestException('Invalid Api Key value'),
      );

      expect(apiKeyRepo.save).toBeCalledTimes(0);
    });
    it('creating an api key fails with an existent api key', async () => {
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValueOnce({ id: projectId } as ProjectEntity);
      jest
        .spyOn(apiKeyRepo, 'findOneBy')
        .mockResolvedValue({ value } as ApiKeyEntity);

      await expect(apiKeyService.create({ projectId, value })).rejects.toThrow(
        new BadRequestException('Api Key already exists'),
      );

      expect(apiKeyRepo.save).toBeCalledTimes(0);
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
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue({ id: projectId } as ProjectEntity);
      jest.spyOn(apiKeyRepo, 'save').mockResolvedValueOnce(
        dtos.map(({ projectId }) =>
          ApiKeyEntity.from({
            projectId,
            value: faker.string.alphanumeric(20),
          }),
        ) as any,
      );

      const apiKeys = await apiKeyService.createMany(dtos);

      expect(projectRepo.findOneBy).toBeCalledTimes(apiKeyCount);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: projectId });
      expect(apiKeyRepo.save).toBeCalledTimes(1);
      expect(apiKeys).toHaveLength(apiKeyCount);
      for (const apiKey of apiKeys) {
        expect(apiKey.value).toHaveLength(20);
      }
    });
    it('creating api keys succeeds with a valid project id and keys', async () => {
      dtos.forEach((apiKey) => {
        apiKey.value = faker.string.alphanumeric(20);
      });
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue({ id: projectId } as ProjectEntity);
      jest
        .spyOn(apiKeyRepo, 'save')
        .mockResolvedValueOnce(
          dtos.map(({ projectId, value }) =>
            ApiKeyEntity.from({ projectId, value }),
          ) as any,
        );

      const apiKeys = await apiKeyService.createMany(dtos);

      expect(projectRepo.findOneBy).toBeCalledTimes(apiKeyCount);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: projectId });
      expect(apiKeyRepo.save).toBeCalledTimes(1);
      expect(apiKeys).toHaveLength(apiKeyCount);
      for (const apiKey of apiKeys) {
        expect(apiKey.value).toHaveLength(20);
      }
    });
    it('creating api keys fails with an invalid project id', async () => {
      const invalidProjectId = faker.number.int();
      dtos[0].projectId = invalidProjectId;
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue(null as ProjectEntity);

      await expect(apiKeyService.createMany(dtos)).rejects.toThrow(
        ProjectNotFoundException,
      );

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: invalidProjectId });
      expect(apiKeyRepo.save).toBeCalledTimes(0);
    });
  });
});
