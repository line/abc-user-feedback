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
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  TestConfigs,
  clearEntities,
  getMockProvider,
} from '@/utils/test-utils';

import {
  GUEST_ROLE,
  OWNER_ROLE,
  OWNER_ROLE_DEFAULT_ID,
} from '../role/role.constant';
import { RoleEntity } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { TenantService } from '../tenant/tenant.service';
import { CreateUserService } from './create-user.service';
import { CreateEmailUserDto, CreateInvitationUserDto } from './dtos';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  NotAllowDomainException,
  NotAllowUserCreateException,
} from './exceptions';
import { UserPasswordService } from './user-password.service';

describe('create user service', () => {
  let createUserServiceWrapper: CreateUserServiceWrapper;
  let createUserService: CreateUserService;

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
        getMockProvider(UserPasswordService, MockUserPasswordService),
        getMockProvider(TenantService, MockTenantService),
        getMockProvider(RoleService, MockRoleService),
        CreateUserService,
        CreateUserServiceWrapper,
      ],
    }).compile();

    createUserService = module.get(CreateUserService);
    createUserServiceWrapper = module.get(CreateUserServiceWrapper);

    dataSource = module.get(DataSource);
    userRepo = dataSource.getRepository(UserEntity);
    roleRepo = dataSource.getRepository(RoleEntity);
  });
  it('to be defined', () => {
    expect(createUserService).toBeDefined();
  });

  beforeEach(async () => {
    await clearEntities([userRepo, roleRepo]);
    await roleRepo.save(OWNER_ROLE);
    await roleRepo.save(GUEST_ROLE);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('createUser', () => {
    describe('not private, not restrict domain', () => {
      beforeEach(() => {
        setTenant(false, false);
      });
      it('email', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email(),
          hashPassword: faker.internet.password(),
          type: 'email',
        };

        const user = await createUserServiceWrapper.createUserWrapper(dto);

        expect(user.email).toEqual(dto.email);
      });

      it('invitation', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email(),
          hashPassword: faker.internet.password(),
          type: 'invitation',
          roleId: OWNER_ROLE_DEFAULT_ID,
        };

        const user = await createUserServiceWrapper.createUserWrapper(dto);

        expect(user.email).toEqual(dto.email);
      });
    });
    describe('private, not restrict domain', () => {
      beforeEach(() => {
        setTenant(true, false);
      });
      it('email', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email(),
          hashPassword: faker.internet.password(),
          type: 'email',
        };

        await expect(
          createUserServiceWrapper.createUserWrapper(dto),
        ).rejects.toThrow(NotAllowUserCreateException);
      });

      it('invitation', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email(),
          hashPassword: faker.internet.password(),
          type: 'invitation',
          roleId: OWNER_ROLE_DEFAULT_ID,
        };

        const user = await createUserServiceWrapper.createUserWrapper(dto);

        expect(user.email).toEqual(dto.email);
      });
    });
    describe('not private, restrict domain', () => {
      beforeEach(() => {
        setTenant(false, true);
      });
      it('email', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email('a', 'b', 'gmail.com'),
          hashPassword: faker.internet.password(),
          type: 'email',
        };

        const user = await createUserServiceWrapper.createUserWrapper(dto);

        expect(user.email).toEqual(dto.email);

        dto.email = faker.internet.email('a', 'b', 'gmail.co');
        await expect(
          createUserServiceWrapper.createUserWrapper(dto),
        ).rejects.toThrow(NotAllowDomainException);
      });

      it('invitation', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email('a', 'b', 'gmail.com'),
          hashPassword: faker.internet.password(),
          type: 'invitation',
          roleId: OWNER_ROLE_DEFAULT_ID,
        };

        const user = await createUserServiceWrapper.createUserWrapper(dto);
        expect(user.email).toEqual(dto.email);

        dto.email = faker.internet.email('a', 'b', 'gmail.co');
        await expect(
          createUserServiceWrapper.createUserWrapper(dto),
        ).rejects.toThrow(NotAllowDomainException);
      });
    });

    describe('private, restrict domain', () => {
      beforeEach(() => {
        setTenant(true, true);
      });
      it('email', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email(),
          hashPassword: faker.internet.password(),
          type: 'email',
        };

        await expect(
          createUserServiceWrapper.createUserWrapper(dto),
        ).rejects.toThrow(NotAllowUserCreateException);
      });

      it('invitation', async () => {
        const dto: CreateUserDto = {
          email: faker.internet.email('a', 'b', 'gmail.com'),
          hashPassword: faker.internet.password(),
          type: 'invitation',
          roleId: OWNER_ROLE_DEFAULT_ID,
        };

        const user = await createUserServiceWrapper.createUserWrapper(dto);
        expect(user.email).toEqual(dto.email);

        dto.email = faker.internet.email('a', 'b', 'gmail.co');
        await expect(
          createUserServiceWrapper.createUserWrapper(dto),
        ).rejects.toThrow(NotAllowDomainException);
      });
    });
  });

  it('createEmailUser', async () => {
    jest
      .spyOn(createUserService as any, 'createUser')
      .mockImplementation(jest.fn());

    const dto = new CreateEmailUserDto();

    await createUserService.createEmailUser(dto);

    expect((createUserService as any).createUser).toHaveBeenCalledTimes(1);
    expect(MockUserPasswordService.createHashPassword).toHaveBeenCalledTimes(1);
  });

  it('createInvitationUser', async () => {
    jest
      .spyOn(createUserService as any, 'createUser')
      .mockImplementation(jest.fn());

    const dto = new CreateInvitationUserDto();

    await createUserService.createInvitationUser(dto);

    expect((createUserService as any).createUser).toHaveBeenCalledTimes(1);
    expect(MockUserPasswordService.createHashPassword).toHaveBeenCalledTimes(1);
  });
});

const MockUserPasswordService = {
  createHashPassword: jest.fn().mockReturnValue(faker.datatype.string()),
};

const MockTenantService = {
  findOne: jest.fn(),
};

const MockRoleService = {
  findById: jest.fn(),
};

const setTenant = (isPrivate: boolean, isRestrictDomain: boolean) => {
  jest.spyOn(MockTenantService, 'findOne').mockResolvedValue({
    isPrivate,
    isRestrictDomain,
    allowDomains: isRestrictDomain ? ['gmail.com'] : [],
    defaultRole: OWNER_ROLE,
  });
};
// isPrivate: boolean;
// isRestrictDomain: boolean;
// allowDomains: Array<string>;

@Injectable()
class CreateUserServiceWrapper extends CreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepo: Repository<UserEntity>,
    readonly userPasswordService: UserPasswordService,
    readonly tenantService: TenantService,
    readonly roleService: RoleService,
  ) {
    super(userRepo, userPasswordService, tenantService, roleService);
  }
  createUserWrapper(dto: CreateUserDto) {
    return this.createUser(dto);
  }
}
