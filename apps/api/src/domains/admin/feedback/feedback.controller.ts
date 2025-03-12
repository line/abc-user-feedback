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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { DateTime } from 'luxon';

import { ApiKeyAuthGuard, JwtAuthGuard } from '@/domains/admin/auth/guards';
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
} from './dtos/requests';
import { FindFeedbacksByChannelIdRequestDtoV2 } from './dtos/requests/find-feedbacks-by-channel-id-request-v2.dto';
import {
  AddIssueResponseDto,
  FindFeedbacksByChannelIdResponseDto,
} from './dtos/responses';
import { FeedbackService } from './feedback.service';

@Controller('/admin/projects/:projectId/channels/:channelId/feedbacks')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly channelService: ChannelService,
    private readonly historyService: HistoryService,
  ) {}

  @ApiParam({ name: 'projectId', type: Number })
  @ApiSecurity('apiKey')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', type: Number })
  @ApiOkResponse({ type: FindFeedbacksByChannelIdResponseDto })
  @Post('search')
  async findByChannelId(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: FindFeedbacksByChannelIdRequestDtoV2,
  ) {
    return FindFeedbacksByChannelIdResponseDto.transform(
      await this.feedbackService.findByChannelIdV2({ ...body, channelId }),
    );
  }

  @RequirePermission(PermissionEnum.feedback_issue_update)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Post('export')
  async exportFeedbacks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: ExportFeedbacksRequestDto,
    @Res() res: FastifyReply,
    @CurrentUser() user: UserDto,
  ) {
    const { queries, operator, sort, type, fieldIds, filterFeedbackIds } = body;
    const channel = await this.channelService.findById({ channelId });
    const projectName = channel.project.name;
    const channelName = channel.name;

    const { streamableFile, feedbackIds } =
      await this.feedbackService.generateFile({
        projectId,
        channelId,
        queries,
        operator,
        sort,
        type,
        fieldIds,
        filterFeedbackIds,
      });
    const stream = streamableFile.getStream();

    const filename = `UFB_${projectName}_${channelName}_Feedback_${DateTime.utc().toFormat(
      'yyyy-MM-dd',
    )}.${type}`;
    void res.header(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );

    switch (type) {
      case 'xlsx':
        void res.type(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        break;
      case 'csv':
        void res.type('text/csv');
        break;
    }

    void res.send(stream);

    void this.historyService.createHistory({
      action: HistoryActionEnum.Download,
      entity: { feedbackIds },
      entityName: EntityNameEnum.Channel,
      userId: user.id,
      entityId: channelId,
    });
  }

  @RequirePermission(PermissionEnum.feedback_update)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', type: Number })
  @Delete()
  async deleteMany(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() { feedbackIds }: DeleteFeedbacksRequestDto,
  ) {
    await this.feedbackService.deleteByIds({ channelId, feedbackIds });
  }
}
