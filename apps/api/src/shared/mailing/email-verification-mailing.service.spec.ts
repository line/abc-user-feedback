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
import { MailerService } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';

import { getMockProvider } from '@/test-utils/util-functions';
import { EmailVerificationMailingService } from './email-verification-mailing.service';

describe('first', () => {
  let emailVerificationMailingService: EmailVerificationMailingService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailVerificationMailingService,
        getMockProvider(MailerService, MockMailerService),
      ],
    }).compile();
    emailVerificationMailingService = module.get(
      EmailVerificationMailingService,
    );
  });
  it('to be defined', () => {
    expect(emailVerificationMailingService).toBeDefined();
  });
  it('send', async () => {
    const code = faker.string.sample();
    const email = faker.internet.email();
    await emailVerificationMailingService.send({ code, email });
    expect(MockMailerService.sendMail).toHaveBeenCalledTimes(1);
  });
});

const MockMailerService = {
  sendMail: jest.fn(),
};
