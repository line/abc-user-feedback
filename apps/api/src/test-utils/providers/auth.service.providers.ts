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
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';

import { EmailVerificationMailingService } from '@/shared/mailing/email-verification-mailing.service';
import { CodeServiceProviders } from '@/test-utils/providers/code.service.providers';
import { getMockProvider } from '@/test-utils/util-functions';
import { AuthService } from '../../domains/auth/auth.service';
import { ApiKeyServiceProviders } from './api-key.service.providers';
import { CreateUserServiceProviders } from './create-user.service.providers';
import { MemberServiceProviders } from './member.service.providers';
import { RoleServiceProviders } from './role.service.providers';
import { TenantServiceProviders } from './tenant.service.providers';
import { UserServiceProviders } from './user.service.providers';

export const MockJwtService = {
  sign: jest.fn(),
};
export const MockEmailVerificationMailingService = {
  send: jest.fn(),
};

export const AuthServiceProviders = [
  AuthService,
  ...CreateUserServiceProviders,
  ...UserServiceProviders,
  getMockProvider(JwtService, MockJwtService),
  getMockProvider(
    EmailVerificationMailingService,
    MockEmailVerificationMailingService,
  ),
  ...CodeServiceProviders,
  ...ApiKeyServiceProviders,
  ...TenantServiceProviders,
  ...RoleServiceProviders,
  ...MemberServiceProviders,
  ClsService,
];
