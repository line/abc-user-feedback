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
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/domains/admin/auth/guards';
import { PermissionEnum } from '@/domains/admin/project/role/permission.enum';
import { RequirePermission } from '@/domains/admin/project/role/require-permission.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos';
import {
  CreateChannelRequestDto,
  FindChannelsByProjectIdRequestDto,
  ImageUploadUrlTestRequestDto,
  UpdateChannelFieldsRequestDto,
  UpdateChannelRequestDto,
} from './dtos/requests';
import {
  CreateChannelResponseDto,
  FindChannelByIdResponseDto,
  FindChannelsByProjectIdResponseDto,
  ImageUploadUrlTestResponseDto,
} from './dtos/responses';

@ApiTags('channel')
@Controller('/admin/projects/:projectId/channels')
@ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get('/name-check')
  @ApiOkResponse({ type: Boolean })
  async checkName(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query('name') name: string,
  ) {
    return this.channelService.checkName({ projectId, name });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FindChannelByIdResponseDto })
  @Get('/:channelId')
  async findOne(@Param('channelId', ParseIntPipe) channelId: number) {
    return FindChannelByIdResponseDto.transform(
      await this.channelService.findById({ channelId }),
    );
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.channel_update)
  @Put('/:channelId')
  async updateOne(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() body: UpdateChannelRequestDto,
  ) {
    await this.channelService.updateInfo(channelId, body);
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.channel_field_update)
  @Put('/:channelId/fields')
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

  @ApiParam({ name: 'projectId', type: Number })
  @ApiOkResponse({ type: ImageUploadUrlTestResponseDto })
  @Post('/image-upload-url-test')
  async getImageUploadUrlTest(
    @Body()
    {
      accessKeyId,
      secretAccessKey,
      endpoint,
      region,
      bucket,
    }: ImageUploadUrlTestRequestDto,
  ) {
    return {
      success: await this.channelService.isValidImageConfig({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region,
        bucket,
      }),
    };
  }

  @ApiParam({ name: 'projectId', type: Number })
  @ApiParam({ name: 'channelId', type: Number })
  @ApiQuery({
    name: 'imageKey',
    type: String,
    required: true,
    description: 'Image Key for the pre-signed url download',
    example: 'test-image-key.jpg',
  })
  @ApiOkResponse({
    type: String,
    description: 'Presigned url for image upload',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:channelId/image-download-url')
  async getImageDownloadUrl(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Query('imageKey') imageKey: string,
  ) {
    if (!imageKey) {
      throw new BadRequestException('imageKey is required in query parameter');
    }
    const channel = await this.channelService.findById({ channelId });
    if (channel.project.id !== projectId) {
      throw new BadRequestException('Invalid channel id');
    }
    if (!channel.imageConfig) {
      throw new BadRequestException('No image config in this channel');
    }

    return await this.channelService.createImageDownloadUrl({
      accessKeyId: channel.imageConfig.accessKeyId,
      secretAccessKey: channel.imageConfig.secretAccessKey,
      endpoint: channel.imageConfig.endpoint,
      region: channel.imageConfig.region,
      bucket: channel.imageConfig.bucket,
      imageKey,
    });
  }
}
