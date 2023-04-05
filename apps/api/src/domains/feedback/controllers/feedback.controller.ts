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
import { Body, Controller, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import * as XLSX from 'xlsx';

import { FeedbackService } from '../services/feedback.service';
import {
  ExportFeedbacksRequestDto,
  FindFeedbacksByChannelIdRequestDto,
  UpsertFeedbackItemRequestDto,
} from './dtos/requests';
import { FindFeedbacksByChannelIdResponseDto } from './dtos/responses';

@Controller('/channels/:channelId/feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(
    @Param('channelId') channelId: string,
    @Body() body: Record<string, any>,
  ) {
    const { id } = await this.feedbackService.create({ data: body, channelId });
    return { id };
  }

  @ApiOkResponse({ type: FindFeedbacksByChannelIdResponseDto })
  @Post('search')
  async findByChannelId(
    @Param('channelId') channelId: string,
    @Body() body: FindFeedbacksByChannelIdRequestDto,
  ) {
    return await this.feedbackService.findByChannelId({ ...body, channelId });
  }

  @Post('export')
  async exportFeedbacks(
    @Param('channelId') channelId: string,
    @Body() body: ExportFeedbacksRequestDto,
    @Res() res: FastifyReply,
  ) {
    const { type = 'csv', query } = body;
    if (type === 'xlsx') {
      res.type(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
    } else if (type === 'csv') {
      res.type('text/csv');
    }

    const filename = `${new Date().toISOString()}.${type}`;

    res.header('Content-Disposition', `attachment; filename="${filename}"`);

    const { items } = await this.feedbackService.findByChannelId({
      query,
      channelId,
      limit: 1000,
      page: 1,
    });

    const workbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(items);

    XLSX.utils.book_append_sheet(workbook, newWorksheet, 'feedback');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return res.send(buffer);
  }

  @Put('/:feedbackId/field/:fieldId')
  async upsertFeedbackItem(
    @Param('channelId') channelId: string,
    @Param('feedbackId') feedbackId: string,
    @Param('fieldId') fieldId: string,
    @Body() { value }: UpsertFeedbackItemRequestDto,
  ) {
    await this.feedbackService.upsertFeedbackItem({
      channelId,
      feedbackId,
      fieldId,
      value,
    });
  }
}
