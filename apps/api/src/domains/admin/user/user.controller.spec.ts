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
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { QueryV2ConditionsEnum, SortMethodEnum } from '@/common/enums';
import { getMockProvider, TestConfig } from '@/test-utils/util-functions';
import { UserDto } from './dtos';
import {
  ChangePasswordRequestDto,
  DeleteUsersRequestDto,
  GetAllUsersRequestDto,
  ResetPasswordRequestDto,
  UpdateUserRequestDto,
  UserInvitationRequestDto,
} from './dtos/requests';
import { UserTypeEnum } from './entities/enums';
import { UserPasswordService } from './user-password.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const MockUserService = {
  findAll: jest.fn(),
  deleteUsers: jest.fn(),
  sendInvitationCode: jest.fn(),
  findById: jest.fn(),
  updateUser: jest.fn(),
  deleteById: jest.fn(),
  findRolesById: jest.fn(),
};
const MockUserPasswordService = {
  sendResetPasswordMail: jest.fn(),
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
};

describe('user controller', () => {
  let userController: UserController;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: [
        getMockProvider(UserService, MockUserService),
        getMockProvider(UserPasswordService, MockUserPasswordService),
      ],
      controllers: [UserController],
    }).compile();
    userController = module.get(UserController);
  });
  it('to be defined', () => {
    expect(userController).toBeDefined();
  });
  it('getAllUsers', async () => {
    const mockUsers = {
      items: [],
      meta: {
        itemCount: 0,
        totalItems: 0,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 0,
      },
    };
    jest.spyOn(MockUserService, 'findAll').mockResolvedValue(mockUsers);
    await userController.getAllUsers({ limit: 10, page: 1 });
    expect(MockUserService.findAll).toHaveBeenCalledTimes(1);
    expect(MockUserService.findAll).toHaveBeenCalledWith({
      options: { limit: 10, page: 1 },
    });
  });

  it('searchUsers', async () => {
    const mockUsers = {
      items: [],
      meta: {
        itemCount: 0,
        totalItems: 0,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 0,
      },
    };
    const searchDto = new GetAllUsersRequestDto();
    searchDto.limit = 10;
    searchDto.page = 1;
    searchDto.queries = [
      {
        key: 'email',
        value: 'test@example.com',
        condition: QueryV2ConditionsEnum.IS,
      },
    ];
    searchDto.order = { createdAt: SortMethodEnum.ASC };
    searchDto.operator = 'AND';

    jest.spyOn(MockUserService, 'findAll').mockResolvedValue(mockUsers);
    await userController.searchUsers(searchDto);
    expect(MockUserService.findAll).toHaveBeenCalledTimes(1);
    expect(MockUserService.findAll).toHaveBeenCalledWith({
      options: { limit: 10, page: 1 },
      queries: searchDto.queries,
      order: searchDto.order,
      operator: searchDto.operator,
    });
  });

  it('deleteUsers', async () => {
    const deleteDto = new DeleteUsersRequestDto();
    deleteDto.ids = [1, 2, 3];
    await userController.deleteUsers(deleteDto);
    expect(MockUserService.deleteUsers).toHaveBeenCalledTimes(1);
    expect(MockUserService.deleteUsers).toHaveBeenCalledWith(deleteDto.ids);
  });
  it('inviteUser', async () => {
    const userDto = new UserDto();
    userDto.id = faker.number.int();
    const invitationDto = new UserInvitationRequestDto();
    invitationDto.email = faker.internet.email();
    invitationDto.userType = UserTypeEnum.GENERAL;
    invitationDto.roleId = faker.number.int();

    await userController.inviteUser(invitationDto, userDto);
    expect(MockUserService.sendInvitationCode).toHaveBeenCalledTimes(1);
    expect(MockUserService.sendInvitationCode).toHaveBeenCalledWith({
      ...invitationDto,
      invitedBy: userDto,
    });
  });

  it('inviteUser - SUPER user with role should throw BadRequestException', async () => {
    const userDto = new UserDto();
    userDto.id = faker.number.int();
    const invitationDto = new UserInvitationRequestDto();
    invitationDto.email = faker.internet.email();
    invitationDto.userType = UserTypeEnum.SUPER;
    invitationDto.roleId = faker.number.int();

    await expect(
      userController.inviteUser(invitationDto, userDto),
    ).rejects.toThrow(BadRequestException);
    expect(MockUserService.sendInvitationCode).not.toHaveBeenCalled();
  });
  it('requestResetPassword', async () => {
    const email = faker.internet.email();
    await userController.requestResetPassword(email);
    expect(MockUserPasswordService.sendResetPasswordMail).toHaveBeenCalledTimes(
      1,
    );
    expect(MockUserPasswordService.sendResetPasswordMail).toHaveBeenCalledWith(
      email,
    );
  });

  it('resetPassword', async () => {
    const resetDto = new ResetPasswordRequestDto();
    resetDto.email = faker.internet.email();
    resetDto.code = faker.string.alphanumeric(6);
    resetDto.password = faker.internet.password();

    await userController.resetPassword(resetDto);
    expect(MockUserPasswordService.resetPassword).toHaveBeenCalledTimes(1);
    expect(MockUserPasswordService.resetPassword).toHaveBeenCalledWith(
      resetDto,
    );
  });

  it('changePassword', async () => {
    const userDto = new UserDto();
    userDto.id = faker.number.int();
    const changePasswordDto = new ChangePasswordRequestDto();
    changePasswordDto.password = faker.internet.password();
    changePasswordDto.newPassword = faker.internet.password();

    await userController.changePassword(userDto, changePasswordDto);
    expect(MockUserPasswordService.changePassword).toHaveBeenCalledTimes(1);
    expect(MockUserPasswordService.changePassword).toHaveBeenCalledWith({
      newPassword: changePasswordDto.newPassword,
      password: changePasswordDto.password,
      userId: userDto.id,
    });
  });

  it('getUser', async () => {
    const userDto = new UserDto();
    userDto.id = faker.number.int();
    const mockUser = { id: userDto.id, email: faker.internet.email() };

    jest.spyOn(MockUserService, 'findById').mockResolvedValue(mockUser);
    await userController.getUser(userDto.id, userDto);

    expect(MockUserService.findById).toHaveBeenCalledTimes(1);
    expect(MockUserService.findById).toHaveBeenCalledWith(userDto.id);
  });

  it('getUser - unauthorized when id mismatch', async () => {
    const userDto = new UserDto();
    userDto.id = faker.number.int();
    const differentId = faker.number.int();

    await expect(userController.getUser(differentId, userDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(MockUserService.findById).not.toHaveBeenCalled();
  });

  it('getRoles', async () => {
    const userId = faker.number.int();
    const mockRoles = [
      { id: 1, name: 'Admin', project: { id: 1, name: 'Project 1' } },
      { id: 2, name: 'User', project: { id: 2, name: 'Project 2' } },
    ];

    jest.spyOn(MockUserService, 'findRolesById').mockResolvedValue(mockRoles);
    const result = await userController.getRoles(userId);

    expect(MockUserService.findRolesById).toHaveBeenCalledTimes(1);
    expect(MockUserService.findRolesById).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ roles: mockRoles });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userDto = new UserDto();
      userDto.id = faker.number.int();

      await userController.deleteUser(userDto.id, userDto);

      expect(MockUserService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockUserService.deleteById).toHaveBeenCalledWith(userDto.id);
    });
    it('Unauthorization', () => {
      const userDto = new UserDto();
      userDto.id = faker.number.int();
      userDto.type = UserTypeEnum.GENERAL;
      const differentUserId = faker.number.int();
      const updateDto = new UpdateUserRequestDto();
      updateDto.name = faker.person.fullName();

      await expect(
        userController.updateUser(differentUserId, updateDto, userDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(MockUserService.updateUser).not.toHaveBeenCalled();
    });
  });
});
