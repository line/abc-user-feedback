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
import * as bcrypt from 'bcrypt';
import type { Repository } from 'typeorm';

import { CodeEntity } from '@/shared/code/code.entity';
import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';

import { TestConfig } from '@/test-utils/util-functions';
import { UserPasswordServiceProviders } from '../../../test-utils/providers/user-password.service.providers';
import { ChangePasswordDto, ResetPasswordDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import { InvalidPasswordException, UserNotFoundException } from './exceptions';
import { UserPasswordService } from './user-password.service';

describe('UserPasswordService', () => {
  let userPasswordService: UserPasswordService;
  let resetPasswordMailingService: ResetPasswordMailingService;
  let userRepo: Repository<UserEntity>;
  let codeRepo: Repository<CodeEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: UserPasswordServiceProviders,
    }).compile();
    userPasswordService = module.get(UserPasswordService);
    resetPasswordMailingService = module.get(ResetPasswordMailingService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    codeRepo = module.get(getRepositoryToken(CodeEntity));
  });

  describe('sendResetPasswordMail', () => {
    it('sending a reset password mail succeeds with valid inputs', async () => {
      const email = faker.internet.email();

      await userPasswordService.sendResetPasswordMail(email);

      expect(
        resetPasswordMailingService.send.bind(resetPasswordMailingService),
      ).toHaveBeenCalledTimes(1);
    });
    it('sending a reset password mail fails with invalid email', async () => {
      const email = faker.internet.email();
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(
        userPasswordService.sendResetPasswordMail(email),
      ).rejects.toThrow(UserNotFoundException);

      expect(
        resetPasswordMailingService.send.bind(resetPasswordMailingService),
      ).toHaveBeenCalledTimes(0);
    });
  });
  describe('resetPassword', () => {
    it('resetting a password succeeds with valid inputs', async () => {
      const dto = new ResetPasswordDto();
      dto.email = faker.internet.email();
      dto.code = faker.string.sample();
      dto.password = faker.internet.password();
      jest
        .spyOn(codeRepo, 'findOne')
        .mockResolvedValue({ code: dto.code } as CodeEntity);

      const user = await userPasswordService.resetPassword(dto);

      expect(codeRepo.findOne.bind(codeRepo)).toHaveBeenCalledTimes(1);
      expect(bcrypt.compareSync(dto.password, user.hashPassword)).toBe(true);
    });
    it('resetting a password fails with an invalid email', async () => {
      const dto = new ResetPasswordDto();
      dto.email = faker.internet.email();
      dto.code = faker.string.sample();
      dto.password = faker.internet.password();
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(userPasswordService.resetPassword(dto)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
  describe('changePassword', () => {
    it('changing the password succeeds with valid inputs', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = faker.number.int();
      dto.password = faker.internet.password();
      dto.newPassword = faker.internet.password();
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue({
        id: dto.userId,
        hashPassword: await userPasswordService.createHashPassword(
          dto.password,
        ),
      } as UserEntity);

      const user = await userPasswordService.changePassword(dto);

      expect(bcrypt.compareSync(dto.newPassword, user.hashPassword)).toBe(true);
    });
    it('changing the password fails with the invalid original password', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = faker.number.int();
      dto.password = faker.internet.password();
      dto.newPassword = faker.internet.password();
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue({
        hashPassword: await userPasswordService.createHashPassword(
          faker.internet.password(),
        ),
      } as UserEntity);

      await expect(userPasswordService.changePassword(dto)).rejects.toThrow(
        InvalidPasswordException,
      );
    });
  });
  it('createHashPassword', async () => {
    const password = faker.internet.password();
    const hashPassword = await userPasswordService.createHashPassword(password);
    expect(bcrypt.compareSync(password, hashPassword)).toEqual(true);
  });
});
