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
import { ClsModule } from 'nestjs-cls';
import type { Repository } from 'typeorm';

import { tenantFixture } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { TenantServiceProviders } from '../../../test-utils/providers/tenant.service.providers';
import { FeedbackEntity } from '../feedback/feedback.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserPasswordService } from '../user/user-password.service';
import {
  FeedbackCountByTenantIdDto,
  SetupTenantDto,
  UpdateTenantDto,
} from './dtos';
import { LoginButtonTypeEnum } from './entities/enums/login-button-type.enum';
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
  let userPasswordService: UserPasswordService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig, ClsModule.forRoot()],
      providers: TenantServiceProviders,
    }).compile();
    tenantService = module.get(TenantService);
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    userRepo = module.get(getRepositoryToken(UserEntity));
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
    userPasswordService = module.get(UserPasswordService);
  });

  describe('create', () => {
    it('creation succeeds with valid data', async () => {
      const dto = new SetupTenantDto();
      dto.siteName = faker.string.sample();
      dto.email = faker.internet.email();
      dto.password = '12345678';

      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);
      jest.spyOn(tenantRepo, 'save').mockResolvedValue({
        ...tenantFixture,
        siteName: dto.siteName,
      } as TenantEntity);
      jest.spyOn(userRepo, 'save').mockResolvedValue({} as UserEntity);
      jest
        .spyOn(userPasswordService, 'createHashPassword')
        .mockResolvedValue('hashedPassword');

      const tenant = await tenantService.create(dto);

      expect(tenant.id).toBeDefined();
      expect(tenant.siteName).toEqual(dto.siteName);
      expect(tenantRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userPasswordService.createHashPassword).toHaveBeenCalledWith(
        dto.password,
      );
    });

    it('creation fails with the duplicate site name', async () => {
      const dto = new SetupTenantDto();
      dto.siteName = faker.string.sample();
      dto.email = faker.internet.email();
      dto.password = '12345678';

      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenantFixture]);

      await expect(tenantService.create(dto)).rejects.toThrow(
        TenantAlreadyExistsException,
      );
    });

    it('should create super user with correct properties', async () => {
      const dto = new SetupTenantDto();
      dto.siteName = faker.string.sample();
      dto.email = faker.internet.email();
      dto.password = '12345678';

      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);
      jest.spyOn(tenantRepo, 'save').mockResolvedValue({
        ...tenantFixture,
        siteName: dto.siteName,
      } as TenantEntity);
      jest.spyOn(userRepo, 'save').mockResolvedValue({} as UserEntity);
      jest
        .spyOn(userPasswordService, 'createHashPassword')
        .mockResolvedValue('hashedPassword');

      await tenantService.create(dto);

      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          hashPassword: 'hashedPassword',
          type: 'SUPER',
        }),
      );
    });
  });
  describe('update', () => {
    let dto: UpdateTenantDto;

    beforeEach(() => {
      dto = new UpdateTenantDto();
      dto.siteName = faker.string.sample();
      dto.useEmail = faker.datatype.boolean();
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
        loginButtonType: LoginButtonTypeEnum.CUSTOM,
        loginButtonName: faker.string.sample(),
      };
    });

    it('update succeeds with valid data', async () => {
      const updatedTenant = { ...tenantFixture, ...dto };
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenantFixture]);
      jest
        .spyOn(tenantRepo, 'save')
        .mockResolvedValue(updatedTenant as TenantEntity);

      const tenant = await tenantService.update(dto);

      expect(tenant.id).toBeDefined();
      expect(tenant.siteName).toEqual(dto.siteName);
      expect(tenant.useEmail).toEqual(dto.useEmail);
      expect(tenant.allowDomains).toEqual(dto.allowDomains);
      expect(tenant.useOAuth).toEqual(dto.useOAuth);
      expect(tenant.oauthConfig).toEqual(dto.oauthConfig);
      expect(tenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
    });

    it('update fails when there is no tenant', async () => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);

      await expect(tenantService.update(dto)).rejects.toThrow(
        TenantNotFoundException,
      );
    });

    it('should handle null allowDomains', async () => {
      dto.allowDomains = null;
      const updatedTenant = { ...tenantFixture, ...dto };
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenantFixture]);
      jest
        .spyOn(tenantRepo, 'save')
        .mockResolvedValue(updatedTenant as TenantEntity);

      const tenant = await tenantService.update(dto);

      expect(tenant.allowDomains).toBeNull();
    });

    it('should handle null oauthConfig', async () => {
      dto.oauthConfig = null;
      const updatedTenant = { ...tenantFixture, ...dto };
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenantFixture]);
      jest
        .spyOn(tenantRepo, 'save')
        .mockResolvedValue(updatedTenant as TenantEntity);

      const tenant = await tenantService.update(dto);

      expect(tenant.oauthConfig).toBeNull();
    });
  });
  describe('findOne', () => {
    it('finding a tenant succeeds when there is a tenant', async () => {
      const tenant = await tenantService.findOne();

      expect(tenant).toEqual({ ...tenantFixture });
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
      expect(feedbackRepo.count).toHaveBeenCalledWith({
        where: { channel: { project: { tenant: { id: tenantId } } } },
      });
    });

    it('should return zero when no feedbacks exist', async () => {
      const tenantId = faker.number.int();
      const dto = new FeedbackCountByTenantIdDto();
      dto.tenantId = tenantId;
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(0);

      const feedbackCounts = await tenantService.countByTenantId(dto);

      expect(feedbackCounts.total).toEqual(0);
    });
  });

  describe('deleteOldFeedbacks', () => {
    it('should call deleteOldFeedbacks method', async () => {
      // This test verifies that the method exists and can be called
      // The actual implementation details are tested through integration tests
      await expect(tenantService.deleteOldFeedbacks()).resolves.not.toThrow();
    });
  });

  describe('addCronJob', () => {
    it('should call addCronJob method', async () => {
      // This test verifies that the method exists and can be called
      // The actual implementation details are tested through integration tests
      await expect(tenantService.addCronJob()).resolves.not.toThrow();
    });
  });
});
