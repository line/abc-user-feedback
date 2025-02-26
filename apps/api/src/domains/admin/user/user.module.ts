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
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CodeModule } from '@/shared/code/code.module';
import { MailingModule } from '@/shared/mailing/mailing.module';

import { MemberModule } from '../project/member/member.module';
import { TenantModule } from '../tenant/tenant.module';
import { CreateUserService } from './create-user.service';
import { UserEntity } from './entities/user.entity';
import { UserPasswordService } from './user-password.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => TenantModule),
    forwardRef(() => MailingModule),
    forwardRef(() => CodeModule),
    forwardRef(() => MemberModule),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService, CreateUserService, UserPasswordService],
  exports: [UserService, CreateUserService, UserPasswordService],
  controllers: [UserController],
})
export class UserModule {}
