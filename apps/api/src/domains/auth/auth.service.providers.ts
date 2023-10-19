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

import { CodeServiceProviders } from '@/shared/code/code.service.providers';
import { EmailVerificationMailingService } from '@/shared/mailing/email-verification-mailing.service';
import { getMockProvider } from '@/utils/test-utils';
import { ApiKeyServiceProviders } from '../project/api-key/api-key.service.providers';
import { MemberServiceProviders } from '../project/member/member.service.providers';
import { RoleServiceProviders } from '../project/role/role.service.providers';
import { TenantServiceProviders } from '../tenant/tenant.service.providers';
import { CreateUserServiceProviders } from '../user/create-user.service.providers';
import { UserServiceProviders } from '../user/user.service.providers';
import { AuthService } from './auth.service';

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
