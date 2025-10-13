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
import * as bcrypt from 'bcrypt';
import type { Repository } from 'typeorm';

import { CodeEntity } from '@/shared/code/code.entity';
import { CodeService } from '@/shared/code/code.service';
import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';

import { TestConfig } from '@/test-utils/util-functions';
import { UserPasswordServiceProviders } from '../../../test-utils/providers/user-password.service.providers';
import { ChangePasswordDto, ResetPasswordDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import {
  InvalidCodeException,
  InvalidPasswordException,
  UserNotFoundException,
} from './exceptions';
import { UserPasswordService } from './user-password.service';

describe('UserPasswordService', () => {
  let userPasswordService: UserPasswordService;
  let resetPasswordMailingService: ResetPasswordMailingService;
  let codeService: CodeService;
  let userRepo: Repository<UserEntity>;
  let _codeRepo: Repository<CodeEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: UserPasswordServiceProviders,
    }).compile();
    userPasswordService = module.get(UserPasswordService);
    resetPasswordMailingService = module.get(ResetPasswordMailingService);
    codeService = module.get(CodeService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    _codeRepo = module.get(getRepositoryToken(CodeEntity));

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('sendResetPasswordMail', () => {
    it('sending a reset password mail succeeds with valid inputs', async () => {
      const email = faker.internet.email();
      const mockUser = { id: faker.number.int(), email } as UserEntity;
      const mockCode = faker.string.alphanumeric(6);

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(codeService, 'setCode').mockResolvedValue(mockCode);

      await userPasswordService.sendResetPasswordMail(email);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ email });
      expect(codeService.setCode).toHaveBeenCalledWith({
        type: 'RESET_PASSWORD',
        key: email,
      });
      expect(resetPasswordMailingService.send).toHaveBeenCalledWith({
        email,
        code: mockCode,
      });
    });

    it('sending a reset password mail fails with invalid email', async () => {
      const email = faker.internet.email();
      const findOneBySpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(null);
      const setCodeSpy = jest.spyOn(codeService, 'setCode');
      const sendSpy = jest.spyOn(resetPasswordMailingService, 'send');

      await expect(
        userPasswordService.sendResetPasswordMail(email),
      ).rejects.toThrow(UserNotFoundException);

      expect(findOneBySpy).toHaveBeenCalledWith({ email });
      expect(setCodeSpy).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
    });
  });
  describe('resetPassword', () => {
    it('resetting a password succeeds with valid inputs', async () => {
      const dto = new ResetPasswordDto();
      dto.email = faker.internet.email();
      dto.code = faker.string.alphanumeric(6);
      dto.password = faker.internet.password();

      const mockUser = {
        id: faker.number.int(),
        email: dto.email,
      } as UserEntity;

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(codeService, 'verifyCode').mockResolvedValue({ error: null });
      jest.spyOn(userRepo, 'save').mockResolvedValue(mockUser);

      const result = await userPasswordService.resetPassword(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ email: dto.email });
      expect(codeService.verifyCode).toHaveBeenCalledWith({
        type: 'RESET_PASSWORD',
        key: dto.email,
        code: dto.code,
      });
      expect(userRepo.save).toHaveBeenCalled();
      expect(bcrypt.compareSync(dto.password, result.hashPassword)).toBe(true);
    });

    it('resetting a password fails with an invalid email', async () => {
      const dto = new ResetPasswordDto();
      dto.email = faker.internet.email();
      dto.code = faker.string.alphanumeric(6);
      dto.password = faker.internet.password();

      const findOneBySpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(null);
      const verifyCodeSpy = jest.spyOn(codeService, 'verifyCode');

      await expect(userPasswordService.resetPassword(dto)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(findOneBySpy).toHaveBeenCalledWith({ email: dto.email });
      expect(verifyCodeSpy).not.toHaveBeenCalled();
    });

    it('resetting a password fails with an invalid code', async () => {
      const dto = new ResetPasswordDto();
      dto.email = faker.internet.email();
      dto.code = faker.string.alphanumeric(6);
      dto.password = faker.internet.password();

      const mockUser = {
        id: faker.number.int(),
        email: dto.email,
      } as UserEntity;
      const mockError = new InvalidCodeException();

      const findOneBySpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(mockUser);
      const verifyCodeSpy = jest
        .spyOn(codeService, 'verifyCode')
        .mockResolvedValue({ error: mockError });
      const saveSpy = jest.spyOn(userRepo, 'save');

      await expect(userPasswordService.resetPassword(dto)).rejects.toThrow(
        mockError,
      );

      expect(findOneBySpy).toHaveBeenCalledWith({ email: dto.email });
      expect(verifyCodeSpy).toHaveBeenCalledWith({
        type: 'RESET_PASSWORD',
        key: dto.email,
        code: dto.code,
      });
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
  describe('changePassword', () => {
    it('changing the password succeeds with valid inputs', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = faker.number.int();
      dto.password = faker.internet.password();
      dto.newPassword = faker.internet.password();

      const mockUser = {
        id: dto.userId,
        hashPassword: await userPasswordService.createHashPassword(
          dto.password,
        ),
      } as UserEntity;

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(userRepo, 'save').mockResolvedValue(mockUser);

      const result = await userPasswordService.changePassword(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: dto.userId });
      expect(userRepo.save).toHaveBeenCalled();
      expect(bcrypt.compareSync(dto.newPassword, result.hashPassword)).toBe(
        true,
      );
    });

    it('changing the password fails with the invalid original password', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = faker.number.int();
      dto.password = faker.internet.password();
      dto.newPassword = faker.internet.password();

      const mockUser = {
        id: dto.userId,
        hashPassword: await userPasswordService.createHashPassword(
          faker.internet.password(),
        ),
      } as UserEntity;

      const findOneBySpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(mockUser);
      const saveSpy = jest.spyOn(userRepo, 'save');

      await expect(userPasswordService.changePassword(dto)).rejects.toThrow(
        InvalidPasswordException,
      );

      expect(findOneBySpy).toHaveBeenCalledWith({ id: dto.userId });
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('changing the password fails when user does not exist', async () => {
      const dto = new ChangePasswordDto();
      dto.userId = faker.number.int();
      dto.password = faker.internet.password();
      dto.newPassword = faker.internet.password();

      const findOneBySpy = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(null);
      const saveSpy = jest.spyOn(userRepo, 'save');

      // This should fail because bcrypt.compareSync will fail with null hashPassword
      await expect(userPasswordService.changePassword(dto)).rejects.toThrow();

      expect(findOneBySpy).toHaveBeenCalledWith({ id: dto.userId });
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
  describe('createHashPassword', () => {
    it('creates a valid hash password', async () => {
      const password = faker.internet.password();
      const hashPassword =
        await userPasswordService.createHashPassword(password);

      expect(hashPassword).toBeDefined();
      expect(typeof hashPassword).toBe('string');
      expect(hashPassword.length).toBeGreaterThan(0);
      expect(bcrypt.compareSync(password, hashPassword)).toBe(true);
    });

    it('creates different hashes for the same password', async () => {
      const password = faker.internet.password();
      const hash1 = await userPasswordService.createHashPassword(password);
      const hash2 = await userPasswordService.createHashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(bcrypt.compareSync(password, hash1)).toBe(true);
      expect(bcrypt.compareSync(password, hash2)).toBe(true);
    });

    it('creates different hashes for different passwords', async () => {
      const password1 = faker.internet.password();
      const password2 = faker.internet.password();
      const hash1 = await userPasswordService.createHashPassword(password1);
      const hash2 = await userPasswordService.createHashPassword(password2);

      expect(hash1).not.toBe(hash2);
      expect(bcrypt.compareSync(password1, hash1)).toBe(true);
      expect(bcrypt.compareSync(password2, hash2)).toBe(true);
      expect(bcrypt.compareSync(password1, hash2)).toBe(false);
      expect(bcrypt.compareSync(password2, hash1)).toBe(false);
    });
  });
});
