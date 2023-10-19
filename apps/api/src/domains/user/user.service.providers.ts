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

import { CodeServiceProviders } from '@/shared/code/code.service.providers';
import { UserInvitationMailingService } from '@/shared/mailing/user-invitation-mailing.service';
import { getMockProvider, mockRepository } from '@/utils/test-utils';
import { TenantServiceProviders } from '../tenant/tenant.service.providers';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

export const MockUserInvitationMailingService = {
  send: jest.fn(),
};
const MockMailerService = {
  sendMail: jest.fn(),
};

export const UserServiceProviders = [
  UserService,
  { provide: getRepositoryToken(UserEntity), useValue: mockRepository() },
  getMockProvider(
    UserInvitationMailingService,
    MockUserInvitationMailingService,
  ),
  getMockProvider(MailerService, MockMailerService),
  ...CodeServiceProviders,
  ...TenantServiceProviders,
];
