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
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import {
  CreateWebhookRequestDto,
  UpdateWebhookRequestDto,
} from './dtos/requests';
import {
  CreateWebhookResponseDto,
  GetWebhookByIdResponseDto,
  GetWebhooksByProjectIdResponseDto,
  UpdateWebhookResponseDto,
} from './dtos/responses';
import { WebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('/admin/projects/:projectId/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @RequirePermission(PermissionEnum.project_webhook_create)
  @ApiCreatedResponse({ type: CreateWebhookResponseDto })
  @Post()
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() webhook: CreateWebhookRequestDto,
  ) {
    return CreateWebhookResponseDto.transform(
      await this.webhookService.create({ projectId, ...webhook }),
    );
  }

  @RequirePermission(PermissionEnum.project_webhook_read)
  @ApiOkResponse({ type: GetWebhookByIdResponseDto })
  @Get('/:webhookId')
  async get(@Param('webhookId', ParseIntPipe) webhookId: number) {
    return GetWebhookByIdResponseDto.transform(
      await this.webhookService.findById(webhookId),
    );
  }

  @RequirePermission(PermissionEnum.project_webhook_read)
  @ApiOkResponse({ type: GetWebhooksByProjectIdResponseDto })
  @Get()
  async getByProjectId(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetWebhooksByProjectIdResponseDto.transform({
      items: await this.webhookService.findByProjectId(projectId),
    });
  }

  @RequirePermission(PermissionEnum.project_webhook_update)
  @ApiOkResponse({ type: UpdateWebhookResponseDto })
  @Put('/:webhookId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('webhookId', ParseIntPipe) webhookId: number,
    @Body() webhook: UpdateWebhookRequestDto,
  ) {
    return UpdateWebhookResponseDto.transform(
      await this.webhookService.update({
        projectId,
        id: webhookId,
        ...webhook,
      }),
    );
  }

  @RequirePermission(PermissionEnum.project_webhook_delete)
  @ApiOkResponse({ type: GetWebhookByIdResponseDto })
  @Delete('/:webhookId')
  async delete(@Param('webhookId', ParseIntPipe) webhookId: number) {
    return GetWebhookByIdResponseDto.transform(
      await this.webhookService.delete(webhookId),
    );
  }
}
