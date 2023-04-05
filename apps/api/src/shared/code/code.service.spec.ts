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
import { TypeOrmModule } from '@nestjs/typeorm';
import MockDate from 'mockdate';
import { DataSource, Repository } from 'typeorm';

import { TestConfigs, clearEntities } from '@/utils/test-utils';

import { CodeTypeEnum } from './code-type.enum';
import { CodeEntity } from './code.entity';
import { CodeService } from './code.service';
import {
  SetCodeDto,
  SetCodeEmailVerificationDto,
  SetCodeResetPasswordDto,
  SetCodeUserInvitationDto,
} from './dtos/set-code.dto';

describe('code service', () => {
  let codeService: CodeService;

  let dataSource: DataSource;
  let codeRepo: Repository<CodeEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...TestConfigs, TypeOrmModule.forFeature([CodeEntity])],
      providers: [CodeService],
    }).compile();
    codeService = module.get(CodeService);

    dataSource = module.get(DataSource);
    codeRepo = dataSource.getRepository(CodeEntity);
  });

  beforeEach(async () => {
    await clearEntities([codeRepo]);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('setCode', () => {
    it('email verification type', async () => {
      const dto = new SetCodeEmailVerificationDto();
      dto.key = faker.datatype.string();
      dto.type = CodeTypeEnum.EMAIL_VEIRIFICATION;

      const code = await codeService.setCode(dto);
      expect(code).toHaveLength(6);

      const codeEntity = await codeRepo.findOneBy({
        key: codeService.getHashKey(dto.key),
      });
      expect(codeEntity.code).toEqual(code);
      expect(codeEntity.type).toEqual(dto.type);
      expect(codeEntity.isVerified).toEqual(false);
    });
    it('reset password type', async () => {
      const dto = new SetCodeResetPasswordDto();
      dto.key = faker.datatype.string();
      dto.type = CodeTypeEnum.RESET_PASSWORD;

      const code = await codeService.setCode(dto);
      expect(code).toHaveLength(6);

      const codeEntity = await codeRepo.findOneBy({
        key: codeService.getHashKey(dto.key),
      });
      expect(codeEntity.code).toEqual(code);
      expect(codeEntity.type).toEqual(dto.type);
      expect(codeEntity.isVerified).toEqual(false);
    });
    it('user invitation type', async () => {
      const dto = new SetCodeUserInvitationDto();
      dto.key = faker.datatype.string();
      dto.type = CodeTypeEnum.USER_INVITATION;
      dto.data = { roleId: faker.datatype.string() };

      const code = await codeService.setCode(dto);
      expect(code).toHaveLength(6);

      const codeEntity = await codeRepo.findOneBy({
        key: codeService.getHashKey(dto.key),
      });
      expect(codeEntity.code).toEqual(code);
      expect(codeEntity.type).toEqual(dto.type);
      expect(codeEntity.data).toEqual(dto.data);
      expect(codeEntity.isVerified).toEqual(false);
    });
  });
  describe('setCodeVerified', () => {
    let code: string;
    let dto: SetCodeDto;
    beforeEach(async () => {
      const type = getRandomEnumValue(CodeTypeEnum);
      if (type === CodeTypeEnum.EMAIL_VEIRIFICATION) {
        dto = new SetCodeEmailVerificationDto();
        dto.key = faker.datatype.string();
        dto.type = type;
      }
      if (type === CodeTypeEnum.RESET_PASSWORD) {
        dto = new SetCodeResetPasswordDto();
        dto.key = faker.datatype.string();
        dto.type = type;
      }
      if (type === CodeTypeEnum.USER_INVITATION) {
        dto = new SetCodeUserInvitationDto();
        dto.key = faker.datatype.string();
        dto.type = type;
        dto.data = { roleId: faker.datatype.string() };
      }
      code = await codeService.setCode(dto);
    });
    it('positive case', async () => {
      const { key, type } = dto;

      const originCode = await codeRepo.findOneBy({
        code,
        key: codeService.getHashKey(key),
        type,
      });

      expect(originCode.isVerified).toEqual(false);
      await codeService.setCodeVerified({ code, key, type });

      const verifiedCode = await codeRepo.findOneBy({
        code,
        key: codeService.getHashKey(key),
        type,
      });

      expect(verifiedCode.isVerified).toEqual(true);
    });
    it('invalid code', async () => {
      const { key, type } = dto;
      await expect(
        codeService.setCodeVerified({
          code: faker.datatype.string(6),
          key,
          type,
        }),
      ).rejects.toThrow(BadRequestException);
    });
    it('invalid key', async () => {
      const { type } = dto;
      await expect(
        codeService.setCodeVerified({
          code,
          key: faker.datatype.string(6),
          type,
        }),
      ).rejects.toThrow(NotFoundException);
    });
    it('expired date', async () => {
      MockDate.set(new Date(Date.now() + 5 * 60 * 1000 + 1000));

      const { key, type } = dto;

      await expect(
        codeService.setCodeVerified({ code, key, type }),
      ).rejects.toThrow(BadRequestException);
      MockDate.reset();
    });
  });
  describe('getDataByCodeAndType', () => {
    let code: string;
    const dto = new SetCodeUserInvitationDto();
    beforeEach(async () => {
      dto.key = faker.datatype.string();
      dto.type = CodeTypeEnum.USER_INVITATION;
      dto.data = { roleId: faker.datatype.string() };
      code = await codeService.setCode(dto);
    });
    it('', async () => {
      const data = await codeService.getDataByCodeAndType(
        CodeTypeEnum.USER_INVITATION,
        code,
      );
      expect(data).toEqual(dto.data);
    });
    it('invalid code', async () => {
      await expect(
        codeService.getDataByCodeAndType(
          CodeTypeEnum.USER_INVITATION,
          faker.datatype.string(),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('checkVerified', () => {
    let code: string;
    let dto: SetCodeDto;
    beforeEach(async () => {
      const type = getRandomEnumValue(CodeTypeEnum);
      if (type === CodeTypeEnum.EMAIL_VEIRIFICATION) {
        dto = new SetCodeEmailVerificationDto();
        dto.key = faker.datatype.string();
        dto.type = type;
      }
      if (type === CodeTypeEnum.RESET_PASSWORD) {
        dto = new SetCodeResetPasswordDto();
        dto.key = faker.datatype.string();
        dto.type = type;
      }
      if (type === CodeTypeEnum.USER_INVITATION) {
        dto = new SetCodeUserInvitationDto();
        dto.key = faker.datatype.string();
        dto.type = type;
        dto.data = { roleId: faker.datatype.string() };
      }
      code = await codeService.setCode(dto);
    });
    it('false', async () => {
      const isVerified = await codeService.checkVerified(dto.type, dto.key);
      expect(isVerified).toEqual(false);
    });
    it('true', async () => {
      const { key, type } = dto;
      await codeService.setCodeVerified({ code, type, key });
      const isVerified = await codeService.checkVerified(dto.type, dto.key);
      expect(isVerified).toEqual(true);
    });
  });
});
function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum) as Array<keyof T>;
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
}
