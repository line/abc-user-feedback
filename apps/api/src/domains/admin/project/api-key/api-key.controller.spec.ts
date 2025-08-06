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
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

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

  describe('create ', () => {
    it('creating succeeds without an api key', async () => {
      jest.spyOn(MockApiKeyService, 'create');
      const projectId = faker.number.int();

      await apiKeyController.create(projectId, {});

      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
    });
    it('creating succeeds with an api key', async () => {
      jest.spyOn(MockApiKeyService, 'create');
      const projectId = faker.number.int();
      const value = faker.string.alphanumeric(20);

      await apiKeyController.create(projectId, { value });

      expect(MockApiKeyService.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('', async () => {
      jest.spyOn(MockApiKeyService, 'findAllByProjectId');
      const projectId = faker.number.int();

      await apiKeyController.findAll(projectId);

      expect(MockApiKeyService.findAllByProjectId).toHaveBeenCalledTimes(1);
    });
  });
  describe('softDelete', () => {
    it('', async () => {
      jest.spyOn(MockApiKeyService, 'softDeleteById');
      const apiKeyId = faker.number.int();

      await apiKeyController.softDelete(apiKeyId);

      expect(MockApiKeyService.softDeleteById).toHaveBeenCalledTimes(1);
    });
  });
  describe('recover', () => {
    it('', async () => {
      jest.spyOn(MockApiKeyService, 'recoverById');
      const apiKeyId = faker.number.int();

      await apiKeyController.recover(apiKeyId);

      expect(MockApiKeyService.recoverById).toHaveBeenCalledTimes(1);
    });
  });
  describe('delete', () => {
    it('', async () => {
      jest.spyOn(MockApiKeyService, 'deleteById');
      const apiKeyId = faker.number.int();

      await apiKeyController.delete(apiKeyId);

      expect(MockApiKeyService.deleteById).toHaveBeenCalledTimes(1);
    });
  });
});
