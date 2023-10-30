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
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TestConfig } from '@/test-utils/util-functions';
import { ApiKeyServiceProviders } from '../../../test-utils/providers/api-key.service.providers';
import { ProjectNotFoundException } from '../project/exceptions';
import { ProjectEntity } from '../project/project.entity';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKeyService } from './api-key.service';

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

      const apiKey = await apiKeyService.create(projectId);

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

      await expect(apiKeyService.create(invalidProjectId)).rejects.toThrow(
        ProjectNotFoundException,
      );

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: invalidProjectId });
      expect(apiKeyRepo.save).toBeCalledTimes(0);
    });
  });
});
