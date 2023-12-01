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
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { FastifyReply } from 'fastify';

import { ApiKeyAuthGuard } from '@/domains/auth/guards';
import { ChannelService } from '../channel/channel/channel.service';
import { HistoryActionEnum } from '../history/history-action.enum';
import { EntityNameEnum } from '../history/history-entity.enum';
import { HistoryService } from '../history/history.service';
import { PermissionEnum } from '../project/role/permission.enum';
import { RequirePermission } from '../project/role/require-permission.decorator';
import { CurrentUser } from '../user/decorators';
import { UserDto } from '../user/dtos';
import {
  DeleteFeedbacksRequestDto,
  ExportFeedbacksRequestDto,
  FindFeedbacksByChannelIdRequestDto,
} from './dtos/requests';
import {
  AddIssueResponseDto,
  FindFeedbacksByChannelIdResponseDto,
} from './dtos/responses';
import { FeedbackService } from './feedback.service';

@Controller('/projects/:projectId/channels/:channelId/feedbacks')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly channelService: ChannelService,
    private readonly historyService: HistoryService,
  ) {}

  @ApiParam({ name: 'projectId', type: Number })
  @UseGuards(ApiKeyAuthGuard)
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

  @RequirePermission(PermissionEnum.feedback_read)
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

  @RequirePermission(PermissionEnum.feedback_issue_update)
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

  @RequirePermission(PermissionEnum.feedback_issue_update)
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
  @RequirePermission(PermissionEnum.feedback_download_read)
  @Post('export')
  async exportFeedbacks(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: ExportFeedbacksRequestDto,
    @Res() res: FastifyReply,
    @CurrentUser() user: UserDto,
  ) {
    const { query, sort, type, fieldIds } = body;
    const channel = await this.channelService.findById({ channelId });
    const projectName = channel.project.name;
    const channelName = channel.name;

    const { streamableFile, feedbackIds } =
      await this.feedbackService.generateFile({
        channelId,
        query,
        sort,
        type,
        fieldIds,
      });
    const stream = streamableFile.getStream();

    const filename = `UFB_${projectName}_${channelName}_Feedback_${dayjs().format(
      'YYYY-MM-DD',
    )}.${type}`;
    res.header('Content-Disposition', `attachment; filename="${filename}"`);

    if (type === 'xlsx') {
      res.type(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
    } else if (type === 'csv') {
      res.type('text/csv');
    }

    res.send(stream);

    this.historyService.createHistory({
      action: HistoryActionEnum.Download,
      entity: { feedbackIds },
      entityName: EntityNameEnum.Channel,
      userId: user.id,
      entityId: channelId,
    });
  }

  @RequirePermission(PermissionEnum.feedback_update)
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

  @RequirePermission(PermissionEnum.feedback_delete)
  @ApiParam({ name: 'projectId', type: Number })
  @Delete()
  async deleteMany(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() { feedbackIds }: DeleteFeedbacksRequestDto,
  ) {
    await this.feedbackService.deleteByIds({ channelId, feedbackIds });
  }
}
