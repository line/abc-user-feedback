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
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { FeedbackIssueStatisticsService } from '../../admin/statistics/feedback-issue/feedback-issue-statistics.service';
import { FeedbackStatisticsService } from '../../admin/statistics/feedback/feedback-statistics.service';
import { IssueStatisticsService } from '../../admin/statistics/issue/issue-statistics.service';
import { SuperUser } from '../../admin/user/super-user.decorator';
import { MigrationService } from './migration.service';

// Bounds the per-day, per-channel recomputation a single request can trigger.
const MAX_STATISTICS_DAYS = 365;

class MigrateStatisticsRequestDto {
  @Type(() => Number)
  @IsInt()
  projectId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_STATISTICS_DAYS)
  day: number;
}

// Maintenance operations: rebuilding indexes and statistics is reserved for
// SUPER users.
@Controller('/migration')
@SuperUser()
export class MigrationController {
  constructor(
    private readonly migrationService: MigrationService,
    private readonly feedbackStatisticsService: FeedbackStatisticsService,
    private readonly issueStatisticsService: IssueStatisticsService,
    private readonly feedbackIssueStatisticsService: FeedbackIssueStatisticsService,
  ) {}

  @Post('/channels/:channelId')
  async migrate(@Param('channelId', ParseIntPipe) channelId: number) {
    await this.migrationService.migrateToESByChannelId(channelId);
  }

  @Post('/statistics/feedback')
  async migrateFeedbackStatistics(@Body() body: MigrateStatisticsRequestDto) {
    await this.feedbackStatisticsService.createFeedbackStatistics(
      body.projectId,
      body.day,
    );
  }

  @Post('/statistics/issue')
  async migrateIssueStatistics(@Body() body: MigrateStatisticsRequestDto) {
    await this.issueStatisticsService.createIssueStatistics(
      body.projectId,
      body.day,
    );
  }

  @Post('/statistics/feedback-issue')
  async migrateFeedbackIssueStatistics(
    @Body() body: MigrateStatisticsRequestDto,
  ) {
    await this.feedbackIssueStatisticsService.createFeedbackIssueStatistics(
      body.projectId,
      body.day,
    );
  }
}
