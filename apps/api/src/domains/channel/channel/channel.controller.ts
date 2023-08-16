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
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionEnum } from '@/domains/project/role/permission.enum';
import { RequirePermission } from '@/domains/project/role/require-permission.decorator';

import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos';
import {
  CreateChannelRequestDto,
  FindChannelsByProjectIdRequestDto,
  UpdateChannelFieldsRequestDto,
  UpdateChannelRequestDto,
} from './dtos/requests';
import {
  CreateChannelResponseDto,
  FindChannelByIdResponseDto,
  FindChannelsByProjectIdResponseDto,
} from './dtos/responses';

@ApiTags('channel')
@Controller('/projects/:projectId/channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @RequirePermission(PermissionEnum.channel_create)
  @ApiCreatedResponse({ type: CreateChannelResponseDto })
  @Post('/')
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateChannelRequestDto,
  ) {
    return CreateChannelResponseDto.transform(
      await this.channelService.create(
        CreateChannelDto.from({ ...body, projectId }),
      ),
    );
  }

  @RequirePermission(PermissionEnum.channel_read)
  @ApiOkResponse({ type: FindChannelsByProjectIdResponseDto })
  @Get('/')
  async findAllByProjectId(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() query: FindChannelsByProjectIdRequestDto,
  ) {
    const { searchText, limit, page } = query;
    return FindChannelsByProjectIdResponseDto.transform(
      await this.channelService.findAllByProjectId({
        options: { limit, page },
        searchText,
        projectId,
      }),
    );
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.channel_read)
  @ApiOkResponse({ type: FindChannelByIdResponseDto })
  @Get('/:channelId')
  async findOne(@Param('channelId', ParseIntPipe) channelId: number) {
    return FindChannelByIdResponseDto.transform(
      await this.channelService.findById({ channelId }),
    );
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.channel_update)
  @Put('/channels/:channelId')
  async updateOne(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: UpdateChannelRequestDto,
  ) {
    await this.channelService.updateInfo(channelId, body);
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.channel_field_update)
  @Put('/channels/:channelId/fields')
  async updateFields(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: UpdateChannelFieldsRequestDto,
  ) {
    await this.channelService.updateFields(channelId, body);
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.channel_delete)
  @Delete('/:channelId')
  async delete(@Param('channelId', ParseIntPipe) channelId: number) {
    await this.channelService.deleteById(channelId);
  }
}
