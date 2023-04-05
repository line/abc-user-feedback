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
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import { CodeTypeEnum } from '@/shared/code/code-type.enum';
import { CodeService } from '@/shared/code/code.service';
import { EmailVerificationMailingService } from '@/shared/mailing/email-verification-mailing.service';
import { getMockProvider } from '@/utils/test-utils';

import { CreateUserService } from '../user/create-user.service';
import { UserDto } from '../user/dtos';
import { UserStateEnum } from '../user/entities/enums';
import { UserEntity } from '../user/entities/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../user/exceptions';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  JwtDto,
  SendEmailCodeDto,
  SignUpEmailUserDto,
  SignUpInvitationUserDto,
  ValidateEmailUserDto,
  VerifyEmailCodeDto,
} from './dtos';
import { PasswordNotMatchException, UserBlockedException } from './exceptions';

jest.useFakeTimers();

describe('auth service ', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        getMockProvider(JwtService, MockJwtService),
        getMockProvider(UserService, MockUserService),
        getMockProvider(CreateUserService, MockCreateUserService),
        getMockProvider(CodeService, MockCodeService),
        getMockProvider(
          EmailVerificationMailingService,
          MockEmailVerificationMailingService,
        ),
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  it('defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sendEmailCode', () => {
    const code = faker.datatype.string();

    it('positive case', async () => {
      jest.spyOn(MockUserService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(MockCodeService, 'setCode').mockResolvedValue(code);

      const dto = new SendEmailCodeDto();
      dto.email = faker.internet.email();

      const result = await authService.sendEmailCode(dto);

      expect(MockUserService.findByEmail).toHaveBeenCalledTimes(1);
      expect(MockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(MockCodeService.setCode).toHaveBeenCalledTimes(1);
      expect(MockCodeService.setCode).toHaveBeenCalledWith({
        type: CodeTypeEnum.EMAIL_VEIRIFICATION,
        key: dto.email,
      });
      expect(MockEmailVerificationMailingService.send).toHaveBeenCalledTimes(1);
      expect(MockEmailVerificationMailingService.send).toHaveBeenCalledWith({
        code,
        email: dto.email,
      });

      const expectResult = dayjs()
        .add(5 * 60, 'seconds')
        .format();
      expect(result).toEqual(expectResult);
    });
    it('a user with the same email exists', async () => {
      jest
        .spyOn(MockUserService, 'findByEmail')
        .mockResolvedValue(new UserEntity());

      const dto = new SendEmailCodeDto();
      dto.email = faker.internet.email();

      await expect(authService.sendEmailCode(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(MockUserService.findByEmail).toHaveBeenCalledTimes(1);
      expect(MockCodeService.setCode).toHaveBeenCalledTimes(0);
      expect(MockEmailVerificationMailingService.send).toHaveBeenCalledTimes(0);
    });
  });
  describe('verifyEmailCode', () => {
    it('positive case', async () => {
      const dto = new VerifyEmailCodeDto();
      dto.email = faker.internet.email();
      dto.code = faker.datatype.string();

      await authService.verifyEmailCode(dto);

      expect(MockCodeService.setCodeVerified).toHaveBeenCalledTimes(1);
      expect(MockCodeService.setCodeVerified).toHaveBeenCalledWith({
        type: CodeTypeEnum.EMAIL_VEIRIFICATION,
        key: dto.email,
        code: dto.code,
      });
    });

    it('invalid code', async () => {
      jest
        .spyOn(MockCodeService, 'setCodeVerified')
        .mockRejectedValue(new Error());

      const dto = new VerifyEmailCodeDto();
      dto.email = faker.internet.email();
      dto.code = faker.datatype.string();

      await expect(authService.verifyEmailCode(dto)).rejects.toThrow(Error);

      expect(MockCodeService.setCodeVerified).toHaveBeenCalledTimes(1);
      expect(MockCodeService.setCodeVerified).toHaveBeenCalledWith({
        type: CodeTypeEnum.EMAIL_VEIRIFICATION,
        key: dto.email,
        code: dto.code,
      });
    });
  });
  describe('validateEmailUser', () => {
    it('positive case', async () => {
      const originalPassword = faker.internet.password();
      const hashPassword = bcrypt.hashSync(originalPassword, 0);

      const userEntity = new UserEntity();
      userEntity.hashPassword = hashPassword;

      jest.spyOn(MockUserService, 'findByEmail').mockResolvedValue(userEntity);

      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = originalPassword;

      const result = await authService.validateEmailUser(dto);
      expect(result).toEqual(userEntity);
    });
    it('invalid password', async () => {
      const originalPassword = faker.internet.password();
      const hashPassword = bcrypt.hashSync(originalPassword, 0);
      const userEntity = new UserEntity();
      userEntity.hashPassword = hashPassword;

      jest.spyOn(MockUserService, 'findByEmail').mockResolvedValue(userEntity);

      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      await expect(authService.validateEmailUser(dto)).rejects.toThrow(
        PasswordNotMatchException,
      );
    });
    it('invalid email', async () => {
      jest.spyOn(MockUserService, 'findByEmail').mockResolvedValue(null);

      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      await expect(authService.validateEmailUser(dto)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('signUpEmailUser', () => {
    it('positive case', async () => {
      jest.spyOn(MockCodeService, 'checkVerified').mockResolvedValue(true);
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      await authService.signUpEmailUser(dto);

      expect(MockCodeService.checkVerified).toHaveBeenCalledTimes(1);
      expect(MockCreateUserService.createEmailUser).toHaveBeenCalledTimes(1);
    });
    it('email verification not yet', async () => {
      jest.spyOn(MockCodeService, 'checkVerified').mockResolvedValue(false);
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      await expect(authService.signUpEmailUser(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(MockCodeService.checkVerified).toHaveBeenCalledTimes(1);
      expect(MockCreateUserService.createEmailUser).toHaveBeenCalledTimes(0);
    });
  });
  describe('signUpInvitationUser', () => {
    it('positive case', async () => {
      jest
        .spyOn(MockCodeService, 'getDataByCodeAndType')
        .mockReturnValue({ roleId: faker.datatype.uuid() });

      const dto = new SignUpInvitationUserDto();

      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      dto.code = faker.datatype.string();

      await authService.signUpInvitationUser(dto);

      expect(MockCodeService.setCodeVerified).toHaveBeenCalledTimes(1);
      expect(MockCodeService.getDataByCodeAndType).toHaveBeenCalledTimes(1);
      expect(MockCreateUserService.createInvitationUser).toHaveBeenCalledTimes(
        1,
      );
    });

    it('invalid code', async () => {
      jest
        .spyOn(MockCodeService, 'setCodeVerified')
        .mockRejectedValue(new Error());
      jest
        .spyOn(MockCodeService, 'getDataByCodeAndType')
        .mockReturnValue({ roleId: faker.datatype.uuid() });

      const dto = new SignUpInvitationUserDto();

      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      dto.code = faker.datatype.string();

      await expect(authService.signUpInvitationUser(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(MockCodeService.setCodeVerified).toHaveBeenCalledTimes(1);
      expect(MockCodeService.getDataByCodeAndType).toHaveBeenCalledTimes(0);
      expect(MockCreateUserService.createInvitationUser).toHaveBeenCalledTimes(
        0,
      );
    });
    it('Invalid role id', async () => {
      const dto = new SignUpInvitationUserDto();

      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      dto.code = faker.datatype.string();

      await expect(authService.signUpInvitationUser(dto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(MockCodeService.setCodeVerified).toHaveBeenCalledTimes(1);
      expect(MockCodeService.getDataByCodeAndType).toHaveBeenCalledTimes(1);
      expect(MockCreateUserService.createInvitationUser).toHaveBeenCalledTimes(
        0,
      );
    });
  });
  describe('signIn', () => {
    it('positive case', async () => {
      const user = new UserEntity();
      user.state = UserStateEnum.Active;
      jest.spyOn(MockUserService, 'findById').mockResolvedValue(user);

      const dto = new UserDto();
      dto.email = faker.internet.email();
      dto.id = faker.datatype.uuid();
      dto.permissions = [];
      dto.roleName = faker.datatype.string();

      await authService.signIn(dto);

      expect(MockJwtService.sign).toHaveBeenCalledTimes(2);
    });
    it('blocked user', async () => {
      const user = new UserEntity();
      user.state = UserStateEnum.Blocked;
      jest.spyOn(MockUserService, 'findById').mockResolvedValue(user);

      const dto = new UserDto();
      dto.email = faker.internet.email();
      dto.id = faker.datatype.uuid();
      dto.permissions = [];
      dto.roleName = faker.datatype.string();

      await expect(authService.signIn(dto)).rejects.toThrow(
        UserBlockedException,
      );

      expect(MockJwtService.sign).toHaveBeenCalledTimes(0);
    });
  });
  describe('refreshToken', () => {
    it('positive case', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue(new JwtDto());

      const id = faker.datatype.uuid();
      await authService.refreshToken({ id });

      expect(MockUserService.findById).toHaveBeenCalledTimes(1);
      expect(MockUserService.findById).toHaveBeenCalledWith(id);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });
  });
});

const MockJwtService = {
  sign: jest.fn(),
};

const MockEmailVerificationMailingService = {
  send: jest.fn(),
};

const MockCodeService = {
  setCode: jest.fn(),
  setCodeVerified: jest.fn(),
  checkVerified: jest.fn(),
  getDataByCodeAndType: jest.fn(),
};

const MockUserService = {
  findByEmail: jest.fn(),
  findByAccount: jest.fn(),
  findById: jest.fn(),
};
const MockCreateUserService = {
  createEmailUser: jest.fn(),
  createInvitationUser: jest.fn(),
};
