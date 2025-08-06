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
    it('sending an invatiation code fails with an existent user', async () => {
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
  });
});
