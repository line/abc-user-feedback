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
import { UserInvitationMailingService } from './user-invitation-mailing.service';

describe('UserInvitationMailingService', () => {
  let userInvitationMailingService: UserInvitationMailingService;
  let mockMailerService: jest.Mocked<MailerService>;
  let mockConfigService: jest.Mocked<ConfigService<ConfigServiceType>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: [
        UserInvitationMailingService,
        getMockProvider(MailerService, MockMailerService),
        getMockProvider(ConfigService, MockConfigService),
      ],
    }).compile();

    userInvitationMailingService = module.get(UserInvitationMailingService);
    mockMailerService = module.get(MailerService);
    mockConfigService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(userInvitationMailingService).toBeDefined();
    });

    it('should inject ConfigService', () => {
      expect(mockConfigService).toBeDefined();
    });
  });

  describe('send', () => {
    const mockBaseUrl = 'https://example.com';
    const mockCode = faker.string.alphanumeric(10);
    const mockEmail = faker.internet.email();

    beforeEach(() => {
      MockMailerService.sendMail.mockClear();
      mockConfigService.get.mockReturnValue({ baseUrl: mockBaseUrl });
    });

    it('should send user invitation mail successfully', async () => {
      await userInvitationMailingService.send({
        code: mockCode,
        email: mockEmail,
      });

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: mockEmail,
        subject: 'User Feedback Invitation',
        context: {
          link: `${mockBaseUrl}/link/user-invitation?code=${mockCode}&email=${mockEmail}`,
          baseUrl: mockBaseUrl,
        },
        template: 'invitation',
      });
    });

    it('should call sendMail with correct parameters', async () => {
      await userInvitationMailingService.send({
        code: mockCode,
        email: mockEmail,
      });

      const callArgs = mockMailerService.sendMail.mock.calls[0][0];
      expect(callArgs.to).toBe(mockEmail);
      expect(callArgs.subject).toBe('User Feedback Invitation');
      expect(callArgs.context?.link).toBe(
        `${mockBaseUrl}/link/user-invitation?code=${mockCode}&email=${mockEmail}`,
      );
      expect(callArgs.context?.baseUrl).toBe(mockBaseUrl);
      expect(callArgs.template).toBe('invitation');
    });

    it('should use empty string when baseUrl is not available', async () => {
      mockConfigService.get.mockReturnValue({ baseUrl: '' });
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await userInvitationMailingService.send({ code, email });

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User Feedback Invitation',
        context: {
          link: `/link/user-invitation?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'invitation',
      });
    });

    it('should handle null configService response correctly', async () => {
      mockConfigService.get.mockReturnValue(null);
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await userInvitationMailingService.send({ code, email });

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User Feedback Invitation',
        context: {
          link: `/link/user-invitation?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'invitation',
      });
    });

    it('should handle undefined baseUrl in smtp config correctly', async () => {
      mockConfigService.get.mockReturnValue({ baseUrl: undefined });
      const code = faker.string.alphanumeric(10);
      const email = faker.internet.email();

      await userInvitationMailingService.send({ code, email });

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User Feedback Invitation',
        context: {
          link: `/link/user-invitation?code=${code}&email=${email}`,
          baseUrl: '',
        },
        template: 'invitation',
      });
    });

    it('should handle special characters in code and email', async () => {
      const code = 'test+code@123';
      const email = 'user+test@example.com';

      await userInvitationMailingService.send({ code, email });

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'User Feedback Invitation',
        context: {
          link: `${mockBaseUrl}/link/user-invitation?code=${code}&email=${email}`,
          baseUrl: mockBaseUrl,
        },
        template: 'invitation',
      });
    });

    it('should throw error when mail sending fails', async () => {
      const error = new Error('Mail sending failed');
      mockMailerService.sendMail.mockRejectedValue(error);

      await expect(
        userInvitationMailingService.send({
          code: mockCode,
          email: mockEmail,
        }),
      ).rejects.toThrow('Mail sending failed');
    });

    it('should handle various email formats correctly', async () => {
      const testEmails = [
        faker.internet.email(),
        faker.internet.email({ provider: 'gmail.com' }),
        faker.internet.email({ provider: 'company.co.kr' }),
      ];

      for (const email of testEmails) {
        await userInvitationMailingService.send({ code: mockCode, email });
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      }
    });

    it('should handle various invitation code formats correctly', async () => {
      const testCodes = [
        faker.string.alphanumeric(6),
        faker.string.numeric(4),
        faker.string.alpha(8),
        faker.string.uuid(),
      ];

      for (const code of testCodes) {
        await userInvitationMailingService.send({ code, email: mockEmail });
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({
              link: expect.stringContaining(`code=${code}`),
            }),
          }),
        );
      }
    });

    it('should construct invitation link correctly with different baseUrls', async () => {
      const testBaseUrls = [
        'https://app.example.com',
        'http://localhost:3000',
        'https://staging.example.com',
        '',
      ];

      for (const baseUrl of testBaseUrls) {
        mockConfigService.get.mockReturnValue({ baseUrl });
        await userInvitationMailingService.send({
          code: mockCode,
          email: mockEmail,
        });

        const expectedLink =
          baseUrl ?
            `${baseUrl}/link/user-invitation?code=${mockCode}&email=${mockEmail}`
          : `/link/user-invitation?code=${mockCode}&email=${mockEmail}`;

        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({
              link: expectedLink,
              baseUrl,
            }),
          }),
        );
      }
    });

    it('should propagate errors from MailerService', async () => {
      const error = new Error('Mailer service error');
      mockMailerService.sendMail.mockRejectedValue(error);

      await expect(
        userInvitationMailingService.send({ code: mockCode, email: mockEmail }),
      ).rejects.toThrow(error);
    });
  });
});

const MockMailerService = {
  sendMail: jest.fn(),
};

const MockConfigService = {
  get: jest.fn(),
};
