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
import { SetupTenantRequestDto, UpdateTenantRequestDto } from './dtos/requests';
import {
  CountFeedbacksByTenantIdResponseDto,
  GetTenantResponseDto,
} from './dtos/responses';
import { LoginButtonTypeEnum } from './entities/enums';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

const MockTenantService = {
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  countByTenantId: jest.fn(),
};

describe('TenantController', () => {
  let tenantController: TenantController;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        getMockProvider(TenantService, MockTenantService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    tenantController = module.get(TenantController);
  });

  describe('setup', () => {
    it('should create a new tenant successfully', async () => {
      const mockTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        createdAt: faker.date.past(),
      };

      MockTenantService.create.mockResolvedValue(mockTenant);

      const dto = new SetupTenantRequestDto();
      dto.siteName = faker.string.alphanumeric(10);
      dto.email = faker.internet.email();
      dto.password = '12345678';

      await tenantController.setup(dto);

      expect(MockTenantService.create).toHaveBeenCalledTimes(1);
      expect(MockTenantService.create).toHaveBeenCalledWith(dto);
    });

    it('should handle tenant setup with valid email format', async () => {
      const mockTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        createdAt: faker.date.past(),
      };

      MockTenantService.create.mockResolvedValue(mockTenant);

      const dto = new SetupTenantRequestDto();
      dto.siteName = faker.string.alphanumeric(10);
      dto.email = 'test@example.com';
      dto.password = 'ValidPass123!';

      await tenantController.setup(dto);

      expect(MockTenantService.create).toHaveBeenCalledTimes(1);
      expect(MockTenantService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update tenant successfully', async () => {
      const mockUpdatedTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        useEmail: true,
        useOAuth: false,
        allowDomains: ['example.com'],
        oauthConfig: null,
        updatedAt: faker.date.recent(),
      };

      MockTenantService.update.mockResolvedValue(mockUpdatedTenant);

      const dto = new UpdateTenantRequestDto();
      dto.siteName = faker.string.alphanumeric(10);
      dto.description = faker.string.alphanumeric(20);
      dto.useEmail = true;
      dto.useOAuth = false;
      dto.allowDomains = ['example.com'];
      dto.oauthConfig = null;

      await tenantController.update(dto);

      expect(MockTenantService.update).toHaveBeenCalledTimes(1);
      expect(MockTenantService.update).toHaveBeenCalledWith(dto);
    });

    it('should handle tenant update with OAuth configuration', async () => {
      const mockUpdatedTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        useEmail: false,
        useOAuth: true,
        allowDomains: null,
        oauthConfig: {
          clientId: faker.string.alphanumeric(20),
          clientSecret: faker.string.alphanumeric(30),
          authCodeRequestURL: faker.internet.url(),
          scopeString: 'read write',
          accessTokenRequestURL: faker.internet.url(),
          userProfileRequestURL: faker.internet.url(),
          emailKey: 'email',
          loginButtonType: 'GOOGLE',
          loginButtonName: 'Google Login',
        },
        updatedAt: faker.date.recent(),
      };

      MockTenantService.update.mockResolvedValue(mockUpdatedTenant);

      const dto = new UpdateTenantRequestDto();
      dto.siteName = faker.string.alphanumeric(10);
      dto.description = faker.string.alphanumeric(20);
      dto.useEmail = false;
      dto.useOAuth = true;
      dto.allowDomains = null;
      dto.oauthConfig = {
        clientId: faker.string.alphanumeric(20),
        clientSecret: faker.string.alphanumeric(30),
        authCodeRequestURL: faker.internet.url(),
        scopeString: 'read write',
        accessTokenRequestURL: faker.internet.url(),
        userProfileRequestURL: faker.internet.url(),
        emailKey: 'email',
        loginButtonType: LoginButtonTypeEnum.GOOGLE,
        loginButtonName: 'Google Login',
      };

      await tenantController.update(dto);

      expect(MockTenantService.update).toHaveBeenCalledTimes(1);
      expect(MockTenantService.update).toHaveBeenCalledWith(dto);
    });

    it('should handle tenant update with minimal data', async () => {
      const mockUpdatedTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        description: null,
        useEmail: false,
        useOAuth: false,
        allowDomains: null,
        oauthConfig: null,
        updatedAt: faker.date.recent(),
      };

      MockTenantService.update.mockResolvedValue(mockUpdatedTenant);

      const dto = new UpdateTenantRequestDto();
      dto.siteName = faker.string.alphanumeric(10);
      dto.description = null;
      dto.useEmail = false;
      dto.useOAuth = false;
      dto.allowDomains = null;
      dto.oauthConfig = null;

      await tenantController.update(dto);

      expect(MockTenantService.update).toHaveBeenCalledTimes(1);
      expect(MockTenantService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('get', () => {
    it('should return tenant information successfully', async () => {
      const mockTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        useEmail: true,
        useOAuth: false,
        allowDomains: ['example.com'],
        oauthConfig: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      MockTenantService.findOne.mockResolvedValue(mockTenant);

      const result = await tenantController.get();

      expect(MockTenantService.findOne).toHaveBeenCalledTimes(1);
      expect(MockTenantService.findOne).toHaveBeenCalledWith();
      expect(result).toBeInstanceOf(GetTenantResponseDto);
      expect(result.id).toBe(mockTenant.id);
      expect(result.siteName).toBe(mockTenant.siteName);
      expect(result.description).toBe(mockTenant.description);
      expect(result.useEmail).toBe(mockTenant.useEmail);
      expect(result.useOAuth).toBe(mockTenant.useOAuth);
      expect(result.allowDomains).toEqual(mockTenant.allowDomains);
      expect(result.oauthConfig).toBe(mockTenant.oauthConfig);
    });

    it('should return tenant with OAuth configuration', async () => {
      const mockTenant = {
        id: faker.number.int(),
        siteName: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        useEmail: false,
        useOAuth: true,
        allowDomains: null,
        oauthConfig: {
          oauthUse: true,
          clientId: faker.string.alphanumeric(20),
          clientSecret: faker.string.alphanumeric(30),
          authCodeRequestURL: faker.internet.url(),
          scopeString: 'read write',
          accessTokenRequestURL: faker.internet.url(),
          userProfileRequestURL: faker.internet.url(),
          emailKey: 'email',
          loginButtonType: 'GOOGLE',
          loginButtonName: 'Google Login',
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      MockTenantService.findOne.mockResolvedValue(mockTenant);

      const result = await tenantController.get();

      expect(MockTenantService.findOne).toHaveBeenCalledTimes(1);
      expect(MockTenantService.findOne).toHaveBeenCalledWith();
      expect(result).toBeInstanceOf(GetTenantResponseDto);
      expect(result.id).toBe(mockTenant.id);
      expect(result.siteName).toBe(mockTenant.siteName);
      expect(result.useOAuth).toBe(mockTenant.useOAuth);
      expect(result.oauthConfig).toBeDefined();
      expect(result.oauthConfig?.clientId).toBe(
        mockTenant.oauthConfig.clientId,
      );
    });
  });

  describe('countFeedbacks', () => {
    it('should return feedback count by tenant id successfully', async () => {
      const tenantId = faker.number.int();
      const mockCount = {
        total: faker.number.int({ min: 0, max: 1000 }),
      };

      MockTenantService.countByTenantId.mockResolvedValue(mockCount);

      const result = await tenantController.countFeedbacks(tenantId);

      expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
      expect(MockTenantService.countByTenantId).toHaveBeenCalledWith({
        tenantId,
      });
      expect(result).toBeInstanceOf(CountFeedbacksByTenantIdResponseDto);
      expect(result.total).toBe(mockCount.total);
    });

    it('should return zero count when no feedbacks exist', async () => {
      const tenantId = faker.number.int();
      const mockCount = {
        total: 0,
      };

      MockTenantService.countByTenantId.mockResolvedValue(mockCount);

      const result = await tenantController.countFeedbacks(tenantId);

      expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
      expect(MockTenantService.countByTenantId).toHaveBeenCalledWith({
        tenantId,
      });
      expect(result).toBeInstanceOf(CountFeedbacksByTenantIdResponseDto);
      expect(result.total).toBe(0);
    });

    it('should handle large feedback counts', async () => {
      const tenantId = faker.number.int();
      const mockCount = {
        total: faker.number.int({ min: 10000, max: 100000 }),
      };

      MockTenantService.countByTenantId.mockResolvedValue(mockCount);

      const result = await tenantController.countFeedbacks(tenantId);

      expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
      expect(MockTenantService.countByTenantId).toHaveBeenCalledWith({
        tenantId,
      });
      expect(result).toBeInstanceOf(CountFeedbacksByTenantIdResponseDto);
      expect(result.total).toBe(mockCount.total);
    });
  });

  describe('Error Cases', () => {
    describe('setup', () => {
      it('should handle service errors during tenant setup', async () => {
        const error = new Error('Tenant setup failed');
        MockTenantService.create.mockRejectedValue(error);

        const dto = new SetupTenantRequestDto();
        dto.siteName = faker.string.alphanumeric(10);
        dto.email = faker.internet.email();
        dto.password = '12345678';

        await expect(tenantController.setup(dto)).rejects.toThrow(error);
        expect(MockTenantService.create).toHaveBeenCalledTimes(1);
      });

      it('should handle tenant already exists error', async () => {
        const error = new Error('Tenant already exists');
        MockTenantService.create.mockRejectedValue(error);

        const dto = new SetupTenantRequestDto();
        dto.siteName = faker.string.alphanumeric(10);
        dto.email = faker.internet.email();
        dto.password = '12345678';

        await expect(tenantController.setup(dto)).rejects.toThrow(error);
        expect(MockTenantService.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('update', () => {
      it('should handle service errors during tenant update', async () => {
        const error = new Error('Tenant update failed');
        MockTenantService.update.mockRejectedValue(error);

        const dto = new UpdateTenantRequestDto();
        dto.siteName = faker.string.alphanumeric(10);
        dto.description = faker.string.alphanumeric(20);
        dto.useEmail = true;
        dto.useOAuth = false;
        dto.allowDomains = ['example.com'];
        dto.oauthConfig = null;

        await expect(tenantController.update(dto)).rejects.toThrow(error);
        expect(MockTenantService.update).toHaveBeenCalledTimes(1);
      });

      it('should handle tenant not found error during update', async () => {
        const error = new Error('Tenant not found');
        MockTenantService.update.mockRejectedValue(error);

        const dto = new UpdateTenantRequestDto();
        dto.siteName = faker.string.alphanumeric(10);
        dto.description = faker.string.alphanumeric(20);
        dto.useEmail = true;
        dto.useOAuth = false;
        dto.allowDomains = ['example.com'];
        dto.oauthConfig = null;

        await expect(tenantController.update(dto)).rejects.toThrow(error);
        expect(MockTenantService.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('get', () => {
      it('should handle service errors when getting tenant', async () => {
        const error = new Error('Failed to get tenant');
        MockTenantService.findOne.mockRejectedValue(error);

        await expect(tenantController.get()).rejects.toThrow(error);
        expect(MockTenantService.findOne).toHaveBeenCalledTimes(1);
      });

      it('should handle tenant not found error', async () => {
        const error = new Error('Tenant not found');
        MockTenantService.findOne.mockRejectedValue(error);

        await expect(tenantController.get()).rejects.toThrow(error);
        expect(MockTenantService.findOne).toHaveBeenCalledTimes(1);
      });
    });

    describe('countFeedbacks', () => {
      it('should handle service errors when counting feedbacks', async () => {
        const tenantId = faker.number.int();
        const error = new Error('Failed to count feedbacks');
        MockTenantService.countByTenantId.mockRejectedValue(error);

        await expect(tenantController.countFeedbacks(tenantId)).rejects.toThrow(
          error,
        );
        expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
      });

      it('should handle invalid tenant id error', async () => {
        const tenantId = faker.number.int();
        const error = new Error('Invalid tenant id');
        MockTenantService.countByTenantId.mockRejectedValue(error);

        await expect(tenantController.countFeedbacks(tenantId)).rejects.toThrow(
          error,
        );
        expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Edge Cases', () => {
    describe('setup', () => {
      it('should handle empty site name', async () => {
        const mockTenant = {
          id: faker.number.int(),
          siteName: '',
          createdAt: faker.date.past(),
        };

        MockTenantService.create.mockResolvedValue(mockTenant);

        const dto = new SetupTenantRequestDto();
        dto.siteName = '';
        dto.email = faker.internet.email();
        dto.password = '12345678';

        await tenantController.setup(dto);

        expect(MockTenantService.create).toHaveBeenCalledTimes(1);
        expect(MockTenantService.create).toHaveBeenCalledWith(dto);
      });

      it('should handle very long site name', async () => {
        const longSiteName = 'a'.repeat(20);
        const mockTenant = {
          id: faker.number.int(),
          siteName: longSiteName,
          createdAt: faker.date.past(),
        };

        MockTenantService.create.mockResolvedValue(mockTenant);

        const dto = new SetupTenantRequestDto();
        dto.siteName = longSiteName;
        dto.email = faker.internet.email();
        dto.password = '12345678';

        await tenantController.setup(dto);

        expect(MockTenantService.create).toHaveBeenCalledTimes(1);
        expect(MockTenantService.create).toHaveBeenCalledWith(dto);
      });
    });

    describe('update', () => {
      it('should handle update with empty description', async () => {
        const mockUpdatedTenant = {
          id: faker.number.int(),
          siteName: faker.string.alphanumeric(10),
          description: '',
          useEmail: true,
          useOAuth: false,
          allowDomains: ['example.com'],
          oauthConfig: null,
          updatedAt: faker.date.recent(),
        };

        MockTenantService.update.mockResolvedValue(mockUpdatedTenant);

        const dto = new UpdateTenantRequestDto();
        dto.siteName = faker.string.alphanumeric(10);
        dto.description = '';
        dto.useEmail = true;
        dto.useOAuth = false;
        dto.allowDomains = ['example.com'];
        dto.oauthConfig = null;

        await tenantController.update(dto);

        expect(MockTenantService.update).toHaveBeenCalledTimes(1);
        expect(MockTenantService.update).toHaveBeenCalledWith(dto);
      });

      it('should handle update with empty allow domains array', async () => {
        const mockUpdatedTenant = {
          id: faker.number.int(),
          siteName: faker.string.alphanumeric(10),
          description: faker.string.alphanumeric(20),
          useEmail: true,
          useOAuth: false,
          allowDomains: [],
          oauthConfig: null,
          updatedAt: faker.date.recent(),
        };

        MockTenantService.update.mockResolvedValue(mockUpdatedTenant);

        const dto = new UpdateTenantRequestDto();
        dto.siteName = faker.string.alphanumeric(10);
        dto.description = faker.string.alphanumeric(20);
        dto.useEmail = true;
        dto.useOAuth = false;
        dto.allowDomains = [];
        dto.oauthConfig = null;

        await tenantController.update(dto);

        expect(MockTenantService.update).toHaveBeenCalledTimes(1);
        expect(MockTenantService.update).toHaveBeenCalledWith(dto);
      });
    });

    describe('countFeedbacks', () => {
      it('should handle zero tenant id', async () => {
        const tenantId = 0;
        const mockCount = {
          total: 0,
        };

        MockTenantService.countByTenantId.mockResolvedValue(mockCount);

        const result = await tenantController.countFeedbacks(tenantId);

        expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
        expect(MockTenantService.countByTenantId).toHaveBeenCalledWith({
          tenantId,
        });
        expect(result).toBeInstanceOf(CountFeedbacksByTenantIdResponseDto);
        expect(result.total).toBe(0);
      });

      it('should handle negative tenant id', async () => {
        const tenantId = -1;
        const mockCount = {
          total: 0,
        };

        MockTenantService.countByTenantId.mockResolvedValue(mockCount);

        const result = await tenantController.countFeedbacks(tenantId);

        expect(MockTenantService.countByTenantId).toHaveBeenCalledTimes(1);
        expect(MockTenantService.countByTenantId).toHaveBeenCalledWith({
          tenantId,
        });
        expect(result).toBeInstanceOf(CountFeedbacksByTenantIdResponseDto);
        expect(result.total).toBe(0);
      });
    });
  });
});
