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
import { getRepositoryToken } from '@nestjs/typeorm';

import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { MemberEntity } from '../../domains/admin/project/member/member.entity';
import { MemberService } from '../../domains/admin/project/member/member.service';
import { TenantRepositoryStub } from '../stubs';
import { MemberRepositoryStub } from '../stubs/member-repository.stub';
import { RoleServiceProviders } from './role.service.providers';
import { UserServiceProviders } from './user.service.providers';

export const MemberServiceProviders = [
  MemberService,
  {
    provide: getRepositoryToken(MemberEntity),
    useClass: MemberRepositoryStub,
  },
  { provide: getRepositoryToken(TenantEntity), useClass: TenantRepositoryStub },
  ...RoleServiceProviders,
  ...UserServiceProviders,
];
