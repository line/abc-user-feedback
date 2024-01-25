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
import type { Repository } from 'typeorm';

import { TestConfig } from '@/test-utils/util-functions';
import { CreateUserServiceProviders } from '../../../test-utils/providers/create-user.service.providers';
import { MemberEntity } from '../project/member/member.entity';
import { RoleEntity } from '../project/role/role.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { CreateUserService } from './create-user.service';
import type { CreateEmailUserDto, CreateInvitationUserDto } from './dtos';
import type { CreateOAuthUserDto } from './dtos/create-oauth-user.dto';
import { SignUpMethodEnum, UserTypeEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import {
  NotAllowedDomainException,
  NotAllowedUserCreateException,
  UserAlreadyExistsException,
} from './exceptions';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;

  let userRepo: Repository<UserEntity>;
  let tenantRepo: Repository<TenantEntity>;
  let memberRepo: Repository<MemberEntity>;
  let roleRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: CreateUserServiceProviders,
    }).compile();

    createUserService = module.get(CreateUserService);

    userRepo = module.get(getRepositoryToken(UserEntity));
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    memberRepo = module.get(getRepositoryToken(MemberEntity));
    roleRepo = module.get(getRepositoryToken(RoleEntity));
  });

  describe('createOAuthUser', () => {
    it('createing a user with OAuth succeeds with a valid email', async () => {
      const dto: CreateOAuthUserDto = {
        email: faker.internet.email(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          isRestrictDomain: false,
          allowDomains: [],
        },
      ] as TenantEntity[]);

      await createUserService.createOAuthUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(tenantRepo.find).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'oauth',
        hashPassword: '',
        signUpMethod: SignUpMethodEnum.OAUTH,
      });
    });
    it('createing a user with OAuth fails with an invalid email', async () => {
      const dto: CreateOAuthUserDto = {
        email: faker.internet.email(),
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue({} as UserEntity);

      await expect(createUserService.createOAuthUser(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
    });
  });
  describe('with a private and having restrictions on domain tenant', () => {
    beforeEach(() => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          isPrivate: true,
          isRestrictDomain: true,
          allowDomains: ['linecorp.com'],
        },
      ] as TenantEntity[]);
    });

    it('creating a user with an email fails', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await expect(createUserService.createEmailUser(dto)).rejects.toThrow(
        NotAllowedUserCreateException,
      );
    });
    it('creating a general user having no role by an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.GENERAL,
      });
    });
    it('creating a super user having no role by an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.SUPER,
      });
    });
    it('creating a general user by an invitation fails with an invalid domain email', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(0);
    });
    it('creating a super user by an invitation fails with an invalid domain email', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(0);
    });
    it('creating a general user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const userId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id: userId } as UserEntity);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: faker.number.int() },
      } as RoleEntity);
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.GENERAL,
        roleId: dto.roleId,
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
    it('creating a super user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const userId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id: userId } as UserEntity);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: faker.number.int() },
      } as RoleEntity);
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.SUPER,
        roleId: dto.roleId,
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
  });
  describe('with a private and no restrict on domain tenant', () => {
    beforeEach(() => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          isPrivate: true,
          isRestrictDomain: false,
        },
      ] as TenantEntity[]);
    });
    it('creating a user with an email fails', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await expect(createUserService.createEmailUser(dto)).rejects.toThrow(
        NotAllowedUserCreateException,
      );
    });
    it('creating a general user having no role with an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.GENERAL,
      });
    });
    it('creating a super user having no role with an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.SUPER,
      });
    });
    it('creating a general user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const userId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id: userId } as UserEntity);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: faker.number.int() },
      } as RoleEntity);
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.GENERAL,
        roleId: dto.roleId,
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
    it('creating a super user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const userId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id: userId } as UserEntity);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: faker.number.int() },
      } as RoleEntity);
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.SUPER,
        roleId: dto.roleId,
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
  });

  describe('with a non-private and having restrictions on domain tenant', () => {
    beforeEach(() => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([
        {
          isPrivate: false,
          isRestrictDomain: true,
          allowDomains: ['linecorp.com'],
        },
      ] as TenantEntity[]);
    });
    it('creating a user with an email succeeds with valid inputs', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
      };

      await createUserService.createEmailUser(dto);

      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'email',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
      });
    });
    it('creating a user with an email fails with an invalid domain email', async () => {
      const dto: CreateEmailUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
      };

      await expect(createUserService.createEmailUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );

      expect(userRepo.save).toHaveBeenCalledTimes(0);
    });
    it('creating a general user having no role by an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.GENERAL,
      });
    });
    it('creating a general user having no role by an invitation succeeds with valid inputs', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.SUPER,
      });
    });
    it('creating a general user by an invitation fails with an invalid domain email', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(0);
    });
    it('creating a super user by an invitation fails with an invalid domain email', async () => {
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@invalid.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);

      await expect(createUserService.createInvitationUser(dto)).rejects.toThrow(
        NotAllowedDomainException,
      );

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(0);
    });
    it('creating a general user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const userId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.GENERAL,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id: userId } as UserEntity);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: faker.number.int() },
      } as RoleEntity);
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.GENERAL,
        roleId: dto.roleId,
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
    it('creating a super user having a role by an invitation succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const userId = faker.number.int();
      const dto: CreateInvitationUserDto = {
        email: faker.internet.email().split('@')[0] + '@linecorp.com',
        password: faker.internet.password(),
        type: UserTypeEnum.SUPER,
        roleId,
      };
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null as UserEntity);
      jest
        .spyOn(userRepo, 'save')
        .mockResolvedValue({ id: userId } as UserEntity);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: faker.number.int() },
      } as RoleEntity);
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      await createUserService.createInvitationUser(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        email: dto.email,
        method: 'invitation',
        hashPassword: expect.any(String),
        signUpMethod: SignUpMethodEnum.EMAIL,
        type: UserTypeEnum.SUPER,
        roleId: dto.roleId,
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
  });
});
