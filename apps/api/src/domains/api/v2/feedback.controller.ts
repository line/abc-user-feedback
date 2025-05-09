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
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '@/domains/admin/auth/guards';
import { FindFeedbacksByChannelIdRequestDtoV2 } from '@/domains/admin/feedback/dtos/requests/find-feedbacks-by-channel-id-request-v2.dto';
import { FindFeedbacksByChannelIdResponseDto } from '../../admin/feedback/dtos/responses';
import { FeedbackService } from '../../admin/feedback/feedback.service';

@ApiTags('feedbacks-v2')
@Controller('/v2/projects/:projectId/channels/:channelId')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
export class FeedbackV2Controller {
  constructor(private readonly feedbackService: FeedbackService) {}
  @ApiOperation({
    summary: 'Search Feedbacks by Channel (V2)',
    description: `Searches for feedback entries by channel ID with various filters.`,
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'channelId',
    type: Number,
    description: 'Channel id',
    example: 1,
  })
  @ApiBody({ type: FindFeedbacksByChannelIdRequestDtoV2, required: false })
  @ApiOkResponse({ type: FindFeedbacksByChannelIdResponseDto })
  @Post('feedbacks/search')
  async findByChannelId(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: FindFeedbacksByChannelIdRequestDtoV2,
  ) {
    return FindFeedbacksByChannelIdResponseDto.transform(
      await this.feedbackService.findByChannelIdV2({ ...body, channelId }),
    );
  }
}
