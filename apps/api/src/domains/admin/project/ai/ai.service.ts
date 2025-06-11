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
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { EventTypeEnum } from '@/common/enums/event-type.enum';
import { getCurrentMonth, getCurrentYear } from '@/utils/date-utils';
import { FieldEntity } from '../../channel/field/field.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { FeedbackMySQLService } from '../../feedback/feedback.mysql.service';
import { FeedbackOSService } from '../../feedback/feedback.os.service';
import { AIIntegrationsEntity } from './ai-integrations.entity';
import { AITemplatesEntity } from './ai-templates.entity';
import { AIUsagesEntity, UsageCategoryEnum } from './ai-usages.entity';
import { AIClient } from './ai.client';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import { CreateAITemplateDto } from './dtos/create-ai-template.dto';
import { GetAIPlaygroundResultDto } from './dtos/get-ai-playground-result.dto';
import { ValidateAPIKeyResponseDto } from './dtos/responses';
import { UpdateAITemplateDto } from './dtos/update-ai-template.dto';

@Injectable()
export class AIService {
  private logger = new Logger(AIService.name);

  constructor(
    private readonly feedbackMySQLService: FeedbackMySQLService,
    private readonly feedbackOSService: FeedbackOSService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,

    @InjectRepository(AIIntegrationsEntity)
    private readonly aiIntegrationsRepo: Repository<AIIntegrationsEntity>,

    @InjectRepository(AITemplatesEntity)
    private readonly aiTemplatesRepo: Repository<AITemplatesEntity>,

    @InjectRepository(AIUsagesEntity)
    private readonly aiUsagesRepo: Repository<AIUsagesEntity>,
  ) {}

  async validateAPIKey(
    provider: AIProvidersEnum,
    apiKey: string,
  ): Promise<ValidateAPIKeyResponseDto> {
    const client = new AIClient({
      apiKey,
      provider,
    });

    try {
      await client.validateAPIKey();
      return { valid: true };
    } catch (error) {
      this.logger.error(`API key validation failed for ${provider}`, error);
      return { valid: false, error: (error as Error).message };
    }
  }

