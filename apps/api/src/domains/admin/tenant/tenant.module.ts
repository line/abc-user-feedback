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

import { SchedulerLockModule } from '@/domains/operation/scheduler-lock/scheduler-lock.module';
import { ChannelEntity } from '../channel/channel/channel.entity';
import { FeedbackEntity } from '../feedback/feedback.entity';
import { FeedbackModule } from '../feedback/feedback.module';
import { MemberModule } from '../project/member/member.module';
import { ProjectEntity } from '../project/project/project.entity';
import { RoleEntity } from '../project/role/role.entity';
import { RoleModule } from '../project/role/role.module';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { TenantController } from './tenant.controller';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TenantEntity,
      RoleEntity,
      UserEntity,
      FeedbackEntity,
      ChannelEntity,
      ProjectEntity,
    ]),
    RoleModule,
    SchedulerLockModule,
    forwardRef(() => FeedbackModule),
    forwardRef(() => MemberModule),
    forwardRef(() => UserModule),
  ],
  providers: [TenantService],
  controllers: [TenantController],
  exports: [TenantService],
})
export class TenantModule {
  constructor(private readonly service: TenantService) {}
  async onModuleInit() {
    await this.service.addCronJob();
  }
}
