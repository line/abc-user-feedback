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
import { MailerService } from '@nestjs-modules/mailer';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';

import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { UserPasswordService } from '@/domains/admin/user/user-password.service';
import { CodeServiceProviders } from '@/test-utils/providers/code.service.providers';
import { UserRepositoryStub } from '../stubs';
import { getMockProvider } from '../util-functions';

const MockMailerService = {
  sendMail: jest.fn(),
};
const MockResetPasswordMailingService = {
  send: jest.fn(),
};

export const UserPasswordServiceProviders = [
  UserPasswordService,
  ...CodeServiceProviders,
  getMockProvider(ResetPasswordMailingService, MockResetPasswordMailingService),
  getMockProvider(MailerService, MockMailerService),
  { provide: getRepositoryToken(UserEntity), useClass: UserRepositoryStub },
];