  async getOrCreateIntegration(projectId: number) {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
      },
    });

    if (!integration) {
      return await this.upsertIntegration(
        CreateAIIntegrationsDto.from({
          projectId,
          provider: 'OPEN_AI',
          model: '',
          apiKey: '',
          endpointUrl: '',
          systemPrompt: '',
          temperature: 0.7,
        }),
      );
    }

    return {
      id: integration.id,
      provider: integration.provider,
      model: integration.model,
      apiKey: integration.apiKey,
      endpointUrl: integration.endpointUrl,
      systemPrompt: integration.systemPrompt,
      temperature: integration.temperature,
    };
  }

  @Transactional()
  async upsertIntegration(dto: CreateAIIntegrationsDto) {
    const existingIntegration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: dto.projectId,
        },
      },
    });

    if (!existingIntegration) {
      const newIntegration =
        CreateAIIntegrationsDto.toAIIntegrationsEntity(dto);
      await this.aiIntegrationsRepo.save(newIntegration);
      return newIntegration;
    }

    const updatedIntegration = {
      ...existingIntegration,
      ...dto,
    };
    await this.aiIntegrationsRepo.save(updatedIntegration);
    return updatedIntegration;
  }

  async findTemplatesByProjectId(projectId: number) {
    const templates = await this.aiTemplatesRepo.find({
      where: {
        project: {
          id: projectId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      prompt: template.prompt,
      autoProcessing: template.autoProcessing,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    }));
  }

  @Transactional()
  async createDefaultTemplates(projectId: number) {
    const templates = [
      {
        title: 'Feedback Summary',
        prompt: 'Summarize the following feedback within 2 sentences',
        autoProcessing: false,
      },
      {
        title: 'Feedback Sentiment Analysis',
        prompt: 'Analyze the sentiment of the following feedback',
        autoProcessing: false,
      },
      {
        title: 'Feedback Translation',
        prompt: 'Translate the following feedback to English',
        autoProcessing: false,
      },
      {
        title: 'Feedback Keyword Extraction',
        prompt: 'Extract the keywords from the following feedback',
        autoProcessing: false,
      },
    ];

    await this.aiTemplatesRepo.save(
      templates.map((template) =>
        AITemplatesEntity.from({
          ...template,
          projectId,
        }),
      ),
    );
  }

  @Transactional()
  async createNewTemplate(template: CreateAITemplateDto) {
    const newTemplate = AITemplatesEntity.from(template);
    await this.aiTemplatesRepo.save(newTemplate);

    return newTemplate;
  }

  @Transactional()
  async updateTemplate(template: UpdateAITemplateDto) {
    const existingTemplate = await this.aiTemplatesRepo.findOne({
      where: {
        id: template.templateId,
        project: {
          id: template.projectId,
        },
      },
    });
    if (!existingTemplate) {
      throw new BadRequestException('Template not found');
    }
    const updatedTemplate = {
      ...existingTemplate,
      ...template,
    };
    await this.aiTemplatesRepo.save(updatedTemplate);
    return updatedTemplate;
  }

  @Transactional()
  async deleteTemplateById(projectId: number, templateId: number) {
    const template = await this.aiTemplatesRepo.findOne({
      where: {
        id: templateId,
        project: {
          id: projectId,
        },
      },
    });

    if (!template) {
      throw new BadRequestException('Template not found');
    }

    await this.aiTemplatesRepo.delete(templateId);
  }

  async getModels(projectId: number) {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
      },
    });

    if (!integration) {
      return [];
    }

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    const models = await client.getModelList();

    return models;
  }

  private async saveAIUsage(
    usedTokens: number,
    provider: AIProvidersEnum,
    category: UsageCategoryEnum,
    projectId: number,
  ) {
    const aiUsage = await this.aiUsagesRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
        year: getCurrentYear(),
        month: getCurrentMonth(),
        category,
        provider,
      },
    });

    if (aiUsage) {
      aiUsage.usedTokens += usedTokens;
      await this.aiUsagesRepo.save(aiUsage);
      return;
    }

    const usage = AIUsagesEntity.from({
      year: getCurrentYear(),
      month: getCurrentMonth(),
      category,
      provider,
      usedTokens,
      projectId,
    });
    await this.aiUsagesRepo.save(usage);
  }

  private generatePromptTargetText(
    feedback: FeedbackEntity,
    aiTargetFields: FieldEntity[],
  ): string {
    return aiTargetFields.reduce((acc, field) => {
      if (field.key === 'issues') {
        const issues = feedback.issues
          .map((issue) => `${issue.name}: ${issue.description}`)
          .join(', ');
        return `${acc}\n${field.key}: ${issues}`;
      }

      let fieldValue = String(feedback.data[field.key]);

      if (field.key === 'createdAt') {
        fieldValue = feedback.createdAt.toISOString();
      } else if (field.key === 'updatedAt') {
        fieldValue = feedback.updatedAt.toISOString();
      }

      return `${acc}
        fieldName: ${field.name}
        fieldDesc: ${field.description}
        fieldValue: ${fieldValue}
        `;
    }, '');
  }

  @Transactional()
  async executeAIFieldPrompt(
    feedback: FeedbackEntity,
    aiField: FieldEntity,
    aiTargetFields: FieldEntity[],
  ) {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: feedback.channel.project.id,
        },
      },
    });

    if (!integration) {
      throw new BadRequestException('Integration not found');
    }

    if (!aiField.aiTemplate) {
      throw new BadRequestException('AI template not found');
    }

    const promptTargetText = this.generatePromptTargetText(
      feedback,
      aiTargetFields,
    );

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    const result = await client.executePrompt(
      integration.model,
      integration.temperature,
      integration.systemPrompt,
      aiField.aiTemplate.prompt,
      aiTargetFields.map((field) => field.key).join(', '),
      promptTargetText,
    );
    this.logger.log(`Result: ${result.content}`);
    feedback.data[aiField.key] = result.content;

    void this.saveAIUsage(
      result.usedTokens,
      integration.provider,
      UsageCategoryEnum.AI_FIELD,
      feedback.channel.project.id,
    );

    await this.feedbackMySQLService.updateFeedback({
      feedbackId: feedback.id,
      data: feedback.data,
    });

    if (this.configService.get('opensearch.use')) {
      await this.feedbackOSService.upsertFeedbackItem({
        feedbackId: feedback.id,
        data: feedback.data,
        channelId: feedback.channel.id,
      });
    }
  }

  processAIFields(feedbackIds: number[]) {
    this.logger.log(
      `Processing AI Field for feedback IDs: ${feedbackIds.toString()}`,
    );
    for (const feedbackId of feedbackIds) {
      this.eventEmitter.emit(EventTypeEnum.FEEDBACK_CREATION, {
        feedbackId: feedbackId,
        manual: true,
      });
    }
  }

  @Transactional()
  async getPlaygroundPromptResult(dto: GetAIPlaygroundResultDto) {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: dto.projectId,
        },
      },
    });

    if (!integration) {
      throw new BadRequestException('Integration not found');
    }

    const promptTargetText = dto.temporaryFields.reduce((acc, field) => {
      return `${acc}
        fieldName: ${field.name}
        fieldDesc: ${field.description}
        fieldValue: ${field.value}
        `;
    }, '');

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    const result = await client.executePrompt(
      integration.model,
      integration.temperature,
      integration.systemPrompt,
      dto.templatePrompt,
      dto.temporaryFields.map((field) => field.name).join(', '),
      promptTargetText,
    );
    this.logger.log(`Result: ${result.content}`);

    void this.saveAIUsage(
      result.usedTokens,
      integration.provider,
      UsageCategoryEnum.AI_FIELD,
      dto.projectId,
    );

    return result.content;
  }
}
