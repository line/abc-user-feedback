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
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ChannelService } from '../services/channel.service';
import { CreateChannelDto } from '../services/dtos';
import {
  CreateChannelRequestDto,
  FindChannelsByProjectIdRequestDto,
  UpdateChannelRequestDto,
} from './dtos/requests';
import {
  CreateChannelResponseDto,
  FindChannelByIdResponseDto,
  FindChannelsByProjectIdResponseDto,
  UpdateChannelResponseDto,
} from './dtos/responses';

@ApiTags('channel')
@Controller()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiCreatedResponse({ type: CreateChannelResponseDto })
  @Post('/projects/:projectId/channels')
  async create(
    @Param('projectId') projectId: string,
    @Body() body: CreateChannelRequestDto,
  ) {
    return CreateChannelResponseDto.transform(
      await this.channelService.create(
        CreateChannelDto.from({ ...body, projectId }),
      ),
    );
  }

  @ApiOkResponse({ type: FindChannelsByProjectIdResponseDto })
  @Get('/projects/:projectId/channels')
  async findAllByProjectId(
    @Param('projectId') projectId: string,
    @Query() query: FindChannelsByProjectIdRequestDto,
  ) {
    const { keyword, limit, page } = query;
    return FindChannelsByProjectIdResponseDto.transform(
      await this.channelService.findAllByProjectId({
        options: { limit, page },
        keyword,
        projectId,
      }),
    );
  }

  @ApiOkResponse({ type: FindChannelByIdResponseDto })
  @Get('/channels/:id')
  async findOne(@Param('id') channelId: string) {
    return FindChannelByIdResponseDto.transform(
      await this.channelService.findById({ channelId }),
    );
  }

  @ApiOkResponse({ type: UpdateChannelResponseDto })
  @Put('/channels/:id')
  async updateOne(
    @Param('id') channelId: string,
    @Body() body: UpdateChannelRequestDto,
  ) {
    return UpdateChannelResponseDto.transform(
      await this.channelService.update({ ...body, channelId }),
    );
  }
}
