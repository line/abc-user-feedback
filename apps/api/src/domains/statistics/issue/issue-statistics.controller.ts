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

import {
  FindCountByDateResponseDto,
  FindCountByStatusResponseDto,
  FindCountResponseDto,
} from './dtos/responses';
import { IssueStatisticsService } from './issue-statistics.service';

@Controller('/statistics/issue')
export class IssueStatisticsController {
  constructor(
    private readonly issueStatisticsService: IssueStatisticsService,
  ) {}

  @ApiOkResponse({ type: FindCountResponseDto })
  @Get('/count')
  async getCount(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('projectId') projectId: number,
  ) {
    return FindCountResponseDto.transform(
      await this.issueStatisticsService.getCount({
        from,
        to,
        projectId,
      }),
    );
  }

  @ApiOkResponse({ type: FindCountByDateResponseDto })
  @Get('/count-by-date')
  async getCountByDate(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('interval') interval: 'day' | 'week' | 'month',
    @Query('projectId') projectId: number,
  ) {
    return FindCountByDateResponseDto.transform(
      await this.issueStatisticsService.getCountByDate({
        from,
        to,
        interval,
        projectId,
      }),
    );
  }

  @ApiOkResponse({ type: FindCountByStatusResponseDto })
  @Get('/count-by-status')
  async getCountByStatus(@Query('projectId') projectId: number) {
    return FindCountByStatusResponseDto.transform(
      await this.issueStatisticsService.getCountByStatus({
        projectId,
      }),
    );
  }
}
