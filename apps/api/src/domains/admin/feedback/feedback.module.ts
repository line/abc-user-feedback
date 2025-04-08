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

import { OpensearchRepository } from '@/common/repositories';
import { AuthModule } from '../auth/auth.module';
import { ChannelModule } from '../channel/channel/channel.module';
import { FieldModule } from '../channel/field/field.module';
import { OptionEntity } from '../channel/option/option.entity';
import { OptionModule } from '../channel/option/option.module';
import { HistoryModule } from '../history/history.module';
import { IssueEntity } from '../project/issue/issue.entity';
import { IssueModule } from '../project/issue/issue.module';
import { ProjectModule } from '../project/project/project.module';
import { FeedbackIssueStatisticsModule } from '../statistics/feedback-issue/feedback-issue-statistics.module';
import { FeedbackStatisticsModule } from '../statistics/feedback/feedback-statistics.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackMySQLService } from './feedback.mysql.service';
import { FeedbackOSService } from './feedback.os.service';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity, IssueEntity, OptionEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => ChannelModule),
    FieldModule,
    OptionModule,
    IssueModule,
    HistoryModule,
    FeedbackStatisticsModule,
    FeedbackIssueStatisticsModule,
  ],
  providers: [
    FeedbackService,
    FeedbackMySQLService,
    FeedbackOSService,
    OpensearchRepository,
  ],
  controllers: [FeedbackController],
  exports: [FeedbackService, FeedbackMySQLService, FeedbackOSService],
})
export class FeedbackModule {}
