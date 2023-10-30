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
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Repository } from 'typeorm';

import { CodeEntity } from '@/shared/code/code.entity';
import { NotVerifiedEmailException } from '@/shared/mailing/exceptions';
import { TestConfig } from '@/test-utils/util-functions';
import {
  AuthServiceProviders,
  MockEmailVerificationMailingService,
  MockJwtService,
} from '../../test-utils/providers/auth.service.providers';
import { ApiKeyEntity } from '../project/api-key/api-key.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { UserDto } from '../user/dtos';
import { UserStateEnum } from '../user/entities/enums';
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
  let tenantRepo: Repository<TenantEntity>;
  let codeRepo: Repository<CodeEntity>;
  let apiKeyRepo: Repository<ApiKeyEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
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
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null as UserEntity);
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          isRestrictDomain: false,
        },
      ] as TenantEntity[]);
      jest.spyOn(codeRepo, 'findOneBy').mockResolvedValue({} as CodeEntity);
      jest.spyOn(codeRepo, 'save').mockResolvedValue({} as CodeEntity);
      jest.spyOn(MockEmailVerificationMailingService, 'send');

      await authService.sendEmailCode(dto);

      expect(userRepo.findOne).toBeCalledTimes(1);
      expect(codeRepo.findOneBy).toBeCalledTimes(1);
      expect(codeRepo.save).toBeCalledTimes(1);
      expect(MockEmailVerificationMailingService.send).toBeCalledTimes(1);
    });
    it('sending a code by email succeeds with a duplicate email', async () => {
      const duplicateEmail = faker.internet.email();
      dto.email = duplicateEmail;
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ email: duplicateEmail } as UserEntity);
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          isRestrictDomain: false,
        },
      ] as TenantEntity[]);
      jest.spyOn(codeRepo, 'findOneBy').mockResolvedValue({} as CodeEntity);
      jest.spyOn(codeRepo, 'save').mockResolvedValue({} as CodeEntity);
      jest.spyOn(MockEmailVerificationMailingService, 'send');

      await expect(authService.sendEmailCode(dto)).rejects.toThrowError(
        UserAlreadyExistsException,
      );

      expect(userRepo.findOne).toBeCalledTimes(1);
      expect(codeRepo.findOneBy).not.toBeCalled();
      expect(codeRepo.save).not.toBeCalled();
      expect(MockEmailVerificationMailingService.send).not.toBeCalled();
    });
  });

  describe('verifyEmailCode', () => {});

  describe('validateEmailUser', () => {
    it('validating a user succeeds with valid inputs', async () => {
      const password = faker.internet.password();
      const hashedPassword = bcrypt.hashSync(password, 0);
      const userEntity = new UserEntity();
      userEntity.hashPassword = hashedPassword;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(userEntity);
      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = password;

      const result = await authService.validateEmailUser(dto);

      expect(userRepo.findOne).toBeCalledTimes(1);
      expect(result).toEqual(userEntity);
    });
    it('validating a user fails with a nonexistent user', async () => {
      const password = faker.internet.password();
      const hashedPassword = bcrypt.hashSync(password, 0);
      const userEntity = new UserEntity();
      userEntity.hashPassword = hashedPassword;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null as UserEntity);
      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = password;

      await expect(authService.validateEmailUser(dto)).rejects.toThrowError(
        UserNotFoundException,
      );

      expect(userRepo.findOne).toBeCalledTimes(1);
    });
    it('validating a user fails with an invalid password', async () => {
      const invalidPassword = faker.internet.password();
      const hashedPassword = bcrypt.hashSync(faker.internet.password(), 0);
      const userEntity = new UserEntity();
      userEntity.hashPassword = hashedPassword;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(userEntity);
      const dto = new ValidateEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = invalidPassword;

      await expect(authService.validateEmailUser(dto)).rejects.toThrowError(
        PasswordNotMatchException,
      );

      expect(userRepo.findOne).toBeCalledTimes(1);
    });
  });

  describe('signUpEmailUser', () => {
    it('signing up by an email succeeds with valid inputs', async () => {
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      jest
        .spyOn(codeRepo, 'findOneBy')
        .mockResolvedValue({ isVerified: true } as CodeEntity);
      jest
        .spyOn(tenantRepo, 'find')
        .mockResolvedValue([
          { isPrivate: false, isRestrictDomain: false },
        ] as TenantEntity[]);
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest.spyOn(userRepo, 'save');

      await authService.signUpEmailUser(dto);

      expect(codeRepo.findOneBy).toBeCalledTimes(1);
      expect(tenantRepo.find).toBeCalledTimes(2);
      expect(userRepo.findOneBy).toBeCalledTimes(1);
      expect(userRepo.save).toBeCalledTimes(1);
    });
    it('signing up by an email fails with a not verified email', async () => {
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      jest
        .spyOn(codeRepo, 'findOneBy')
        .mockResolvedValue({ isVerified: false } as CodeEntity);
      jest
        .spyOn(tenantRepo, 'find')
        .mockResolvedValue([
          { isPrivate: false, isRestrictDomain: false },
        ] as TenantEntity[]);
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest.spyOn(userRepo, 'save');

      await expect(authService.signUpEmailUser(dto)).rejects.toThrowError(
        NotVerifiedEmailException,
      );

      expect(codeRepo.findOneBy).toBeCalledTimes(1);
      expect(tenantRepo.find).not.toBeCalled();
      expect(userRepo.findOneBy).not.toBeCalled();
      expect(userRepo.save).not.toBeCalled();
    });
    it('signing up by an email fails with a not verification requested email', async () => {
      const dto = new SignUpEmailUserDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      jest.spyOn(codeRepo, 'findOneBy').mockResolvedValue(null as CodeEntity);
      jest
        .spyOn(tenantRepo, 'find')
        .mockResolvedValue([
          { isPrivate: false, isRestrictDomain: false },
        ] as TenantEntity[]);
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest.spyOn(userRepo, 'save');

      await expect(authService.signUpEmailUser(dto)).rejects.toThrowError(
        new BadRequestException('must request email verification'),
      );

      expect(codeRepo.findOneBy).toBeCalledTimes(1);
      expect(tenantRepo.find).not.toBeCalled();
      expect(userRepo.findOneBy).not.toBeCalled();
      expect(userRepo.save).not.toBeCalled();
    });
  });

  describe('signUpInvitationUser', () => {});

  describe('signUpOAuthUser', () => {});

  describe('signIn', () => {
    it('signing in succeeds with a valid user', async () => {
      const user = new UserEntity();
      user.state = UserStateEnum.Active;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
      const dto = new UserDto();
      dto.email = faker.internet.email();
      dto.id = faker.number.int();

      await authService.signIn(dto);

      expect(MockJwtService.sign).toBeCalledTimes(2);
    });
    it('signing in fails with a blocked user', async () => {
      const user = new UserEntity();
      user.state = UserStateEnum.Blocked;
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
      const dto = new UserDto();
      dto.email = faker.internet.email();
      dto.id = faker.number.int();

      await expect(authService.signIn(dto)).rejects.toThrow(
        UserBlockedException,
      );

      expect(MockJwtService.sign).not.toBeCalled();
    });
  });

  describe('refreshToken', () => {});

  describe('validateApiKey', () => {
    it('validating an api key succeeds with a valid api key', async () => {
      const apiKey = faker.string.uuid();
      const projectId = faker.number.int();
      jest.spyOn(apiKeyRepo, 'find').mockResolvedValue([{}] as ApiKeyEntity[]);

      const result = await authService.validateApiKey(apiKey, projectId);

      expect(apiKeyRepo.find).toBeCalledTimes(1);
      expect(result).toEqual(true);
    });
    it('validating an api key succeeds with an invalid api key', async () => {
      const apiKey = faker.string.uuid();
      const projectId = faker.number.int();
      jest.spyOn(apiKeyRepo, 'find').mockResolvedValue([] as ApiKeyEntity[]);

      const result = await authService.validateApiKey(apiKey, projectId);

      expect(apiKeyRepo.find).toBeCalledTimes(1);
      expect(result).toEqual(false);
    });
  });

  describe('getOAuthLoginURL', () => {
    it('getting an oauth login url succeeds with oauth using tenant', async () => {
      const clientId = faker.string.sample();
      const scopeString = faker.string.sample();
      const authCodeRequestURL = faker.internet.domainName();
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          useOAuth: true,
          oauthConfig: {
            clientId,
            scopeString,
            authCodeRequestURL,
          },
        },
      ] as TenantEntity[]);

      const OAuthLoginURL = await authService.getOAuthLoginURL();

      expect(tenantRepo.find).toBeCalledTimes(1);
      expect(OAuthLoginURL.includes(authCodeRequestURL));
      expect(OAuthLoginURL.includes(`client_id=${clientId}`));
      expect(OAuthLoginURL.includes(`scope=${scopeString}`));
    });
    it('getting an oauth login url fails with no oauth using tenant', async () => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          useOAuth: false,
        },
      ] as TenantEntity[]);

      await expect(authService.getOAuthLoginURL()).rejects.toThrowError(
        new BadRequestException('OAuth login is disabled.'),
      );

      expect(tenantRepo.find).toBeCalledTimes(1);
    });
    it('getting an oauth login url fails with no oauthconfig tenant', async () => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          useOAuth: true,
        },
      ] as TenantEntity[]);

      await expect(authService.getOAuthLoginURL()).rejects.toThrowError(
        new BadRequestException('OAuth Config is required.'),
      );

      expect(tenantRepo.find).toBeCalledTimes(1);
    });
  });

  describe('signInByOAuth', () => {});
});
