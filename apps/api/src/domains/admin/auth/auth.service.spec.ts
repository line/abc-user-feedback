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
import { BadRequestException } from '@nestjs/common';
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
import { SignUpMethodEnum, UserStateEnum } from '../user/entities/enums';
import { UserEntity } from '../user/entities/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../user/exceptions';
import { AuthService } from './auth.service';
import {
  SendEmailCodeDto,
  SignUpEmailUserDto,
  ValidateEmailUserDto,
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
    return;
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
    return;
  });

  describe('signUpOAuthUser', () => {
    return;
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
    return;
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
    return;
  });
});
