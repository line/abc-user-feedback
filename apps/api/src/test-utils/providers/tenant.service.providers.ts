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
import { SchedulerRegistry } from '@nestjs/schedule';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ResetPasswordMailingService } from '@/shared/mailing/reset-password-mailing.service';

import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { UserPasswordService } from '@/domains/admin/user/user-password.service';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import {
  FeedbackRepositoryStub,
  ProjectRepositoryStub,
  TenantRepositoryStub,
  UserRepositoryStub,
} from '../stubs';
import { FeedbackServiceProviders } from './feedback.service.providers';

export const TenantServiceProviders = [
  TenantService,
  SchedulerRegistry,
  SchedulerLockService,
  UserPasswordService,
  ResetPasswordMailingService,
  { provide: getRepositoryToken(TenantEntity), useClass: TenantRepositoryStub },
  { provide: getRepositoryToken(UserEntity), useClass: UserRepositoryStub },
  {
    provide: getRepositoryToken(FeedbackEntity),
    useClass: FeedbackRepositoryStub,
  },
  {
    provide: getRepositoryToken(ProjectEntity),
    useClass: ProjectRepositoryStub,
  },
  ...FeedbackServiceProviders,
];
