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
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/domains/admin/user/user.module';
import { TenantEntity } from '../../tenant/tenant.entity';
import { RoleModule } from '../role/role.module';
import { MemberController } from './member.controller';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity, TenantEntity]),
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule),
  ],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
