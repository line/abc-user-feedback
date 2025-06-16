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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import { AIService } from './ai.service';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import {
  CreateAITemplateRequestDto,
  GetAIPlaygroundResultRequestDto,
  UpdateAIIntegrationsRequestDto,
  ValidteAPIKeyRequestDto,
} from './dtos/requests';
import {
  CreateAIIntegrationsResponseDto,
  CreateAITemplateResponseDto,
  GetAIIntegrationResponseDto,
  GetAIIntegrationsModelsResponseDto,
  GetAIPlaygroundResultResponseDto,
  GetAITemplatesResponseDto,
  GetAIUsagesResponseDto,
  ValidateAPIKeyResponseDto,
} from './dtos/responses';

@ApiTags('ai')
@Controller('/admin/projects/:projectId/ai')
@ApiBearerAuth()
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @ApiOkResponse({ type: ValidateAPIKeyResponseDto })
  @Post('validate')
  async validateAPIKey(@Body() body: ValidteAPIKeyRequestDto) {
    return this.aiService.validateAPIKey(
      body.provider,
      body.apiKey,
      body.endpointUrl,
    );
  }

  @RequirePermission(PermissionEnum.generative_ai_read)
  @ApiCreatedResponse({ type: GetAIIntegrationResponseDto })
  @Get('integrations')
  async getIntegration(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIIntegrationResponseDto.transform(
      await this.aiService.getOrCreateIntegration(projectId),
    );
  }

  @RequirePermission(PermissionEnum.generative_ai_update)
  @ApiCreatedResponse({ type: CreateAIIntegrationsResponseDto })
  @Put('integrations')
  async updateIntegration(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: UpdateAIIntegrationsRequestDto,
  ) {
    return CreateAIIntegrationsResponseDto.transform(
      await this.aiService.upsertIntegration(
        CreateAIIntegrationsDto.from({ ...body, projectId }),
      ),
    );
  }

  @RequirePermission(PermissionEnum.generative_ai_read)
  @ApiOkResponse({ type: GetAIIntegrationsModelsResponseDto })
  @Get('integrations/models')
  async getModels(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIIntegrationsModelsResponseDto.transform({
      models: await this.aiService.getModels(projectId),
    });
  }

  @RequirePermission(PermissionEnum.generative_ai_read)
  @ApiOkResponse({ type: GetAITemplatesResponseDto })
  @Get('templates')
  async getTemplates(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAITemplatesResponseDto.transform(
      await this.aiService.findTemplatesByProjectId(projectId),
    );
  }

  @RequirePermission(PermissionEnum.generative_ai_update)
  @ApiOkResponse()
  @Post('templates/default')
  async createDefaultTemplates(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    await this.aiService.createDefaultTemplates(projectId);
  }

  @RequirePermission(PermissionEnum.generative_ai_update)
  @ApiCreatedResponse({ type: CreateAITemplateResponseDto })
  @ApiOkResponse()
  @Post('templates/new')
  async createNewTemplate(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateAITemplateRequestDto,
  ) {
    return CreateAITemplateResponseDto.transform(
      await this.aiService.createNewTemplate({ ...body, projectId }),
    );
  }

  @RequirePermission(PermissionEnum.generative_ai_update)
  @Put('templates/:templateId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() body: CreateAITemplateRequestDto,
  ) {
    await this.aiService.updateTemplate({ ...body, projectId, templateId });
  }

  @RequirePermission(PermissionEnum.generative_ai_update)
  @Delete('templates/:templateId')
  async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('templateId', ParseIntPipe) templateId: number,
  ) {
    await this.aiService.deleteTemplateById(projectId, templateId);
  }

  @RequirePermission(PermissionEnum.generative_ai_read)
  @ApiOkResponse()
  @Post('process')
  processAIFields(@Body() body: { feedbackIds: number[] }) {
    this.aiService.processAIFields(body.feedbackIds);
  }

  @RequirePermission(PermissionEnum.generative_ai_read)
  @ApiOkResponse({ type: GetAIPlaygroundResultResponseDto })
  @Post('playground/test')
  async getPlaygroundResult(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: GetAIPlaygroundResultRequestDto,
  ) {
    return GetAIPlaygroundResultResponseDto.transform({
      result: await this.aiService.getPlaygroundPromptResult({
        ...body,
        projectId,
      }),
    });
  }

  @RequirePermission(PermissionEnum.generative_ai_read)
  @ApiOkResponse({ type: GetAIUsagesResponseDto })
  @Get('usages')
  async getUsages(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return GetAIUsagesResponseDto.transform(
      await this.aiService.getUsages(projectId, from, to),
    );
  }
}
