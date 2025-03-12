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
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { AuthModule } from '../admin/auth/auth.module';
import { ChannelModule } from '../admin/channel/channel/channel.module';
import { FieldModule } from '../admin/channel/field/field.module';
import { OptionEntity } from '../admin/channel/option/option.entity';
import { OptionModule } from '../admin/channel/option/option.module';
import { FeedbackEntity } from '../admin/feedback/feedback.entity';
import { FeedbackModule } from '../admin/feedback/feedback.module';
import { FeedbackMySQLService } from '../admin/feedback/feedback.mysql.service';
import { FeedbackOSService } from '../admin/feedback/feedback.os.service';
import { FeedbackService } from '../admin/feedback/feedback.service';
import { CategoryModule } from '../admin/project/category/category.module';
import { IssueEntity } from '../admin/project/issue/issue.entity';
import { IssueModule } from '../admin/project/issue/issue.module';
import { ProjectModule } from '../admin/project/project/project.module';
import { FeedbackIssueStatisticsModule } from '../admin/statistics/feedback-issue/feedback-issue-statistics.module';
import { FeedbackStatisticsModule } from '../admin/statistics/feedback/feedback-statistics.module';
import { APIController } from './api.controller';
import { CategoryController } from './category.controller';
import { ChannelController } from './channel.controller';
import { FeedbackController } from './feedback.controller';
import { IssueController } from './issue.controller';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity, IssueEntity, OptionEntity]),
    FeedbackModule,
    IssueModule,
    FieldModule,
    OptionModule,
    ChannelModule,
    ProjectModule,
    CategoryModule,
    FeedbackStatisticsModule,
    FeedbackIssueStatisticsModule,
    AuthModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    FeedbackService,
    FeedbackMySQLService,
    FeedbackOSService,
    OpensearchRepository,
  ],
  controllers: [
    FeedbackController,
    IssueController,
    APIController,
    ChannelController,
    ProjectController,
    CategoryController,
  ],
})
export class APIModule {}
