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

import { TestConfig } from '@/test-utils/util-functions';
import { EmailVerificationMailingService } from './email-verification-mailing.service';

describe('EmailVerificationMailingService', () => {
  let emailVerificationMailingService: EmailVerificationMailingService;
  let mockMailerService: jest.Mocked<MailerService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: [
        EmailVerificationMailingService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue({ baseUrl: 'http://localhost:3000' }),
          },
        },
      ],
    }).compile();

    emailVerificationMailingService = module.get(
      EmailVerificationMailingService,
    );
    mockMailerService = module.get(MailerService);
    mockConfigService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(emailVerificationMailingService).toBeDefined();
    });

    it('should inject ConfigService', () => {
      expect(mockConfigService).toBeDefined();
    });
  });

  describe('send', () => {
    const mockCode = faker.string.alphanumeric(6);
    const mockEmail = faker.internet.email();

    it('should send email verification mail successfully', async () => {
      await emailVerificationMailingService.send({
        code: mockCode,
        email: mockEmail,
      });

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: mockEmail,
        subject: 'User feedback Email Verification',
        context: { code: mockCode, baseUrl: 'http://localhost:3000' },
        template: 'verification',
      });
    });

    it('should call sendMail with correct parameters', async () => {
      await emailVerificationMailingService.send({
        code: mockCode,
        email: mockEmail,
      });

      const callArgs = mockMailerService.sendMail.mock.calls[0][0];
      expect(callArgs.to).toBe(mockEmail);
      expect(callArgs.subject).toBe('User feedback Email Verification');
      expect(callArgs.context?.code).toBe(mockCode);
      expect(callArgs.context?.baseUrl).toBe('http://localhost:3000');
      expect(callArgs.template).toBe('verification');
    });

    it('should use empty string when baseUrl is not available', async () => {
      // Configure ConfigService to return null
      const module = await Test.createTestingModule({
        imports: [TestConfig],
        providers: [
          EmailVerificationMailingService,
          {
            provide: MailerService,
            useValue: { sendMail: jest.fn() },
          },
          {
            provide: ConfigService,
            useValue: { get: jest.fn().mockReturnValue(null) },
          },
        ],
      }).compile();

      const service = module.get(EmailVerificationMailingService);
      const mailer = module.get(MailerService);

      await service.send({ code: mockCode, email: mockEmail });

      const mockCalls = (mailer.sendMail as jest.Mock).mock
        .calls as unknown[][];
      const callArgs = mockCalls[0]?.[0] as { context?: { baseUrl?: string } };
      expect(callArgs.context?.baseUrl).toBe('');
    });

    it('should use empty string when smtp config is not available', async () => {
      // Configure ConfigService to return undefined baseUrl
      const module = await Test.createTestingModule({
        imports: [TestConfig],
        providers: [
          EmailVerificationMailingService,
          {
            provide: MailerService,
            useValue: { sendMail: jest.fn() },
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue({ baseUrl: undefined }),
            },
          },
        ],
      }).compile();

      const service = module.get(EmailVerificationMailingService);
      const mailer = module.get(MailerService);

      await service.send({ code: mockCode, email: mockEmail });

      const mockCalls = (mailer.sendMail as jest.Mock).mock
        .calls as unknown[][];
      const callArgs = mockCalls[0]?.[0] as { context?: { baseUrl?: string } };
      expect(callArgs.context?.baseUrl).toBe('');
    });

    it('should throw error when mail sending fails', async () => {
      const error = new Error('Mail sending failed');
      (mockMailerService.sendMail as jest.Mock).mockRejectedValue(error);

      await expect(
        emailVerificationMailingService.send({
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
        await emailVerificationMailingService.send({ code: mockCode, email });
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      }
    });

    it('should handle various verification code formats correctly', async () => {
      const testCodes = [
        faker.string.alphanumeric(6),
        faker.string.numeric(4),
        faker.string.alpha(8),
      ];

      for (const code of testCodes) {
        await emailVerificationMailingService.send({ code, email: mockEmail });
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({ code }),
          }),
        );
      }
    });
  });
});
