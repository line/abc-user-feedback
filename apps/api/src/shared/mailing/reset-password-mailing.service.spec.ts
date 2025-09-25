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
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { getMockProvider, TestConfig } from '@/test-utils/util-functions';
import type { ConfigServiceType } from '@/types/config-service.type';
import { ResetPasswordMailingService } from './reset-password-mailing.service';

describe('ResetPasswordMailingService', () => {
  let resetPasswordMailingService: ResetPasswordMailingService;
  let mockConfigService: jest.Mocked<ConfigService<ConfigServiceType>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: [
        ResetPasswordMailingService,
        getMockProvider(MailerService, MockMailerService),
        getMockProvider(ConfigService, MockConfigService),
      ],
    }).compile();

    resetPasswordMailingService = module.get(ResetPasswordMailingService);
    mockConfigService = module.get(ConfigService);
  });
  describe('Basic functionality', () => {
    it('should be defined', () => {
      expect(resetPasswordMailingService).toBeDefined();
    });
  });

  describe('send method', () => {
    const mockBaseUrl = 'https://example.com';

    beforeEach(() => {
      MockMailerService.sendMail.mockClear();
      jest
        .spyOn(mockConfigService, 'get')
        .mockReturnValue({ baseUrl: mockBaseUrl });
    });

    it('should send mail successfully', async () => {
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await resetPasswordMailingService.send({ code, email });

      expect(MockMailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should send mail with correct parameters', async () => {
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await resetPasswordMailingService.send({ code, email });

      expect(MockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User feedback Reset Password',
        context: {
          link: `/link/reset-password?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'resetPassword',
      });
    });

    it('should handle empty baseUrl correctly', async () => {
      jest.spyOn(mockConfigService, 'get').mockReturnValue({ baseUrl: '' });
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await resetPasswordMailingService.send({ code, email });

      expect(MockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User feedback Reset Password',
        context: {
          link: `/link/reset-password?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'resetPassword',
      });
    });

    it('should handle null configService response correctly', async () => {
      jest.spyOn(mockConfigService, 'get').mockReturnValue(null);
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await resetPasswordMailingService.send({ code, email });

      expect(MockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User feedback Reset Password',
        context: {
          link: `/link/reset-password?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'resetPassword',
      });
    });

    it('should handle special characters in code and email', async () => {
      const code = 'test+code@123';
      const email = 'user+test@example.com';

      await resetPasswordMailingService.send({ code, email });

      expect(MockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User feedback Reset Password',
        context: {
          link: `/link/reset-password?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'resetPassword',
      });
    });

    it('should propagate errors from MailerService', async () => {
      const error = new Error('Mailer service error');
      MockMailerService.sendMail.mockRejectedValue(error);

      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await expect(
        resetPasswordMailingService.send({ code, email }),
      ).rejects.toThrow(error);
    });
  });
});

const MockMailerService = {
  sendMail: jest.fn(),
};

const MockConfigService = {
  get: jest.fn().mockReturnValue({ baseUrl: 'https://example.com' }),
};
