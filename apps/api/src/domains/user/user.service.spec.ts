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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CodeService } from '@/shared/code/code.service';
import { UserInvitationMailingService } from '@/shared/mailing/user-invitation-mailing.service';
import {
  TestConfigs,
  clearEntities,
  getMockProvider,
  getRandomEnumValue,
} from '@/utils/test-utils';

import { OWNER_ROLE } from '../role/role.constant';
import { RoleEntity } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { FindAllUsersDto, UpdateUserRoleDto } from './dtos';
import { UserStateEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

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
        UserService,
        getMockProvider(RoleService, MockRoleService),
        getMockProvider(
          UserInvitationMailingService,
          MockUserInvitationMailingService,
        ),
        getMockProvider(CodeService, MockCodeService),
      ],
    }).compile();

    userService = module.get(UserService);

    dataSource = module.get(DataSource);
    userRepo = dataSource.getRepository(UserEntity);
    roleRepo = dataSource.getRepository(RoleEntity);
  });

  let userEntities: UserEntity[];
  let total: number;
  afterEach(async () => {
    await dataSource.destroy();
  });
  beforeEach(async () => {
    await clearEntities([userRepo, roleRepo]);
    const role = await roleRepo.save(OWNER_ROLE);

    total = faker.datatype.number({ min: 10, max: 20 });
    userEntities = await userRepo.save(
      Array.from({ length: total }).map(() => ({
        email: faker.internet.email(),
        state: UserStateEnum.Active,
        hashPassword: faker.internet.password(),
        role,
      })),
    );
  });

  describe('findAll', () => {
    it('', async () => {
      const dto = new FindAllUsersDto();
      dto.options = {
        limit: faker.datatype.number({ min: 10, max: 20 }),
        page: faker.datatype.number({ min: 1, max: 2 }),
      };

      const {
        meta: { currentPage, itemCount },
      } = await userService.findAll(dto);
      expect(currentPage).toEqual(dto.options.page);
      expect(itemCount).toBeLessThanOrEqual(+dto.options.limit);
    });
  });
  describe('findByEmail', () => {
    it('', async () => {
      const user: UserEntity = await userRepo.save({
        email: faker.internet.email(),
        state: getRandomEnumValue(UserStateEnum),
        hashPassword: faker.internet.password(),
      });
      const result = await userService.findByEmail(user.email);
      expect(result).toMatchObject(user);
    });
    it('not found user', async () => {
      const result = await userService.findByEmail(faker.internet.email());
      expect(result).toBeNull();
    });
  });
  describe('findById', () => {
    it('', async () => {
      const user = userEntities[faker.datatype.number(total - 1)];
      const result = await userService.findById(user.id);
      expect(result).toMatchObject(user);
    });
    it('not found user', async () => {
      await expect(userService.findById(faker.datatype.uuid())).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
  describe('deleteById', () => {
    it('', async () => {
      const user = userEntities[faker.datatype.number(total - 1)];

      await userService.deleteById(user.id);

      const deletedUser = await userRepo.findOneBy({ id: user.id });
      expect(deletedUser).toBeNull();
    });
  });

  describe('sendInvitationCode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('', async () => {
      await userService.sendInvitationCode({
        email: faker.internet.email(),
        roleId: faker.datatype.string(),
      });
      expect(MockCodeService.setCode).toBeCalledTimes(1);
      expect(MockUserInvitationMailingService.send).toBeCalledTimes(1);
    });
    it('already user exists', async () => {
      const user = userEntities[faker.datatype.number(total - 1)];

      await expect(
        userService.sendInvitationCode({
          email: user.email,
          roleId: faker.datatype.string(),
        }),
      ).rejects.toThrow(UserAlreadyExistsException);

      expect(MockCodeService.setCode).toBeCalledTimes(0);
      expect(MockUserInvitationMailingService.send).toBeCalledTimes(0);
    });
  });
  describe('updateUserRole', () => {
    let targetRole: RoleEntity;
    beforeEach(async () => {
      targetRole = await roleRepo.save({
        name: faker.datatype.string(),
        permissions: [],
      });
      jest.spyOn(MockRoleService, 'findById').mockResolvedValue(targetRole);
    });
    it('', async () => {
      const user = userEntities[faker.datatype.number(total - 1)];

      const dto = new UpdateUserRoleDto();
      dto.userId = user.id;
      dto.roleId = targetRole.id;

      await userService.updateUserRole(dto);

      const result = await userRepo.findOne({
        where: { id: user.id },
        relations: { role: true },
      });
      expect(result.role).toMatchObject(targetRole);
    });
  });
  describe('deleteUsers', () => {
    it('', async () => {
      const ids = userEntities
        .filter(() => faker.datatype.boolean())
        .map((v) => v.id);

      await userService.deleteUsers(ids);

      for (const id of ids) {
        const result = await userRepo.findOneBy({ id });
        expect(result).toBeNull();
      }
    });
  });
});

const MockRoleService = {
  findById: jest.fn(),
};
const MockUserInvitationMailingService = {
  send: jest.fn(),
};
const MockCodeService = {
  setCode: jest.fn(),
};
