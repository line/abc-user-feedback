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
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import type { Repository } from 'typeorm';

import { CodeEntity } from '@/shared/code/code.entity';
import { NotVerifiedEmailException } from '@/shared/mailing/exceptions';

import {
  emailFixture,
  passwordFixture,
  userFixture,
} from '@/test-utils/fixtures';
import type {
  CodeRepositoryStub,
  TenantRepositoryStub,
} from '@/test-utils/stubs';
import { TestConfig } from '@/test-utils/util-functions';
import {
  AuthServiceProviders,
  MockEmailVerificationMailingService,
  MockJwtService,
} from '../../../test-utils/providers/auth.service.providers';
import { ApiKeyEntity } from '../project/api-key/api-key.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { UserDto } from '../user/dtos';
import {
  SignUpMethodEnum,
  UserStateEnum,
  UserTypeEnum,
} from '../user/entities/enums';
import { UserEntity } from '../user/entities/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../user/exceptions';
import { AuthService } from './auth.service';
import {
  SendEmailCodeDto,
  SignUpEmailUserDto,
  SignUpInvitationUserDto,
  SignUpOauthUserDto,
  ValidateEmailUserDto,
  VerifyEmailCodeDto,
} from './dtos';
import { PasswordNotMatchException, UserBlockedException } from './exceptions';

