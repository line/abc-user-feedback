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

import { tenantFixture } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { TenantServiceProviders } from '../../../test-utils/providers/tenant.service.providers';
import { FeedbackEntity } from '../feedback/feedback.entity';
import { UserEntity } from '../user/entities/user.entity';
import {
  FeedbackCountByTenantIdDto,
  SetupTenantDto,
  UpdateTenantDto,
} from './dtos';
import {
  TenantAlreadyExistsException,
  TenantNotFoundException,
} from './exceptions';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let tenantService: TenantService;
  let tenantRepo: Repository<TenantEntity>;
  let userRepo: Repository<UserEntity>;
  let feedbackRepo: Repository<FeedbackEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: TenantServiceProviders,
    }).compile();
    tenantService = module.get(TenantService);
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    userRepo = module.get(getRepositoryToken(UserEntity));
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
  });

  describe('create', () => {
    it('creation succeeds with valid data', async () => {
      const dto = new SetupTenantDto();
      dto.siteName = faker.string.sample();
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);
      jest.spyOn(userRepo, 'save');

      const tenant = await tenantService.create(dto);
      expect(tenant.id).toBeDefined();
      expect(tenant.siteName).toEqual(dto.siteName);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });
    it('creation fails with the duplicate site name', async () => {
      const dto = new SetupTenantDto();
      dto.siteName = faker.string.sample();

      await expect(tenantService.create(dto)).rejects.toThrow(
        TenantAlreadyExistsException,
      );
    });
  });
  describe('update', () => {
    const dto = new UpdateTenantDto();
    dto.siteName = faker.string.sample();
    dto.useEmail = faker.datatype.boolean();
    dto.isPrivate = faker.datatype.boolean();
    dto.isRestrictDomain = faker.datatype.boolean();
    dto.allowDomains = [faker.string.sample()];
    dto.useOAuth = faker.datatype.boolean();
    dto.oauthConfig = {
      clientId: faker.string.sample(),
      clientSecret: faker.string.sample(),
      authCodeRequestURL: faker.string.sample(),
      scopeString: faker.string.sample(),
      accessTokenRequestURL: faker.string.sample(),
      userProfileRequestURL: faker.string.sample(),
      emailKey: faker.string.sample(),
      defatulLoginEnable: faker.datatype.boolean(),
    };

    it('update succeeds with valid data', async () => {
      const tenant = await tenantService.update(dto);

      expect(tenant.id).toBeDefined();
      expect(tenant.siteName).toEqual(dto.siteName);
      expect(tenant.useEmail).toEqual(dto.useEmail);
      expect(tenant.isPrivate).toEqual(dto.isPrivate);
      expect(tenant.isRestrictDomain).toEqual(dto.isRestrictDomain);
      expect(tenant.allowDomains).toEqual(dto.allowDomains);
      expect(tenant.useOAuth).toEqual(dto.useOAuth);
      expect(tenant.oauthConfig).toEqual(dto.oauthConfig);
    });
    it('update fails when there is no tenant', async () => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);

      await expect(tenantService.update(dto)).rejects.toThrow(
        TenantNotFoundException,
      );
    });
  });
  describe('findOne', () => {
    it('finding a tenant succeeds when there is a tenant', async () => {
      const tenant = await tenantService.findOne();

      expect(tenant).toEqual({ ...tenantFixture, useEmailVerification: false });
    });
    it('finding a tenant fails when there is no tenant', async () => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);

      await expect(tenantService.findOne()).rejects.toThrow(
        TenantNotFoundException,
      );
    });
  });
  describe('countByTenantId', () => {
    it('counting feedbacks by tenant id', async () => {
      const count = faker.number.int();
      const tenantId = faker.number.int();
      const dto = new FeedbackCountByTenantIdDto();
      dto.tenantId = tenantId;
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(count);

      const feedbackCounts = await tenantService.countByTenantId(dto);

      expect(feedbackCounts.total).toEqual(count);
    });
  });
});
