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
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { ChannelEntity } from '@/domains/channel/channel/channel.entity';
import { ChannelModule } from '@/domains/channel/channel/channel.module';
import { FieldModule } from '@/domains/channel/field/field.module';
import { OptionEntity } from '@/domains/channel/option/option.entity';
import { OptionModule } from '@/domains/channel/option/option.module';
import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { FeedbackModule } from '@/domains/feedback/feedback.module';
import { TenantModule } from '@/domains/tenant/tenant.module';

import { IssueEntity } from '../issue/issue.entity';
import { IssueModule } from '../issue/issue.module';
import { RoleModule } from '../role/role.module';
import { ProjectController } from './project.controller';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      IssueEntity,
      FeedbackEntity,
      OptionEntity,
      ChannelEntity,
    ]),
    forwardRef(() => ChannelModule),
    FieldModule,
    OptionModule,
    forwardRef(() => FeedbackModule),
    IssueModule,
    RoleModule,
    TenantModule,
  ],
  providers: [ProjectService, OpensearchRepository],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
