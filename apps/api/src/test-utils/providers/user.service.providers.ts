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

import { UserInvitationMailingService } from '@/shared/mailing/user-invitation-mailing.service';
import { CodeServiceProviders } from '@/test-utils/providers/code.service.providers';
import { getMockProvider, mockRepository } from '@/test-utils/util-functions';
import { UserEntity } from '../../domains/admin/user/entities/user.entity';
import { UserService } from '../../domains/admin/user/user.service';
import { TenantServiceProviders } from './tenant.service.providers';

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
