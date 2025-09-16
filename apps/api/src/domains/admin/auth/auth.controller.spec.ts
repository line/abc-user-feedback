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
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
  OAuthUserSignUpRequestDto,
} from './dtos/requests';

const MockAuthService = {
  sendEmailCode: jest.fn(),
  verifyEmailCode: jest.fn(),
  signUpEmailUser: jest.fn(),
  signUpInvitationUser: jest.fn(),
  signUpOAuthUser: jest.fn(),
  signIn: jest.fn(),
  signInByOAuth: jest.fn(),
  refreshToken: jest.fn(),
  getOAuthLoginURL: jest.fn(),
};

const MockTenantService = {
  findOne: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let _tenantService: jest.Mocked<TenantService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        getMockProvider(AuthService, MockAuthService),
        getMockProvider(TenantService, MockTenantService),
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
    _tenantService = module.get(TenantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  describe('sendCode', () => {
    it('should send email verification code successfully', async () => {
      const mockTimestamp = DateTime.utc().toISO();
      const dto = new EmailVerificationMailingRequestDto();
      dto.email = faker.internet.email();

      authService.sendEmailCode.mockResolvedValue(mockTimestamp);

      const result = await authController.sendCode(dto);

      expect(authService.sendEmailCode).toHaveBeenCalledWith(dto);
      expect(authService.sendEmailCode).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ expiredAt: mockTimestamp });
    });

    it('should handle sendEmailCode errors', async () => {
      const dto = new EmailVerificationMailingRequestDto();
      dto.email = faker.internet.email();
      const error = new InternalServerErrorException(
        'Email service unavailable',
      );

      authService.sendEmailCode.mockRejectedValue(error);

      await expect(authController.sendCode(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(authService.sendEmailCode).toHaveBeenCalledWith(dto);
    });

    it('should handle invalid email format', async () => {
      const dto = new EmailVerificationMailingRequestDto();
      dto.email = 'invalid-email';
      const error = new BadRequestException('Invalid email format');

      authService.sendEmailCode.mockRejectedValue(error);

      await expect(authController.sendCode(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('verifyEmailCode', () => {
    it('should verify email code successfully', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.code = faker.string.alphanumeric(6);
      dto.email = faker.internet.email();

      authService.verifyEmailCode.mockResolvedValue(undefined);

      await authController.verifyEmailCode(dto);

      expect(authService.verifyEmailCode).toHaveBeenCalledWith(dto);
      expect(authService.verifyEmailCode).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid verification code', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.code = 'invalid-code';
      dto.email = faker.internet.email();
      const error = new BadRequestException('Invalid verification code');

      authService.verifyEmailCode.mockRejectedValue(error);

      await expect(authController.verifyEmailCode(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.verifyEmailCode).toHaveBeenCalledWith(dto);
    });

    it('should handle expired verification code', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.code = faker.string.alphanumeric(6);
      dto.email = faker.internet.email();
      const error = new BadRequestException('Verification code expired');

      authService.verifyEmailCode.mockRejectedValue(error);

      await expect(authController.verifyEmailCode(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('signUpEmailUser', () => {
    it('should sign up email user successfully', async () => {
      const dto = new EmailUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      authService.signUpEmailUser.mockResolvedValue(undefined as any);

      const result = await authController.signUpEmailUser(dto);

      expect(authService.signUpEmailUser).toHaveBeenCalledWith(dto);
      expect(authService.signUpEmailUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle email already exists error', async () => {
      const dto = new EmailUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      const error = new BadRequestException('Email already exists');

      authService.signUpEmailUser.mockRejectedValue(error);

      await expect(authController.signUpEmailUser(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.signUpEmailUser).toHaveBeenCalledWith(dto);
    });

    it('should handle weak password error', async () => {
      const dto = new EmailUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = '123'; // Weak password
      const error = new BadRequestException('Password is too weak');

      authService.signUpEmailUser.mockRejectedValue(error);

      await expect(authController.signUpEmailUser(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('signUpInvitationUser', () => {
    it('should sign up invitation user successfully', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.code = faker.string.alphanumeric(8);
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      authService.signUpInvitationUser.mockResolvedValue(undefined as any);

      const result = await authController.signUpInvitationUser(dto);

      expect(authService.signUpInvitationUser).toHaveBeenCalledWith(dto);
      expect(authService.signUpInvitationUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle invalid invitation code', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.code = 'invalid-code';
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      const error = new BadRequestException('Invalid invitation code');

      authService.signUpInvitationUser.mockRejectedValue(error);

      await expect(authController.signUpInvitationUser(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.signUpInvitationUser).toHaveBeenCalledWith(dto);
    });

    it('should handle expired invitation', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.code = faker.string.alphanumeric(8);
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();
      const error = new BadRequestException('Invitation has expired');

      authService.signUpInvitationUser.mockRejectedValue(error);

      await expect(authController.signUpInvitationUser(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('signInEmail', () => {
    it('should sign in email user successfully', () => {
      const user = new UserDto();
      user.id = faker.number.int();
      user.email = faker.internet.email();
      user.name = faker.person.fullName();
      const mockTokens = {
        accessToken: faker.string.alphanumeric(32),
        refreshToken: faker.string.alphanumeric(32),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      authService.signIn.mockReturnValue(mockTokens as any);

      const result = authController.signInEmail(user);

      expect(authService.signIn).toHaveBeenCalledWith(user);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      const user = new UserDto();
      user.id = faker.number.int();
      user.email = faker.internet.email();
      user.name = faker.person.fullName();
      const mockTokens = {
        accessToken: faker.string.alphanumeric(32),
        refreshToken: faker.string.alphanumeric(32),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      authService.refreshToken.mockReturnValue(mockTokens as any);

      const result = authController.refreshToken(user);

      expect(authService.refreshToken).toHaveBeenCalledWith(user);
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('signUpOAuthUser', () => {
    it('should sign up OAuth user successfully', async () => {
      const dto = new OAuthUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.projectName = faker.company.name();
      dto.roleName = faker.person.jobTitle();

      authService.signUpOAuthUser.mockResolvedValue(undefined);

      const result = await authController.signUpOAuthUser(dto);

      expect(authService.signUpOAuthUser).toHaveBeenCalledWith(dto);
      expect(authService.signUpOAuthUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle OAuth provider error', async () => {
      const dto = new OAuthUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.projectName = faker.company.name();
      dto.roleName = faker.person.jobTitle();
      const error = new InternalServerErrorException('OAuth provider error');

      authService.signUpOAuthUser.mockRejectedValue(error);

      await expect(authController.signUpOAuthUser(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('redirectToLoginURL', () => {
    it('should return OAuth login URL', async () => {
      const callbackUrl = faker.internet.url();
      const mockUrl = faker.internet.url();

      authService.getOAuthLoginURL.mockResolvedValue(mockUrl);

      const result = await authController.redirectToLoginURL(callbackUrl);

      expect(authService.getOAuthLoginURL).toHaveBeenCalledWith(callbackUrl);
      expect(authService.getOAuthLoginURL).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ url: mockUrl });
    });
  });

  describe('handleCallback', () => {
    it('should handle OAuth callback successfully', async () => {
      const query = { code: faker.string.alphanumeric(32) };
      const mockTokens = {
        accessToken: faker.string.alphanumeric(32),
        refreshToken: faker.string.alphanumeric(32),
      };

      authService.signInByOAuth.mockResolvedValue(mockTokens);

      const result = await authController.handleCallback(query);

      expect(authService.signInByOAuth).toHaveBeenCalledWith(query.code);
      expect(authService.signInByOAuth).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTokens);
    });

    it('should handle OAuth authentication failure', async () => {
      const query = { code: 'invalid-code' };
      const error = new BadRequestException('OAuth authentication failed');

      authService.signInByOAuth.mockRejectedValue(error);

      await expect(authController.handleCallback(query)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