describe('auth service ', () => {
  let authService: AuthService;
  let userRepo: Repository<UserEntity>;
  let tenantRepo: TenantRepositoryStub;
  let codeRepo: CodeRepositoryStub;
  let apiKeyRepo: Repository<ApiKeyEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig, ClsModule.forRoot()],
      providers: AuthServiceProviders,
    }).compile();
    authService = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    codeRepo = module.get(getRepositoryToken(CodeEntity));
    apiKeyRepo = module.get(getRepositoryToken(ApiKeyEntity));
  });

  describe('sendEmailCode', () => {
    let dto: SendEmailCodeDto;
    beforeEach(() => {
      dto = new SendEmailCodeDto();
    });

    it('sending a code by email succeeds with a valid email', async () => {
      const validEmail = faker.internet.email();
      dto.email = validEmail;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(MockEmailVerificationMailingService, 'send');

      const timeoutTime = await authService.sendEmailCode(dto);

      expect(new Date(timeoutTime) > new Date()).toEqual(true);
      expect(MockEmailVerificationMailingService.send).toHaveBeenCalledTimes(1);
    });
    it('sending a code by email succeeds with a duplicate email', async () => {
      const duplicateEmail = emailFixture;
      dto.email = duplicateEmail;
      jest.spyOn(MockEmailVerificationMailingService, 'send');

      await expect(authService.sendEmailCode(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );

      expect(MockEmailVerificationMailingService.send).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmailCode', () => {
    it('verifying email code succeeds in test environment', async () => {
      const dto = new VerifyEmailCodeDto();
      dto.code = faker.string.alphanumeric(6);
      dto.email = faker.internet.email();

      // In test environment, this method returns undefined
      const result = await authService.verifyEmailCode(dto);

      expect(result).toBeUndefined();
    });
  });

  describe('validateEmailUser', () => {
    it('validating a user succeeds with valid inputs', async () => {
      const dto = new ValidateEmailUserDto();
      dto.email = emailFixture;
      dto.password = passwordFixture;

      const result = await authService.validateEmailUser(dto);

      expect(result).toEqual({
        ...userFixture,
        signUpMethod: SignUpMethodEnum.EMAIL,
      });
    });
    it('validating a user fails with a nonexistent user', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = passwordFixture;

      await expect(authService.validateEmailUser(dto)).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('validating a user fails with an invalid password', async () => {
      const invalidPassword = faker.internet.password();
      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = invalidPassword;

      await expect(authService.validateEmailUser(dto)).rejects.toThrow(
        PasswordNotMatchException,
      );
    });
  });

  describe('signUpEmailUser', () => {
    it('signing up by an email succeeds with valid inputs', async () => {
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      codeRepo.setIsVerified(true);
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await authService.signUpEmailUser(dto);

      expect(user.signUpMethod).toEqual(SignUpMethodEnum.EMAIL);
    });
    it('signing up by an email fails with a not verified email', async () => {
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      codeRepo.setIsVerified(false);
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepo, 'save');

      await expect(authService.signUpEmailUser(dto)).rejects.toThrow(
        NotVerifiedEmailException,
      );

      expect(userRepo.save).not.toHaveBeenCalled();
    });
    it('signing up by an email fails with a not verification requested email', async () => {
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      codeRepo.setNull();
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepo, 'save');

      await expect(authService.signUpEmailUser(dto)).rejects.toThrow(
        new BadRequestException('must request email verification'),
      );

      expect(userRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('signUpInvitationUser', () => {
    it('signing up by invitation succeeds with valid inputs', async () => {
      const dto = new SignUpInvitationUserDto();
      dto.code = codeRepo.entities?.[0]?.code ?? faker.string.alphanumeric(8);
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      codeRepo.setIsVerified(false); // Not verified initially
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      // Mock the codeService.getDataByCodeAndType to return valid data

      jest
        .spyOn(authService.codeService, 'getDataByCodeAndType')
        .mockResolvedValue({
          userType: UserTypeEnum.GENERAL,
          roleId: faker.number.int(),
          invitedBy: new UserDto(),
        } as any);

      // Mock the createUserService to avoid complex dependencies
      const mockUser = new UserEntity();
      mockUser.signUpMethod = SignUpMethodEnum.EMAIL;
      mockUser.email = faker.internet.email();

      jest
        .spyOn(authService.createUserService, 'createInvitationUser')
        .mockResolvedValue(mockUser);

      const user = await authService.signUpInvitationUser(dto);

      expect(user.signUpMethod).toEqual(SignUpMethodEnum.EMAIL);
    });

    it('signing up by invitation fails with invalid invitation code', async () => {
      const dto = new SignUpInvitationUserDto();
      dto.code = 'invalid-code';
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      codeRepo.setNull();

      await expect(authService.signUpInvitationUser(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('signing up by invitation fails with already verified code', async () => {
      const dto = new SignUpInvitationUserDto();
      dto.code = faker.string.alphanumeric(8);
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      codeRepo.setIsVerified(true); // Already verified

      await expect(authService.signUpInvitationUser(dto)).rejects.toThrow(
        new BadRequestException('already verified'),
      );
    });
  });

  describe('signUpOAuthUser', () => {
    it('signing up by OAuth succeeds with valid inputs', async () => {
      const dto = new SignUpOauthUserDto();
      dto.email = faker.internet.email();
      dto.projectName = faker.company.name();
      dto.roleName = faker.person.jobTitle();
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepo, 'save').mockResolvedValue(new UserEntity());

      await authService.signUpOAuthUser(dto);

      expect(userRepo.save).toHaveBeenCalled();
    });

    it('signing up by OAuth fails with existing user', async () => {
      const dto = new SignUpOauthUserDto();
      dto.email = emailFixture;
      dto.projectName = faker.company.name();
      dto.roleName = faker.person.jobTitle();

      await expect(authService.signUpOAuthUser(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });

    it('signing up by OAuth succeeds with empty project and role', async () => {
      const dto = new SignUpOauthUserDto();
      dto.email = faker.internet.email();
      dto.projectName = '';
      dto.roleName = '';
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const result = await authService.signUpOAuthUser(dto);

      expect(result).toBeUndefined();
    });
  });

  describe('signIn', () => {
    it('signing in succeeds with a valid user', async () => {
      const activeUser = new UserEntity();
      activeUser.state = UserStateEnum.Active;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(activeUser);
      const dto = new UserDto();
      dto.email = faker.internet.email();
      dto.id = faker.number.int();

      const jwt = await authService.signIn(dto);

      expect(jwt).toHaveProperty('accessToken');
      expect(jwt).toHaveProperty('refreshToken');
    });
    it('signing in fails with a blocked user', async () => {
      const blockedUser = new UserEntity();
      blockedUser.state = UserStateEnum.Blocked;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(blockedUser);
      const dto = new UserDto();
      dto.email = faker.internet.email();
      dto.id = faker.number.int();

      await expect(authService.signIn(dto)).rejects.toThrow(
        UserBlockedException,
      );

      expect(MockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('refreshing token succeeds with valid user', async () => {
      const activeUser = new UserEntity();
      activeUser.state = UserStateEnum.Active;
      activeUser.id = faker.number.int();
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(activeUser);

      const jwt = await authService.refreshToken({ id: activeUser.id });

      expect(jwt).toHaveProperty('accessToken');
      expect(jwt).toHaveProperty('refreshToken');
      expect(MockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('refreshing token fails with blocked user', async () => {
      const blockedUser = new UserEntity();
      blockedUser.state = UserStateEnum.Blocked;
      blockedUser.id = faker.number.int();
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(blockedUser);

      await expect(
        authService.refreshToken({ id: blockedUser.id }),
      ).rejects.toThrow(UserBlockedException);

      expect(MockJwtService.sign).not.toHaveBeenCalled();
    });

    it('refreshing token fails with non-existent user', async () => {
      const userId = faker.number.int();
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(authService.refreshToken({ id: userId })).rejects.toThrow(
        UserNotFoundException,
      );

      expect(MockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('validateApiKey', () => {
    it('validating an api key succeeds with a valid api key', async () => {
      const apiKey = faker.string.uuid();
      const projectId = faker.number.int();

      const result = await authService.validateApiKey(apiKey, projectId);

      expect(result).toEqual(true);
    });
    it('validating an api key succeeds with an invalid api key', async () => {
      const apiKey = faker.string.uuid();
      const projectId = faker.number.int();
      jest.spyOn(apiKeyRepo, 'find').mockResolvedValue([] as ApiKeyEntity[]);

      const result = await authService.validateApiKey(apiKey, projectId);

      expect(result).toEqual(false);
    });
  });

  describe('getOAuthLoginURL', () => {
    it('getting an oauth login url succeeds with oauth using tenant', async () => {
      const clientId = faker.string.sample();
      const scopeString = faker.string.sample();
      const authCodeRequestURL = faker.internet.domainName();
      tenantRepo.setUseOAuth(true, {
        clientId,
        scopeString,
        authCodeRequestURL,
      });

      const OAuthLoginURL = await authService.getOAuthLoginURL();

      expect(OAuthLoginURL.includes(authCodeRequestURL));
      expect(OAuthLoginURL.includes(`client_id=${clientId}`));
      expect(OAuthLoginURL.includes(`scope=${scopeString}`));
    });
    it('getting an oauth login url fails with no oauth using tenant', async () => {
      tenantRepo.setUseOAuth(false, null);

      await expect(authService.getOAuthLoginURL()).rejects.toThrow(
        new BadRequestException('OAuth login is disabled.'),
      );
    });
    it('getting an oauth login url fails with no oauthconfig tenant', async () => {
      tenantRepo.setUseOAuth(true, null);

      await expect(authService.getOAuthLoginURL()).rejects.toThrow(
        new BadRequestException('OAuth Config is required.'),
      );
    });
  });

  describe('signInByOAuth', () => {
    it('signing in by OAuth fails when OAuth is disabled', async () => {
      const code = faker.string.alphanumeric(32);
      tenantRepo.setUseOAuth(false, null);

      await expect(authService.signInByOAuth(code)).rejects.toThrow(
        new BadRequestException('OAuth login is disabled.'),
      );
    });

    it('signing in by OAuth fails with no OAuth config', async () => {
      const code = faker.string.alphanumeric(32);
      tenantRepo.setUseOAuth(true, null);

      await expect(authService.signInByOAuth(code)).rejects.toThrow(
        new BadRequestException('OAuth Config is required.'),
      );
    });
  });
});
