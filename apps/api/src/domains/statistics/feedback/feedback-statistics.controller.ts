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
  FindCountByDateByChannelResponseDto,
  FindCountResponseDto,
  FindIssuedRateResponseDto,
} from './dtos/responses';
import { FeedbackStatisticsService } from './feedback-statistics.service';

@Controller('/statistics/feedback')
export class FeedbackStatisticsController {
  constructor(
    private readonly feedbackStatisticsService: FeedbackStatisticsService,
  ) {}

  @ApiOkResponse({ type: FindCountByDateByChannelResponseDto })
  @Get()
  async getCountByDateByChannel(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('interval') interval: 'day' | 'week' | 'month',
    @Query('channelIds') channelIds: string,
  ) {
    const channelIdsArray = channelIds
      .split(',')
      .map((v) => parseInt(v, 10))
      .filter((v) => !isNaN(v));

    return FindCountByDateByChannelResponseDto.transform(
      await this.feedbackStatisticsService.getCountByDateByChannel({
        from,
        to,
        interval,
        channelIds: channelIdsArray,
      }),
    );
  }

  @ApiOkResponse({ type: FindCountResponseDto })
  @Get('/count')
  async getCount(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('projectId') projectId: number,
  ) {
    return FindCountResponseDto.transform(
      await this.feedbackStatisticsService.getCount({
        from,
        to,
        projectId,
      }),
    );
  }

  @ApiOkResponse({ type: FindIssuedRateResponseDto })
  @Get('/issued-ratio')
  async getIssuedRatio(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('projectId') projectId: number,
  ) {
    return FindIssuedRateResponseDto.transform(
      await this.feedbackStatisticsService.getIssuedRatio({
        from,
        to,
        projectId,
      }),
    );
  }
}
