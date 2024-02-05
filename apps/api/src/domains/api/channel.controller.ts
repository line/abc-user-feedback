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
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '@/domains/admin/auth/guards';
import { ChannelService } from '../admin/channel/channel/channel.service';

@ApiTags('channels')
@Controller('/projects/:projectId/channels/:channelId')
@UseGuards(ApiKeyAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

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
  @ApiOkResponse({
    type: String,
    description: 'Presigned url for image upload',
  })
  @Get('/image-upload-url')
  async getImageUploadUrl(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Query('extension') extension: string,
  ) {
    if (!extension) {
      throw new BadRequestException('Extension is required in query parameter');
    }
    const channel = await this.channelService.findById({ channelId });
    if (channel.project.id !== projectId) {
      throw new BadRequestException('Invalid channel id');
    }
    if (!channel.imageConfig) {
      throw new BadRequestException('No image config in this channel');
    }

    return await this.channelService.createImageUploadUrl({
      projectId,
      channelId,
      accessKeyId: channel.imageConfig.accessKeyId,
      secretAccessKey: channel.imageConfig.secretAccessKey,
      endpoint: channel.imageConfig.endpoint,
      region: channel.imageConfig.region,
      bucket: channel.imageConfig.bucket,
      extension,
    });
  }
}
