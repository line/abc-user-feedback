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

import { AIService } from './ai.service';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import { CreateAIIntegrationsRequestDto } from './dtos/requests/create-ai-integrations-request.dto';
import { CreateAIIntegrationsResponseDto } from './dtos/responses/create-ai-integrations-response.dto';
import { GetAIIntegrationsModelsResponseDto } from './dtos/responses/get-ai-integrations-models-response.dto';

@ApiTags('ai')
@Controller('/admin/projects/:projectId/ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreateAIIntegrationsResponseDto })
  @Post('integrations')
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateAIIntegrationsRequestDto,
  ) {
    return CreateAIIntegrationsResponseDto.transform(
      await this.aiService.upsert(
        CreateAIIntegrationsDto.from({ ...body, projectId }),
      ),
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetAIIntegrationsModelsResponseDto })
  @Get('integrations/models')
  async getModels(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIIntegrationsModelsResponseDto.transform({
      models: await this.aiService.getModels(projectId),
    });
  }
}
