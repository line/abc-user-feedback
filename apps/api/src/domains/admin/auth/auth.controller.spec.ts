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
import { DateTime } from 'luxon';

import { getMockProvider } from '@/test-utils/util-functions';
import { TenantService } from '../tenant/tenant.service';
import { UserDto } from '../user/dtos';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  EmailUserSignUpRequestDto,
  EmailVerificationCodeRequestDto,
  EmailVerificationMailingRequestDto,
  InvitationUserSignUpRequestDto,
} from './dtos/requests';

const MockAuthService = {
  sendEmailCode: jest.fn(),
  verifyEmailCode: jest.fn(),
  signUpEmailUser: jest.fn(),
  signUpInvitationUser: jest.fn(),
  signIn: jest.fn(),
  refreshToken: jest.fn(),
};
const MockTenantService = {
  findOne: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        getMockProvider(AuthService, MockAuthService),
        getMockProvider(TenantService, MockTenantService),
      ],
      controllers: [AuthController],
    }).compile();
    authController = module.get(AuthController);
  });
  it('to be defined', () => {
    expect(authController).toBeDefined();
  });
  it('sendCode', async () => {
    jest
      .spyOn(MockAuthService, 'sendEmailCode')
      .mockResolvedValue(DateTime.utc().toISO());

    const dto = new EmailVerificationMailingRequestDto();
    dto.email = faker.internet.email();

    await authController.sendCode(dto);

    expect(MockAuthService.sendEmailCode).toHaveBeenCalledTimes(1);
  });
  it('verifyEmailCode', () => {
    const dto = new EmailVerificationCodeRequestDto();
    dto.code = faker.string.sample();
    dto.email = faker.internet.email();
    void authController.verifyEmailCode(dto);

    expect(MockAuthService.verifyEmailCode).toHaveBeenCalledTimes(1);
  });
  it('signUpEmailUser', () => {
    const dto = new EmailUserSignUpRequestDto();
    dto.email = faker.internet.email();
    dto.password = faker.internet.password();
    void authController.signUpEmailUser(dto);
    expect(MockAuthService.signUpEmailUser).toHaveBeenCalledTimes(1);
  });
  it('signUpInvitationUser', () => {
    const dto = new InvitationUserSignUpRequestDto();
    dto.code = faker.string.sample();
    dto.email = faker.internet.email();
    dto.password = faker.internet.password();
    void authController.signUpInvitationUser(dto);
    expect(MockAuthService.signUpInvitationUser).toHaveBeenCalledTimes(1);
  });
  it('signInEmail', () => {
    const dto = new UserDto();
    void authController.signInEmail(dto);
    expect(MockAuthService.signIn).toHaveBeenCalledTimes(1);
  });
  it('refreshToken', () => {
    const dto = new UserDto();
    void authController.refreshToken(dto);
    expect(MockAuthService.refreshToken).toHaveBeenCalledTimes(1);
  });
});
