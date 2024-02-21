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
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import MockDate from 'mockdate';
import type { Repository } from 'typeorm';

import { UserDto } from '@/domains/admin/user/dtos';
import { UserTypeEnum } from '@/domains/admin/user/entities/enums';
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
  let codeRepo: Repository<CodeEntity>;

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

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
          data: undefined,
        }),
      );
    });
    it('set reset password type', async () => {
      const dto = new SetCodeResetPasswordDto();
      dto.key = faker.string.sample();
      dto.type = CodeTypeEnum.RESET_PASSWORD;

      const code = await codeService.setCode(dto);

      expect(code).toHaveLength(6);
      expect(codeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          type: dto.type,
          key: dto.key,
          isVerified: false,
          data: undefined,
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
  });
  describe('verifyCode', () => {
    const codeEntity: CodeEntity = new CodeEntity();
    const key = faker.string.sample();
    beforeEach(async () => {
      codeEntity.code = faker.string.sample(6);
      codeEntity.key = key;
      codeEntity.type = CodeTypeEnum.EMAIL_VEIRIFICATION;
      codeEntity.isVerified = false;
      codeEntity.id = faker.number.int();
      codeEntity.expiredAt = DateTime.utc().plus({ minutes: 5 }).toJSDate();
    });
    it('verifying code succeeds with a valid code, key, type', async () => {
      const { code, type } = codeEntity;
      jest.spyOn(codeRepo, 'findOne').mockResolvedValue(codeEntity);

      await codeService.verifyCode({ code, key, type });

      expect(codeRepo.save).toHaveBeenCalledWith(
        Object.assign(codeEntity, { isVerified: true }),
      );
    });
    it('verifying code fails with an invalid code', async () => {
      const { type } = codeEntity;
      const invalidCode = faker.string.sample(6);
      jest.spyOn(codeRepo, 'findOne').mockResolvedValue(codeEntity);

      const { error } = await codeService.verifyCode({
        code: invalidCode,
        key,
        type,
      });
      expect(error).toEqual(new BadRequestException('invalid code'));
    });
    it('verifying code fails with an invalid code more than 5 times', async () => {
      const { type } = codeEntity;
      const invalidCode = faker.string.sample(6);
      jest
        .spyOn(codeRepo, 'findOne')
        .mockResolvedValue({ ...codeEntity, tryCount: 5 } as CodeEntity);

      const { error } = await codeService.verifyCode({
        code: invalidCode,
        key,
        type,
      });
      expect(error).toEqual(new BadRequestException('code expired'));
    });
    it('verifying code fails with an invalid key', async () => {
      const { code, type } = codeEntity;
      const invalidKey = faker.string.sample(6);
      jest.spyOn(codeRepo, 'findOne').mockResolvedValue(null);

      const { error } = await codeService.verifyCode({
        code,
        key: invalidKey,
        type,
      });
      expect(error).toEqual(new NotFoundException('not found code'));
    });
    it('verifying code fails at expired date', async () => {
      MockDate.set(new Date(Date.now() + 5 * 60 * 1000 + 1000));
      const { code, type } = codeEntity;
      jest.spyOn(codeRepo, 'findOne').mockResolvedValue(codeEntity);

      const { error } = await codeService.verifyCode({ code, key, type });
      expect(error).toEqual(new BadRequestException('code expired'));
      MockDate.reset();
    });
  });
});
