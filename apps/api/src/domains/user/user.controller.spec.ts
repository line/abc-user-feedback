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
import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { getMockProvider } from '@/test-utils/util-functions';
import { UserDto } from './dtos';
import {
  ChangePasswordRequestDto,
  ResetPasswordRequestDto,
  UserInvitationRequestDto,
} from './dtos/requests';
import { UserPasswordService } from './user-password.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const MockUserService = {
  findAll: jest.fn(),
  deleteUsers: jest.fn(),
  sendInvitationCode: jest.fn(),
  findById: jest.fn(),
  updateUserRole: jest.fn(),
  deleteById: jest.fn(),
};
const MockUserPasswordService = {
  sendResetPasswordMail: jest.fn(),
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
};

describe('user controller', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
  it('getAllUsers', () => {
    jest.spyOn(MockUserService, 'findAll').mockResolvedValue([]);
    userController.getAllUsers({ limit: 10, page: 1 });
    expect(MockUserService.findAll).toHaveBeenCalledTimes(1);
  });

  it('deleteUsers', () => {
    userController.deleteUsers({ ids: [1] });
    expect(MockUserService.deleteUsers).toHaveBeenCalledTimes(1);
  });
  it('inviteUser', () => {
    const userDto = new UserDto();
    userDto.id = faker.datatype.number();
    userController.inviteUser(new UserInvitationRequestDto(), userDto);
    expect(MockUserService.sendInvitationCode).toHaveBeenCalledTimes(1);
  });
  it('requestResetPassword', () => {
    userController.requestResetPassword('email');
    expect(MockUserPasswordService.sendResetPasswordMail).toHaveBeenCalledTimes(
      1,
    );
  });
  it('resetPassword', () => {
    userController.resetPassword(new ResetPasswordRequestDto());
    expect(MockUserPasswordService.resetPassword).toHaveBeenCalledTimes(1);
  });
  it('changePassword', () => {
    userController.changePassword(
      new UserDto(),
      new ChangePasswordRequestDto(),
    );
    expect(MockUserPasswordService.changePassword).toHaveBeenCalledTimes(1);
  });

  it('getUser', () => {
    const userDto = new UserDto();
    userDto.id = faker.number.int();

    userController.getUser(userDto.id, userDto);

    expect(MockUserService.findById).toHaveBeenCalledTimes(1);
    expect(MockUserService.findById).toHaveBeenCalledWith(userDto.id);
  });

  describe('deleteUser', () => {
    it('positive', () => {
      const userDto = new UserDto();
      userDto.id = faker.number.int();

      userController.deleteUser(userDto.id, userDto);

      expect(MockUserService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockUserService.deleteById).toHaveBeenCalledWith(userDto.id);
    });
    it('Unauthorization', () => {
      const userDto = new UserDto();
      userDto.id = faker.number.int();

      expect(
        userController.deleteUser(faker.number.int(), userDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
