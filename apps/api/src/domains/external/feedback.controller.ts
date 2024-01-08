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
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '@/domains/auth/guards';
import { ChannelService } from '../channel/channel/channel.service';
import {
  DeleteFeedbacksRequestDto,
  FindFeedbacksByChannelIdRequestDto,
} from '../feedback/dtos/requests';
import {
  AddIssueResponseDto,
  FindFeedbacksByChannelIdResponseDto,
} from '../feedback/dtos/responses';
import { FeedbackService } from '../feedback/feedback.service';

@Controller('/external/projects/:projectId/channels/:channelId/feedbacks')
@UseGuards(ApiKeyAuthGuard)
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly channelService: ChannelService,
  ) {}

  @ApiParam({ name: 'projectId', type: Number })
  @Post()
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: Record<string, any> & { issueNames?: string[] },
  ) {
    const channel = await this.channelService.findById({ channelId });
    if (channel.project.id !== projectId) {
      throw new BadRequestException('Invalid channel id');
    }

    const { id } = await this.feedbackService.create({ data: body, channelId });
    return { id };
  }

  @ApiParam({ name: 'projectId', type: Number })
  @ApiOkResponse({ type: FindFeedbacksByChannelIdResponseDto })
  @Post('search')
  async findByChannelId(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: FindFeedbacksByChannelIdRequestDto,
  ) {
    return FindFeedbacksByChannelIdResponseDto.transform(
      await this.feedbackService.findByChannelId({ ...body, channelId }),
    );
  }

  @ApiParam({ name: 'projectId', type: Number })
  @ApiOkResponse({ type: AddIssueResponseDto })
  @Post(':feedbackId/issue/:issueId')
  async addIssue(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('feedbackId', ParseIntPipe) feedbackId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return await this.feedbackService.addIssue({
      issueId,
      channelId,
      feedbackId,
    });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @ApiOkResponse({ type: AddIssueResponseDto })
  @Delete(':feedbackId/issue/:issueId')
  async removeIssue(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('feedbackId', ParseIntPipe) feedbackId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return await this.feedbackService.removeIssue({
      issueId,
      channelId,
      feedbackId,
    });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @Put(':feedbackId')
  async updateFeedback(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('feedbackId', ParseIntPipe) feedbackId: number,
    @Body() body: Record<string, any>,
  ) {
    await this.feedbackService.updateFeedback({
      channelId,
      feedbackId,
      data: body,
    });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @Delete()
  async deleteMany(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() { feedbackIds }: DeleteFeedbacksRequestDto,
  ) {
    await this.feedbackService.deleteByIds({ channelId, feedbackIds });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @Get(':feedbackId')
  async findFeedback(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('feedbackId', ParseIntPipe) feedbackId: number,
  ) {
    console.log(123);
    return await this.feedbackService.findById({
      channelId,
      feedbackId,
    });
  }
}
