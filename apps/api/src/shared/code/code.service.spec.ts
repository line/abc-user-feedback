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
import { getRepositoryToken } from '@nestjs/typeorm';
import MockDate from 'mockdate';

import { UserDto } from '@/domains/admin/user/dtos';
import { UserTypeEnum } from '@/domains/admin/user/entities/enums';
import { codeFixture } from '@/test-utils/fixtures';
import type { CodeRepositoryStub } from '@/test-utils/stubs';
import { TestConfig } from '@/test-utils/util-functions';
import { CodeServiceProviders } from '../../test-utils/providers/code.service.providers';
import { CodeTypeEnum } from './code-type.enum';
import { CodeEntity } from './code.entity';
import { CodeService } from './code.service';
import {
  SetCodeEmailVerificationDto,
  SetCodeResetPasswordDto,
  SetCodeUserInvitationDto,
} from './dtos/set-code.dto';

describe('CodeService', () => {
  let codeService: CodeService;
  let codeRepo: CodeRepositoryStub;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: CodeServiceProviders,
    }).compile();
    codeService = module.get(CodeService);
    codeRepo = module.get(getRepositoryToken(CodeEntity));
  });

  describe('setCode', () => {
    it('set email verification type', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
        }),
      );
    });
    it('set reset password type', async () => {
      const dto = new SetCodeResetPasswordDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.RESET_PASSWORD;
      jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
        }),
      );
    });
    it('set user invitation type with SUPER user type', async () => {
      const dto = new SetCodeUserInvitationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.USER_INVITATION;
      dto.data = {
        roleId: faker.number.int(),
        userType: UserTypeEnum.SUPER,
        invitedBy: new UserDto(),
      };
      jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
          data: dto.data,
        }),
      );
    });
    it('set user invitation type with GENERAL user type', async () => {
      const dto = new SetCodeUserInvitationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.USER_INVITATION;
      dto.data = {
        roleId: faker.number.int(),
        userType: UserTypeEnum.GENERAL,
        invitedBy: new UserDto(),
      };
      jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
          data: dto.data,
        }),
      );
    });
    it('set code with custom duration', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      dto.durationSec = 300; // 5 minutes
      jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
          expiredAt: expect.any(Date),
        }),
      );
    });
    it('set code with default duration when durationSec is not provided', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
          expiredAt: expect.any(Date),
        }),
      );
    });
  });
  describe('verifyCode', () => {
    const key = faker.string.sample();
    beforeEach(() => {
      codeRepo.setType(CodeTypeEnum.EMAIL_VEIRIFICATION);
      codeRepo.setIsVerified(false);
    });
    it('verifying code succeeds with a valid code, key, type', async () => {
      const { code, type } = codeFixture;
      jest.spyOn(codeRepo, 'save');

      const { error } = await codeService.verifyCode({ code, key, type });

      expect(error).toEqual(null);
    });
    it('verifying code fails with an invalid code', async () => {
      const { type } = codeFixture;
      const invalidCode = faker.string.sample(6);

      const { error } = await codeService.verifyCode({
        code: invalidCode,
        key,
        type,
      });
      expect(error).toEqual(new BadRequestException('invalid code'));
    });
    it('verifying code fails with an invalid code more than 5 times', async () => {
      const { type } = codeFixture;
      const invalidCode = faker.string.sample(6);
      codeRepo.setTryCount(5);

      const { error } = await codeService.verifyCode({
        code: invalidCode,
        key,
        type,
      });
      expect(error).toEqual(new BadRequestException('code expired'));
    });
    it('verifying code fails with an invalid key', async () => {
      const { code, type } = codeFixture;
      const invalidKey = faker.string.sample(6);
      codeRepo.setNull();

      const { error } = await codeService.verifyCode({
        code,
        key: invalidKey,
        type,
      });
      expect(error).toEqual(new NotFoundException('not found code'));
    });
    it('verifying code fails at expired date', async () => {
      MockDate.set(new Date(Date.now() + 5 * 60 * 1000 + 1000));
      const { code, type } = codeFixture;

      const { error } = await codeService.verifyCode({ code, key, type });
      expect(error).toEqual(new BadRequestException('code expired'));
      MockDate.reset();
    });
    it('verifying code fails when already verified', async () => {
      const { code, type } = codeFixture;
      codeRepo.setIsVerified(true);

      const { error } = await codeService.verifyCode({ code, key, type });
      expect(error).toEqual(new BadRequestException('already verified'));
    });
    it('verifying code increments try count on invalid code', async () => {
      const { type } = codeFixture;
      const invalidCode = faker.string.sample(6);
      const initialTryCount = 0; // Start with 0
      const saveSpy = jest.spyOn(codeRepo, 'save');

      // Mock findOne to return the entity with current tryCount
      const mockEntity = {
        ...codeFixture,
        tryCount: initialTryCount,
        key,
        type,
        isVerified: false,
        expiredAt: new Date(Date.now() + 10 * 60 * 1000), // Future date
      };
      jest.spyOn(codeRepo, 'findOne').mockResolvedValue(mockEntity as any);

      const { error } = await codeService.verifyCode({
        code: invalidCode,
        key,
        type,
      });

      expect(error).toEqual(new BadRequestException('invalid code'));
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          tryCount: initialTryCount + 1,
        }),
      );
    });
    it('updates existing code when key and type already exist', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      // Mock findOneBy to return an existing entity
      const existingEntity = {
        id: faker.number.int(),
        type: dto.type,
        key: dto.key,
        code: faker.string.sample(6),
        isVerified: false,
        tryCount: 0,
        expiredAt: new Date(),
        data: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CodeEntity;

      jest.spyOn(codeRepo, 'findOneBy').mockReturnValue(existingEntity);
      const saveSpy = jest.spyOn(codeRepo, 'save');

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
        }),
      );
    });
  });

  describe('getDataByCodeAndType', () => {
    it('returns data when code and type are valid', async () => {
      const code = faker.string.sample(6);
      const type = CodeTypeEnum.USER_INVITATION;
      const expectedData = {
        roleId: faker.number.int(),
        userType: UserTypeEnum.GENERAL,
        invitedBy: new UserDto(),
      };
      codeRepo.setData(expectedData);

      const result = await codeService.getDataByCodeAndType(type, code);

      expect(result).toEqual(expectedData);
    });

    it('throws NotFoundException when code is not found', async () => {
      const code = faker.string.sample(6);
      const type = CodeTypeEnum.USER_INVITATION;
      codeRepo.setNull();

      await expect(
        codeService.getDataByCodeAndType(type, code),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkVerified', () => {
    it('returns true when code is verified', async () => {
      const key = faker.string.sample();
      const type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      codeRepo.setIsVerified(true);

      const result = await codeService.checkVerified(type, key);

      expect(result).toBe(true);
    });

    it('returns false when code is not verified', async () => {
      const key = faker.string.sample();
      const type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      codeRepo.setIsVerified(false);

      const result = await codeService.checkVerified(type, key);

      expect(result).toBe(false);
    });

    it('throws NotFoundException when code is not found', async () => {
      const key = faker.string.sample();
      const type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      codeRepo.setNull();

      await expect(codeService.checkVerified(type, key)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createCode (private method)', () => {
    it('generates 6-digit code', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(code).toMatch(/^\d{6}$/);
    });

    it('generates different codes on multiple calls', async () => {
      const dto1 = new SetCodeEmailVerificationDto();
      dto1.key = faker.string.sample();
      dto1.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const dto2 = new SetCodeEmailVerificationDto();
      dto2.key = faker.string.sample();
      dto2.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const code1 = await codeService.setCode(dto1);
      const code2 = await codeService.setCode(dto2);

      expect(code1).not.toEqual(code2);
    });
  });

  describe('Edge cases and error scenarios', () => {
    it('handles empty key gracefully', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = '';
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
    });

    it('handles special characters in key', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = 'test@example.com';
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
    });

    it('handles very long key', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = 'a'.repeat(1000);
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
    });
  });
});
