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
import type { Repository } from 'typeorm';

import { QueryV2ConditionsEnum, SortMethodEnum } from '@/common/enums';
import {
  createQueryBuilder,
  getRandomEnumValue,
  TestConfig,
} from '@/test-utils/util-functions';
import {
  MockUserInvitationMailingService,
  UserServiceProviders,
} from '../../../test-utils/providers/user.service.providers';
import { FindAllUsersDto, UserDto } from './dtos';
import type { UpdateUserDto } from './dtos/update-user.dto';
import { SignUpMethodEnum, UserTypeEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';
import { UserService } from './user.service';

const MockCodeService = {
  setCode: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: UserServiceProviders,
    }).compile();

    userService = module.get(UserService);
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  describe('findAll', () => {
    it('finding succeeds with valid inputs', async () => {
      const dto = new FindAllUsersDto();
      dto.options = {
        limit: faker.number.int({ min: 10, max: 20 }),
        page: faker.number.int({ min: 1, max: 2 }),
      };
      dto.order = {
        createdAt: SortMethodEnum.DESC,
      };
      dto.queries = [
        {
          key: 'projectId',
          value: [faker.number.int()],
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
        {
          key: 'email',
          value: faker.internet.email(),
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];
      jest.spyOn(userRepo, 'createQueryBuilder');
      jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const {
        meta: { currentPage, itemCount },
      } = await userService.findAll(dto);

      expect(currentPage).toEqual(dto.options.page);
      expect(itemCount).toBeLessThanOrEqual(+dto.options.limit);
    });

    it('finding succeeds with type filter', async () => {
      const dto = new FindAllUsersDto();
      dto.options = { limit: 10, page: 1 };
      dto.queries = [
        {
          key: 'type',
          value: [getRandomEnumValue(UserTypeEnum)],
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };
      jest
        .spyOn(userRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await userService.findAll(dto);

      expect(result.meta.totalItems).toBe(0);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledTimes(3);
    });

    it('finding succeeds with name filter using IS condition', async () => {
      const dto = new FindAllUsersDto();
      dto.options = { limit: 10, page: 1 };
      dto.queries = [
        {
          key: 'name',
          value: faker.person.fullName(),
          condition: QueryV2ConditionsEnum.IS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };
      jest
        .spyOn(userRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await userService.findAll(dto);

      expect(result.meta.totalItems).toBe(0);
    });

    it('finding succeeds with department filter', async () => {
      const dto = new FindAllUsersDto();
      dto.options = { limit: 10, page: 1 };
      dto.queries = [
        {
          key: 'department',
          value: faker.company.name(),
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };
      jest
        .spyOn(userRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await userService.findAll(dto);

      expect(result.meta.totalItems).toBe(0);
    });

    it('finding succeeds with OR operator', async () => {
      const dto = new FindAllUsersDto();
      dto.options = { limit: 10, page: 1 };
      dto.operator = 'OR';
      dto.queries = [
        {
          key: 'email',
          value: faker.internet.email(),
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
        {
          key: 'name',
          value: faker.person.fullName(),
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };
      jest
        .spyOn(userRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await userService.findAll(dto);

      expect(result.meta.totalItems).toBe(0);
    });

    it('finding succeeds with createdAt time range filter', async () => {
      const dto = new FindAllUsersDto();
      dto.options = { limit: 10, page: 1 };
      dto.queries = [
        {
          key: 'createdAt',
          value: {
            gte: faker.date.past().toISOString(),
            lt: faker.date.future().toISOString(),
          },
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
      };
      jest
        .spyOn(userRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await userService.findAll(dto);

      expect(result.meta.totalItems).toBe(0);
    });
  });
  describe('findByEmailAndSignUpMethod', () => {
    it('finding by an email and a sign up method succeeds with valid inputs', async () => {
      const email = faker.internet.email();
      const signUpMethod = getRandomEnumValue(SignUpMethodEnum);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue({} as UserEntity);

      const result = await userService.findByEmailAndSignUpMethod(
        email,
        signUpMethod,
      );

      expect(result).toMatchObject({});
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email, signUpMethod },
        withDeleted: true,
      });
    });
  });
  describe('findById', () => {
    it('finding by an id succeeds with an existent id', async () => {
      const userId = faker.number.int();
      jest
        .spyOn(userRepo, 'findOne')
        .mockResolvedValue({ id: userId } as UserEntity);

      const result = await userService.findById(userId);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toMatchObject({ id: userId });
    });
    it('finding by an id fails with a nonexistent id', async () => {
      const userId = faker.number.int();
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(userService.findById(userId)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
  describe('sendInvitationCode', () => {
    it('sending an invitation code succeeds with a non-existent user', async () => {
      const email = faker.internet.email();
      const userType = getRandomEnumValue(UserTypeEnum);
      const roleId = faker.number.int();
      const invitedBy = new UserDto();
      const mockCode = faker.string.alphanumeric(10);

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      MockCodeService.setCode.mockResolvedValue(mockCode);
      MockUserInvitationMailingService.send.mockResolvedValue(undefined);

      await userService.sendInvitationCode({
        email,
        roleId,
        userType,
        invitedBy,
      });

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ email });
      expect(MockCodeService.setCode).toHaveBeenCalledTimes(1);
      expect(MockUserInvitationMailingService.send).toHaveBeenCalledTimes(1);
      expect(MockUserInvitationMailingService.send).toHaveBeenCalledWith({
        code: mockCode,
        email,
      });
    });

    it('sending an invitation code fails with an existent user', async () => {
      const userId = faker.number.int();
      const email = faker.internet.email();
      const userType = getRandomEnumValue(UserTypeEnum);
      jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue({ id: userId } as UserEntity);

      await expect(
        userService.sendInvitationCode({
          email,
          roleId: faker.number.int(),
          userType,
          invitedBy: new UserDto(),
        }),
      ).rejects.toThrow(UserAlreadyExistsException);

      expect(userRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ email });
      expect(MockCodeService.setCode).not.toHaveBeenCalled();
      expect(MockUserInvitationMailingService.send).not.toHaveBeenCalled();
    });

    it('sending an invitation code succeeds without roleId', async () => {
      const email = faker.internet.email();
      const userType = getRandomEnumValue(UserTypeEnum);
      const invitedBy = new UserDto();
      const mockCode = faker.string.alphanumeric(10);

      jest.spyOn(userRepo, 'findOneBy').mockResolvedValue(null);
      MockCodeService.setCode.mockResolvedValue(mockCode);
      MockUserInvitationMailingService.send.mockResolvedValue(undefined);

      await userService.sendInvitationCode({
        email,
        userType,
        invitedBy,
      });

      expect(MockCodeService.setCode).toHaveBeenCalledWith({
        type: expect.any(String),
        key: email,
        data: { roleId: 0, userType, invitedBy },
        durationSec: 60 * 60 * 24,
      });
    });
  });

  describe('deleteById', () => {
    it('deleting a user by id succeeds', async () => {
      const userId = faker.number.int();
      jest.spyOn(userRepo, 'remove').mockResolvedValue({} as UserEntity);

      await userService.deleteById(userId);

      expect(userRepo.remove).toHaveBeenCalledTimes(1);
      expect(userRepo.remove).toHaveBeenCalledWith(
        expect.objectContaining({ id: userId }),
      );
    });
  });

  describe('updateUser', () => {
    it('updating a user succeeds with valid data', async () => {
      const userId = faker.number.int();
      const updateDto: UpdateUserDto = {
        userId,
        name: faker.person.fullName(),
        department: faker.company.name(),
        type: getRandomEnumValue(UserTypeEnum),
      };

      const existingUser = { id: userId, name: 'Old Name' } as UserEntity;
      jest.spyOn(userService, 'findById').mockResolvedValue(existingUser);
      jest.spyOn(userRepo, 'save').mockResolvedValue({} as UserEntity);

      await userService.updateUser(updateDto);

      expect(userService.findById).toHaveBeenCalledTimes(1);
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: userId,
          name: updateDto.name,
          department: updateDto.department,
          type: updateDto.type,
        }),
      );
    });

    it('updating a user fails with non-existent user id', async () => {
      const userId = faker.number.int();
      const updateDto: UpdateUserDto = {
        userId,
        name: faker.person.fullName(),
        department: null,
      };

      jest
        .spyOn(userService, 'findById')
        .mockRejectedValue(new UserNotFoundException());

      await expect(userService.updateUser(updateDto)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(userService.findById).toHaveBeenCalledTimes(1);
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(userRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteUsers', () => {
    it('deleting multiple users succeeds', async () => {
      const userIds = [
        faker.number.int(),
        faker.number.int(),
        faker.number.int(),
      ];
      const mockUsers = userIds.map(
        (id) => ({ id, members: [] }) as unknown as UserEntity,
      );

      jest.spyOn(userRepo, 'find').mockResolvedValue(mockUsers);
      jest.spyOn(userRepo, 'remove').mockResolvedValue([] as any);

      await userService.deleteUsers(userIds);

      expect(userRepo.find).toHaveBeenCalledTimes(1);
      expect(userRepo.find).toHaveBeenCalledWith({
        where: { id: expect.any(Object) },
        relations: { members: true },
      });
      expect(userRepo.remove).toHaveBeenCalledTimes(1);
      expect(userRepo.remove).toHaveBeenCalledWith(mockUsers);
    });

    it('deleting multiple users succeeds with empty array', async () => {
      jest.spyOn(userRepo, 'find').mockResolvedValue([]);
      jest.spyOn(userRepo, 'remove').mockResolvedValue([] as any);

      await userService.deleteUsers([]);

      expect(userRepo.find).toHaveBeenCalledTimes(1);
      expect(userRepo.remove).toHaveBeenCalledTimes(1);
      expect(userRepo.remove).toHaveBeenCalledWith([]);
    });
  });

  describe('findRolesById', () => {
    it('finding roles by user id succeeds with existing user', async () => {
      const userId = faker.number.int();
      const mockRoles = [
        { id: faker.number.int(), name: faker.person.jobTitle() },
        { id: faker.number.int(), name: faker.person.jobTitle() },
      ];
      const mockUser = {
        id: userId,
        members: [{ role: mockRoles[0] }, { role: mockRoles[1] }],
      } as any;

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);

      const result = await userService.findRolesById(userId);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: { members: true },
        relations: { members: { role: { project: true } } },
      });
      expect(result).toEqual(mockRoles);
    });

    it('finding roles by user id fails with non-existent user', async () => {
      const userId = faker.number.int();
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(userService.findRolesById(userId)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: { members: true },
        relations: { members: { role: { project: true } } },
      });
    });

    it('finding roles by user id succeeds with user having no roles', async () => {
      const userId = faker.number.int();
      const mockUser = {
        id: userId,
        members: [],
      } as any;

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);

      const result = await userService.findRolesById(userId);

      expect(result).toEqual([]);
    });
  });
});
