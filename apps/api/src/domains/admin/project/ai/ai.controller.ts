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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import { AIService } from './ai.service';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import {
  CreateAIFieldTemplateRequestDto,
  CreateAIIssueTemplateRequestDto,
  GetAIIssuePlaygroundResultRequestDto,
  GetAIPlaygroundResultRequestDto,
  ProcessAIFieldRequestDto,
  ProcessSingleAIFieldRequestDto,
  UpdateAIIntegrationsRequestDto,
  ValidteAPIKeyRequestDto,
} from './dtos/requests';
import {
  CreateAIFieldTemplateResponseDto,
  CreateAIIntegrationsResponseDto,
  CreateAIIssueTemplateResponseDto,
  GetAIFieldTemplatesResponseDto,
  GetAIIntegrationResponseDto,
  GetAIIntegrationsModelsResponseDto,
  GetAIIssuePlaygroundResultResponseDto,
  GetAIIssueRecommendResponseDto,
  GetAIIssueTemplatesResponseDto,
  GetAIPlaygroundResultResponseDto,
  GetAIUsagesResponseDto,
  ValidateAPIKeyResponseDto,
} from './dtos/responses';

@ApiTags('ai')
@Controller('/admin/projects/:projectId/ai')
@ApiBearerAuth()
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @ApiOkResponse({ type: ValidateAPIKeyResponseDto })
  @ApiParam({ name: 'projectId', type: Number })
  @Post('validate')
  async validateAPIKey(@Body() body: ValidteAPIKeyRequestDto) {
    return this.aiService.validateAPIKey(
      body.provider,
      body.apiKey,
      body.endpointUrl,
    );
  }

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: GetAIIntegrationResponseDto })
  @Get('integrations')
  async getIntegration(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIIntegrationResponseDto.transform(
      await this.aiService.getIntegration(projectId),
    );
  }

  @RequirePermission(PermissionEnum.project_genai_update)
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

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: GetAIIntegrationsModelsResponseDto })
  @Get('integrations/models')
  async getModels(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIIntegrationsModelsResponseDto.transform({
      models: await this.aiService.getModels(projectId),
    });
  }

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: [GetAIFieldTemplatesResponseDto] })
  @Get('fieldTemplates')
  async getFieldTemplates(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIFieldTemplatesResponseDto.transform(
      await this.aiService.findFieldTemplatesByProjectId(projectId),
    );
  }

  @RequirePermission(PermissionEnum.project_genai_update)
  @ApiCreatedResponse({ type: CreateAIFieldTemplateResponseDto })
  @ApiOkResponse()
  @Post('fieldTemplates/new')
  async createNewFieldTemplate(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateAIFieldTemplateRequestDto,
  ) {
    return CreateAIFieldTemplateResponseDto.transform(
      await this.aiService.createNewFieldTemplate({ ...body, projectId }),
    );
  }

  @RequirePermission(PermissionEnum.project_genai_update)
  @Put('fieldTemplates/:templateId')
  async updateFieldTemplate(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() body: CreateAIFieldTemplateRequestDto,
  ) {
    await this.aiService.updateFieldTemplate({
      ...body,
      projectId,
      templateId,
    });
  }

  @RequirePermission(PermissionEnum.project_genai_update)
  @Delete('fieldTemplates/:templateId')
  async deleteFieldTemplate(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('templateId', ParseIntPipe) templateId: number,
  ) {
    await this.aiService.deleteFieldTemplateById(projectId, templateId);
  }

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: [GetAIIssueTemplatesResponseDto] })
  @Get('issueTemplates')
  async getIssueTemplates(@Param('projectId', ParseIntPipe) projectId: number) {
    return GetAIIssueTemplatesResponseDto.transform(
      await this.aiService.findIssueTemplatesByProjectId(projectId),
    );
  }

  @RequirePermission(PermissionEnum.project_genai_update)
  @ApiCreatedResponse({ type: CreateAIIssueTemplateResponseDto })
  @ApiOkResponse()
  @Post('issueTemplates/new')
  async createNewIssueTemplate(
    @Param('projectId', ParseIntPipe) _projectId: number,
    @Body() body: CreateAIIssueTemplateRequestDto,
  ) {
    return CreateAIIssueTemplateResponseDto.transform(
      await this.aiService.createNewIssueTemplate({ ...body }),
    );
  }

  @RequirePermission(PermissionEnum.project_genai_update)
  @Put('issueTemplates/:templateId')
  async updateIssueTemplate(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Body() body: CreateAIIssueTemplateRequestDto,
  ) {
    await this.aiService.updateIssueTemplate({
      ...body,
      templateId,
    });
  }

  @RequirePermission(PermissionEnum.project_genai_update)
  @Delete('issueTemplates/:templateId')
  async deleteIssueTemplate(
    @Param('templateId', ParseIntPipe) templateId: number,
  ) {
    await this.aiService.deleteIssueTemplateById(templateId);
  }

  @RequirePermission(PermissionEnum.feedback_update)
  @ApiOkResponse()
  @ApiParam({ name: 'projectId', type: Number })
  @Post('process')
  async processAIFields(@Body() body: ProcessAIFieldRequestDto) {
    await this.aiService.processFeedbacksAIFields(body.feedbackIds);
  }

  @RequirePermission(PermissionEnum.feedback_update)
  @ApiOkResponse()
  @ApiParam({ name: 'projectId', type: Number })
  @Post('process/field')
  async processAIField(@Body() body: ProcessSingleAIFieldRequestDto) {
    await this.aiService.processAIField(body.feedbackId, body.aiFieldId);
  }

  @RequirePermission(PermissionEnum.project_genai_read)
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

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: GetAIIssueRecommendResponseDto })
  @ApiParam({ name: 'projectId', type: Number })
  @Post('issueRecommend/:feedbackId')
  async recommendAIIssue(
    @Param('feedbackId', ParseIntPipe) feedbackId: number,
  ) {
    return GetAIIssueRecommendResponseDto.transform(
      await this.aiService.recommendAIIssue(feedbackId),
    );
  }

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: GetAIIssuePlaygroundResultResponseDto })
  @Post('issueRecommend/playground/test')
  async getAIIssuePlaygroundResult(
    @Param('projectId', ParseIntPipe) _projectId: number,
    @Body() body: GetAIIssuePlaygroundResultRequestDto,
  ) {
    return GetAIIssuePlaygroundResultResponseDto.transform({
      result: await this.aiService.getIssuePlaygroundPromptResult({
        ...body,
      }),
    });
  }

  @RequirePermission(PermissionEnum.project_genai_read)
  @ApiOkResponse({ type: [GetAIUsagesResponseDto] })
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
