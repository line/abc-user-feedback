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
import { ClsModule } from 'nestjs-cls';
import type { Repository } from 'typeorm';

import type { TenantRepositoryStub } from '@/test-utils/stubs';
import { TestConfig } from '@/test-utils/util-functions';
import { CreateUserServiceProviders } from '../../../test-utils/providers/create-user.service.providers';
import { MemberEntity } from '../project/member/member.entity';
import { MemberService } from '../project/member/member.service';
import { TenantEntity } from '../tenant/tenant.entity';
import { CreateUserService } from './create-user.service';
import type { CreateEmailUserDto, CreateInvitationUserDto } from './dtos';
import type { CreateOAuthUserDto } from './dtos/create-oauth-user.dto';
import { SignUpMethodEnum, UserTypeEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import {
  NotAllowedDomainException,
  UserAlreadyExistsException,
} from './exceptions';
import { UserPasswordService } from './user-password.service';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;

  let userRepo: Repository<UserEntity>;
  let tenantRepo: TenantRepositoryStub;
  let memberRepo: Repository<MemberEntity>;
  let memberService: MemberService;
  let userPasswordService: UserPasswordService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig, ClsModule.forRoot()],
      providers: CreateUserServiceProviders,
    }).compile();

    createUserService = module.get(CreateUserService);

    userRepo = module.get(getRepositoryToken(UserEntity));
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    memberRepo = module.get(getRepositoryToken(MemberEntity));
    memberService = module.get(MemberService);
    userPasswordService = module.get(UserPasswordService);
  });

  describe('createOAuthUser', () => {
    it('creating a user with OAuth succeeds with a valid email', async () => {
      const dto: CreateOAuthUserDto = {
        email: faker.internet.email(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createOAuthUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe('OAUTH');
    });
    it('creating a user with OAuth fails when user already exists', async () => {
      const dto: CreateOAuthUserDto = {
        email: faker.internet.email(),
      };
      const existingUser = {
        id: faker.number.int(),
        email: dto.email,
      } as UserEntity;
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(existingUser);

      await expect(createUserService.createOAuthUser(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });
  });

  describe('createInvitationUser', () => {
    beforeEach(() => {
      tenantRepo.setAllowDomains(['linecorp.com']);
    });

    it('creating a general user having no role by an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createInvitationUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
    });

    it('creating a super user having no role by an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createInvitationUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.SUPER);
    });

    it('creating a general user by an invitation fails with an invalid domain email', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );
    });

    it('creating a super user by an invitation fails with an invalid domain email', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );
    });

    it('creating a general user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'save');

      const user = await createUserService.createInvitationUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
    });

    it('creating a super user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'save');

      const user = await createUserService.createInvitationUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.SUPER);
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
    });

    it('creating a user by invitation fails when user already exists', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      const existingUser = {
        id: faker.number.int(),
        email: dto.email,
      } as UserEntity;
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(existingUser);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });

    it('creating a user by invitation succeeds when allowDomains is empty', async () => {
      tenantRepo.setAllowDomains([]);
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@anydomain.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createInvitationUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
    });

    it('creating a user by invitation succeeds when allowDomains is null', async () => {
      tenantRepo.setAllowDomains(undefined);
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@anydomain.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createInvitationUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
    });

    it('creating a user by invitation fails when memberService.create throws error', async () => {
      const roleId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(memberService, 'create')
        .mockRejectedValue(new Error('Member creation failed'));

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        'Member creation failed',
      );
    });

    it('creating a user by invitation fails when userPasswordService.createHashPassword throws error', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(userPasswordService, 'createHashPassword')
        .mockRejectedValue(new Error('Password hashing failed'));

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        'Password hashing failed',
      );
    });
  });

  describe('createEmailUser', () => {
    beforeEach(() => {
      tenantRepo.setAllowDomains(['linecorp.com']);
    });

    it('creating a user with an email succeeds with valid inputs', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createEmailUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
    });

    it('creating a user with an email fails with an invalid domain email', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      await expect(createUserService.createEmailUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );
    });

    it('creating a user with email fails when user already exists', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
      };
      const existingUser = {
        id: faker.number.int(),
        email: dto.email,
      } as UserEntity;
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(existingUser);

      await expect(createUserService.createEmailUser(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });

    it('creating a user with email succeeds when allowDomains is empty', async () => {
      tenantRepo.setAllowDomains([]);
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@anydomain.com',
        password: faker.internet.password(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createEmailUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
    });

    it('creating a user with email succeeds when allowDomains is null', async () => {
      tenantRepo.setAllowDomains(undefined);
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@anydomain.com',
        password: faker.internet.password(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);

      const user = await createUserService.createEmailUser(dto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(dto.email);
      expect(user.signUpMethod).toBe(SignUpMethodEnum.EMAIL);
      expect(user.type).toBe(UserTypeEnum.GENERAL);
    });

    it('creating a user with email fails when userPasswordService.createHashPassword throws error', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(userPasswordService, 'createHashPassword')
        .mockRejectedValue(new Error('Password hashing failed'));

      await expect(createUserService.createEmailUser(dto)).rejects.toThrow(
        'Password hashing failed',
      );
    });
  });
});
