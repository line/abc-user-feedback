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
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { FindCountByDateByIssueResponseDto } from './dtos/responses';
import { FeedbackIssueStatisticsService } from './feedback-issue-statistics.service';

@Controller('/statistics/feedback-issue')
export class FeedbackIssueStatisticsController {
  constructor(
    private readonly feedbackIssueStatisticsService: FeedbackIssueStatisticsService,
  ) {}

  @ApiOkResponse({ type: FindCountByDateByIssueResponseDto })
  @Get()
  async getCountByDateByIssue(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('interval') interval: 'day' | 'week' | 'month',
    @Query('issueIds') issueIds: string,
  ) {
    const issueIdsArray = issueIds
      .split(',')
      .map((v) => parseInt(v, 10))
      .filter((v) => !isNaN(v));

    return FindCountByDateByIssueResponseDto.transform(
      await this.feedbackIssueStatisticsService.getCountByDateByIssue({
        startDate,
        endDate,
        interval,
        issueIds: issueIdsArray,
      }),
    );
  }
}
