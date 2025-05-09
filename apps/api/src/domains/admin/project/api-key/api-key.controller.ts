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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dtos';
import { CreateApiKeyRequestDto } from './dtos/requests';
import {
  CreateApiKeyResponseDto,
  FindApiKeysResponseDto,
} from './dtos/responses';

@ApiTags('api-keys')
@Controller('/admin/projects/:projectId/api-keys')
@ApiBearerAuth()
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @RequirePermission(PermissionEnum.project_apikey_create)
  @ApiCreatedResponse({ type: CreateApiKeyResponseDto })
  @Post()
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateApiKeyRequestDto,
  ) {
    return CreateApiKeyResponseDto.transform(
      await this.apiKeyService.create(
        CreateApiKeyDto.from({ ...body, projectId }),
      ),
    );
  }

  @RequirePermission(PermissionEnum.project_apikey_read)
  @ApiOkResponse({ type: FindApiKeysResponseDto })
  @Get()
  async findAll(@Param('projectId', ParseIntPipe) projectId: number) {
    return FindApiKeysResponseDto.transform({
      items: await this.apiKeyService.findAllByProjectId(projectId),
    });
  }

  @RequirePermission(PermissionEnum.project_apikey_update)
  @Delete('/:apiKeyId/soft')
  async softDelete(@Param('apiKeyId', ParseIntPipe) apiKeyId: number) {
    await this.apiKeyService.softDeleteById(apiKeyId);
  }

  @RequirePermission(PermissionEnum.project_apikey_update)
  @Delete('/:apiKeyId/recover')
  async recover(@Param('apiKeyId', ParseIntPipe) apiKeyId: number) {
    await this.apiKeyService.recoverById(apiKeyId);
  }

  @RequirePermission(PermissionEnum.project_apikey_delete)
  @Delete('/:apiKeyId')
  async delete(@Param('apiKeyId', ParseIntPipe) apiKeyId: number) {
    await this.apiKeyService.deleteById(apiKeyId);
  }
}
