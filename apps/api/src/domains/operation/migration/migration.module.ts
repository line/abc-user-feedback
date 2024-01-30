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
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { ChannelEntity } from '../../admin/channel/channel/channel.entity';
import { FieldEntity } from '../../admin/channel/field/field.entity';
import { FieldModule } from '../../admin/channel/field/field.module';
import { OptionEntity } from '../../admin/channel/option/option.entity';
import { OptionModule } from '../../admin/channel/option/option.module';
import { FeedbackEntity } from '../../admin/feedback/feedback.entity';
import { FeedbackIssueStatisticsModule } from '../../admin/statistics/feedback-issue/feedback-issue-statistics.module';
import { FeedbackStatisticsModule } from '../../admin/statistics/feedback/feedback-statistics.module';
import { IssueStatisticsModule } from '../../admin/statistics/issue/issue-statistics.module';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelEntity,
      FeedbackEntity,
      FieldEntity,
      OptionEntity,
    ]),
    FieldModule,
    OptionModule,
    FeedbackStatisticsModule,
    IssueStatisticsModule,
    FeedbackIssueStatisticsModule,
  ],
  providers: [MigrationService, OpensearchRepository],
  controllers: [MigrationController],
})
export class MigrationModule implements OnModuleInit {
  constructor(
    private readonly migrtaionService: MigrationService,
    private readonly configService: ConfigService,
  ) {}
  async onModuleInit() {
    if (this.configService.get('opensearch.use')) {
      await this.migrtaionService.migrateToES();
    }
  }
}
