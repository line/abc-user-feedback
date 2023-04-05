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
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { CodeService } from '@/shared/code/code.service';
import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';
import {
  TestConfigs,
  clearEntities,
  getMockProvider,
} from '@/utils/test-utils';

import { OWNER_ROLE } from '../role/role.constant';
import { RoleEntity } from '../role/role.entity';
import { ChangePasswordDto, ResetPasswordDto } from './dtos';
import { UserStateEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions';
import { UserPasswordService } from './user-password.service';

describe('UserPasswordService', () => {
  let userPasswordService: UserPasswordService;

  let dataSource: DataSource;
  let userRepo: Repository<UserEntity>;
  let roleRepo: Repository<RoleEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...TestConfigs,
        TypeOrmModule.forFeature([UserEntity, RoleEntity]),
      ],
      providers: [
        getMockProvider(
          ResetPasswordMailingService,
          MockResetPasswordMailingService,
        ),
        getMockProvider(CodeService, MockCodeService),
        UserPasswordService,
      ],
    }).compile();
    userPasswordService = module.get(UserPasswordService);

    dataSource = module.get(DataSource);
    userRepo = dataSource.getRepository(UserEntity);
    roleRepo = dataSource.getRepository(RoleEntity);
  });
  afterEach(async () => {
    await dataSource.destroy();
  });

  let userEntity: UserEntity;
  let originalPassword: string;
  beforeEach(async () => {
    await clearEntities([userRepo, roleRepo]);

    originalPassword = faker.internet.password();

    userEntity = await userRepo.save({
      email: faker.internet.email(),
      state: UserStateEnum.Active,
      hashPassword: await userPasswordService.createHashPassword(
        originalPassword,
      ),
      role: await roleRepo.save(OWNER_ROLE),
    });
  });

  describe('sendResetPasswordMail', () => {
    it('positive case', async () => {
      await userPasswordService.sendResetPasswordMail(userEntity.email);

      expect(MockCodeService.setCode).toHaveBeenCalledTimes(1);
      expect(MockResetPasswordMailingService.send).toHaveBeenCalledTimes(1);
    });
    it('invalid email', async () => {
      await expect(
        userPasswordService.sendResetPasswordMail(faker.internet.email()),
      ).rejects.toThrow(UserNotFoundException);
    });
  });
  describe('resetPassword', () => {
    it('positive case', async () => {
      const dto = new ResetPasswordDto();
      dto.email = userEntity.email;
      dto.password = faker.internet.password();

      await userPasswordService.resetPassword(dto);

      expect(MockCodeService.setCodeVerified).toHaveBeenCalledTimes(1);

      const updatedUser = await userRepo.findOneBy({ id: userEntity.id });

      expect(updatedUser.hashPassword).not.toEqual(userEntity.hashPassword);
      expect(
        bcrypt.compareSync(dto.password, updatedUser.hashPassword),
      ).toEqual(true);
    });
  });
  describe('changePassword', () => {
    it('positive case', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = userEntity.id;
      dto.password = originalPassword;
      dto.newPassword = faker.datatype.string();

      await userPasswordService.changePassword(dto);

      const updatedUser = await userRepo.findOneBy({ id: userEntity.id });

      expect(
        bcrypt.compareSync(dto.newPassword, updatedUser.hashPassword),
      ).toEqual(true);
    });
    it('invalid original password', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = userEntity.id;
      dto.password = faker.datatype.string();
      dto.newPassword = faker.datatype.string();

      await expect(userPasswordService.changePassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  it('createHashPassword', async () => {
    const password = faker.internet.password();
    const hashPassword = await userPasswordService.createHashPassword(password);
    expect(bcrypt.compareSync(password, hashPassword)).toEqual(true);
  });
});

const MockResetPasswordMailingService = {
  send: jest.fn(),
};
const MockCodeService = {
  setCode: jest.fn(),
  setCodeVerified: jest.fn(),
};
