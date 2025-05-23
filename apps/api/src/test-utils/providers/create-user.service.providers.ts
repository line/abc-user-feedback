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
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { CreateUserService } from '@/domains/admin/user/create-user.service';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import {
  ChannelRepositoryStub,
  ProjectRepositoryStub,
  UserRepositoryStub,
} from '../stubs';
import { FeedbackServiceProviders } from './feedback.service.providers';
import { MemberServiceProviders } from './member.service.providers';
import { TenantServiceProviders } from './tenant.service.providers';
import { UserPasswordServiceProviders } from './user-password.service.providers';

export const CreateUserServiceProviders = [
  CreateUserService,
  ...UserPasswordServiceProviders,
  ...TenantServiceProviders,
  ...MemberServiceProviders,
  ...FeedbackServiceProviders,
  { provide: getRepositoryToken(UserEntity), useClass: UserRepositoryStub },
  {
    provide: getRepositoryToken(ChannelEntity),
    useClass: ChannelRepositoryStub,
  },
  {
    provide: getRepositoryToken(ProjectEntity),
    useClass: ProjectRepositoryStub,
  },
];
