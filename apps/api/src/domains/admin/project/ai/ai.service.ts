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
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { FieldFormatEnum, FieldStatusEnum } from '@/common/enums';
import { AIPromptStatusEnum } from '@/common/enums/ai-prompt-status.enum';
import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import {
  getCurrentDay,
  getCurrentMonth,
  getCurrentYear,
} from '@/utils/date-utils';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import { FieldEntity } from '../../channel/field/field.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { FeedbackMySQLService } from '../../feedback/feedback.mysql.service';
import { FeedbackOSService } from '../../feedback/feedback.os.service';
import { IssueEntity } from '../issue/issue.entity';
import { ProjectEntity } from '../project/project.entity';
import { PermissionEnum } from '../role/permission.enum';
import { RoleEntity } from '../role/role.entity';
import { AIFieldTemplatesEntity } from './ai-field-templates.entity';
import { AIIntegrationsEntity } from './ai-integrations.entity';
import { AIIssueTemplatesEntity } from './ai-issue-templates.entity';
import { AIUsagesEntity, UsageCategoryEnum } from './ai-usages.entity';
import {
  AIClient,
  IssueRecommendParameters,
  PromptParameters,
} from './ai.client';
import { CreateAIFieldTemplateDto } from './dtos/create-ai-field-template.dto';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import { CreateAIIssueTemplateDto } from './dtos/create-ai-issue-template.dto';
import { GetAIIssuePlaygroundResultDto } from './dtos/get-ai-issue-playground-result.dto';
import { GetAIPlaygroundResultDto } from './dtos/get-ai-playground-result.dto';
import { ValidateAPIKeyResponseDto } from './dtos/responses';
import { UpdateAIFieldTemplateDto } from './dtos/update-ai-field-template.dto';
import { UpdateAIIssueTemplateDto } from './dtos/update-ai-issue-template.dto';

type FieldType = Record<string, string>;

@Injectable()
export class AIService {
  private logger = new Logger(AIService.name);

  constructor(
    private readonly feedbackMySQLService: FeedbackMySQLService,
    private readonly feedbackOSService: FeedbackOSService,
    private readonly configService: ConfigService,

    @InjectRepository(AIIntegrationsEntity)
    private readonly aiIntegrationsRepo: Repository<AIIntegrationsEntity>,

    @InjectRepository(AIFieldTemplatesEntity)
    private readonly aiFieldTemplatesRepo: Repository<AIFieldTemplatesEntity>,

    @InjectRepository(AIIssueTemplatesEntity)
    private readonly aiIssueTemplatesRepo: Repository<AIIssueTemplatesEntity>,

    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepo: Repository<FeedbackEntity>,

    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,

    @InjectRepository(FieldEntity)
    private readonly fieldRepo: Repository<FieldEntity>,

    @InjectRepository(ChannelEntity)
    private readonly channelRepo: Repository<ChannelEntity>,

    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    @InjectRepository(AIUsagesEntity)
    private readonly aiUsagesRepo: Repository<AIUsagesEntity>,
  ) {}

  async validateAPIKey(
    provider: AIProvidersEnum,
    apiKey: string,
    endpointUrl: string | undefined,
  ): Promise<ValidateAPIKeyResponseDto> {
    const client = new AIClient({
      apiKey,
      provider,
      baseUrl: endpointUrl,
    });

    try {
      await client.validateAPIKey();
      return { valid: true };
    } catch (error) {
      this.logger.error(`API key validation failed for ${provider}`, error);
      return { valid: false, error: (error as Error).message };
    }
  }

  async getIntegration(projectId: number) {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
      },
    });

    return integration;
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

      await this.createDefaultFieldTemplates(dto.projectId);

      return newIntegration;
    }

    const updatedIntegration = {
      ...existingIntegration,
      ...dto,
    };
    await this.aiIntegrationsRepo.save(updatedIntegration);
    return updatedIntegration;
  }

  async findFieldTemplatesByProjectId(projectId: number) {
    const fieldTemplates = await this.aiFieldTemplatesRepo.find({
      where: {
        project: {
          id: projectId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return fieldTemplates.map((template) => ({
      id: template.id,
      title: template.title,
      prompt: template.prompt,
      model: template.model,
      temperature: template.temperature,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    }));
  }

  @Transactional()
  async createDefaultFieldTemplates(projectId: number) {
    const existingIntegration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
      },
    });

    if (!existingIntegration) {
      throw new BadRequestException('Integration not found');
    }

    const model =
      existingIntegration.provider === AIProvidersEnum.OPEN_AI ?
        'gpt-4o'
      : 'gemini-2.0-flash';

    const templates = [
      {
        title: 'Summary',
        prompt: 'Summarize the following feedback within a sentences',
        model: model,
        temperature: 0.5,
      },
      {
        title: 'Sentiment Analysis',
        prompt:
          'Analyze the sentiment of the following feedback and express it both as a sentiment label (e.g., positive, negative, neutral) and as a number from 0 to 10.',
        model: model,
        temperature: 0.5,
      },
      {
        title: 'Translation',
        prompt: 'Translate the following feedback to English',
        model: model,
        temperature: 0.5,
      },
      {
        title: 'Keyword Extraction',
        prompt:
          'Extract the 2-3 most important keywords from the following feedback.',
        model: model,
        temperature: 0.5,
      },
    ];

    await this.aiFieldTemplatesRepo.save(
      templates.map((template) =>
        AIFieldTemplatesEntity.from({
          ...template,
          projectId,
        }),
      ),
    );
  }

  @Transactional()
  async createNewFieldTemplate(template: CreateAIFieldTemplateDto) {
    const newTemplate = AIFieldTemplatesEntity.from(template);
    await this.aiFieldTemplatesRepo.save(newTemplate);

    return newTemplate;
  }

  @Transactional()
  async updateFieldTemplate(template: UpdateAIFieldTemplateDto) {
    const existingTemplate = await this.aiFieldTemplatesRepo.findOne({
      where: {
        id: template.templateId,
        project: {
          id: template.projectId,
        },
      },
    });
    if (!existingTemplate) {
      throw new BadRequestException('Field Template not found');
    }
    const updatedTemplate = {
      ...existingTemplate,
      ...template,
    };
    await this.aiFieldTemplatesRepo.save(updatedTemplate);
    return updatedTemplate;
  }

  @Transactional()
  async deleteFieldTemplateById(projectId: number, templateId: number) {
    const template = await this.aiFieldTemplatesRepo.findOne({
      where: {
        id: templateId,
        project: {
          id: projectId,
        },
      },
    });

    if (!template) {
      throw new BadRequestException('Field Template not found');
    }

    await this.aiFieldTemplatesRepo.delete(templateId);
  }

  @Transactional()
  async findIssueTemplatesByProjectId(projectId: number) {
    const issueTemplates = await this.aiIssueTemplatesRepo.find({
      where: {
        channel: {
          project: {
            id: projectId,
          },
        },
      },
      relations: { channel: true },
      order: {
        createdAt: 'ASC',
      },
    });

    return issueTemplates.map((template) => ({
      id: template.id,
      channelId: template.channel.id,
      targetFieldKeys: template.targetFieldKeys,
      prompt: template.prompt,
      isEnabled: template.isEnabled,
      model: template.model,
      temperature: template.temperature,
      dataReferenceAmount: template.dataReferenceAmount,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    }));
  }

  @Transactional()
  async createNewIssueTemplate(template: CreateAIIssueTemplateDto) {
    const newTemplate = AIIssueTemplatesEntity.from(template);
    await this.aiIssueTemplatesRepo.save(newTemplate);

    return newTemplate;
  }

  @Transactional()
  async updateIssueTemplate(dto: UpdateAIIssueTemplateDto) {
    const existingTemplate = await this.aiIssueTemplatesRepo.findOne({
      where: {
        id: dto.templateId,
        channel: {
          id: dto.channelId,
        },
      },
    });
    if (!existingTemplate) {
      throw new BadRequestException('Issue Template not found');
    }
    const updatedTemplate = {
      ...existingTemplate,
      ...dto,
    };
    await this.aiIssueTemplatesRepo.save(updatedTemplate);
    return updatedTemplate;
  }

  @Transactional()
  async deleteIssueTemplateById(templateId: number) {
    const template = await this.aiIssueTemplatesRepo.findOne({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      throw new BadRequestException('Issue Template not found');
    }

    await this.aiIssueTemplatesRepo.delete(templateId);
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
        day: getCurrentDay(),
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
      day: getCurrentDay(),
      category,
      provider,
      usedTokens,
      projectId,
    });
    await this.aiUsagesRepo.save(usage);
  }

  private async hasTokenThresholdExceeded(projectId: number): Promise<boolean> {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
      },
    });

    if (!integration?.tokenThreshold) {
      return false;
    }

    const totalUsedTokens: { total: number } | undefined =
      await this.aiUsagesRepo
        .createQueryBuilder('usage')
        .select('SUM(usage.usedTokens)', 'total')
        .where('usage.project.id = :projectId', { projectId })
        .andWhere('usage.year = :year AND usage.month = :month', {
          year: getCurrentYear(),
          month: getCurrentMonth(),
        })
        .getRawOne();

    return (
      !!totalUsedTokens && totalUsedTokens.total >= integration.tokenThreshold
    );
  }

  private generatePromptTargetText(
    feedback: FeedbackEntity,
    aiTargetFields: FieldEntity[],
    aiField: FieldEntity,
  ): string | null {
    let fieldValues = '';
    const result = aiTargetFields.reduce((acc, field) => {
      if (field.key === aiField.key || !feedback.data[field.key]) return acc;
      if (field.key === 'issues') {
        const issues = feedback.issues
          .map((issue) => `${issue.name}: ${issue.description}`)
          .join(',');
        return `${acc}\n${field.key}: ${issues}`;
      }

      let fieldValue = String(feedback.data[field.key]);

      if (field.key === 'createdAt') {
        fieldValue = feedback.createdAt.toISOString();
      } else if (field.key === 'updatedAt') {
        fieldValue = feedback.updatedAt.toISOString();
      }
      fieldValues += fieldValue;

      return `${acc}
        fieldName: ${field.name}
        fieldDesc: ${field.description}
        fieldValue: ${fieldValue}
        `;
    }, '');

    if (!fieldValues.trim()) {
      return null;
    }

    return result;
  }

  private convertAiFieldToJson(
    data: Record<string, any>,
    fields: FieldEntity[],
  ) {
    for (const field of fields) {
      if (field.format === FieldFormatEnum.aiField) {
        if (data[field.key] && typeof data[field.key] === 'string') {
          try {
            data[field.key] = JSON.parse(data[field.key] as string) as object;
          } catch (e) {
            this.logger.error(
              `Failed to parse AI field data for key ${field.key}: ${e}`,
            );
          }
        }
      }
    }
  }

  private convertAiFieldToString(
    data: Record<string, any>,
    fields: FieldEntity[],
  ) {
    for (const field of fields) {
      if (field.format === FieldFormatEnum.aiField) {
        if (data[field.key] && typeof data[field.key] === 'object') {
          try {
            data[field.key] = JSON.stringify(data[field.key]);
          } catch (e) {
            this.logger.error(
              `Failed to stringify AI field data for key ${field.key}: ${e}`,
            );
          }
        }
      }
    }
  }

  async executeAIFieldPrompt(
    feedback: FeedbackEntity,
    aiField: FieldEntity,
    aiTargetFields: FieldEntity[],
    fields: FieldEntity[],
    isAutoProcess = false,
  ): Promise<boolean> {
    feedback = structuredClone(feedback);

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

    if (!aiField.aiFieldTemplate) {
      throw new BadRequestException('AI field template not found');
    }

    if (!aiField.aiFieldTemplate.model) {
      if (isAutoProcess) return false;
      throw new BadRequestException(
        'The model is not set for the AI field template',
      );
    }

    const promptTargetText = this.generatePromptTargetText(
      feedback,
      aiTargetFields,
      aiField,
    );

    if (!promptTargetText) {
      if (isAutoProcess) {
        this.convertAiFieldToString(feedback.data, fields);
        feedback.data[aiField.key] =
          `{"status": "${AIPromptStatusEnum.error}", "message": "The content of target fields are empty."}`;

        await this.feedbackMySQLService.updateFeedback({
          feedbackId: feedback.id,
          data: feedback.data,
        });

        if (this.configService.get('opensearch.use')) {
          this.convertAiFieldToJson(feedback.data, fields);
          await this.feedbackOSService.upsertFeedbackItem({
            feedbackId: feedback.id,
            data: feedback.data,
            channelId: feedback.channel.id,
          });
        }
        return true;
      } else {
        throw new BadRequestException(
          'The content of target fields are empty.',
        );
      }
    }

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    if (await this.hasTokenThresholdExceeded(feedback.channel.project.id))
      return false;

    this.convertAiFieldToString(feedback.data, fields);
    feedback.data[aiField.key] =
      `{"status": "${AIPromptStatusEnum.loading}", "message": "Processing..."}`;

    await this.feedbackMySQLService.updateFeedback({
      feedbackId: feedback.id,
      data: feedback.data,
    });

    if (this.configService.get('opensearch.use')) {
      this.convertAiFieldToJson(feedback.data, fields);
      await this.feedbackOSService.upsertFeedbackItem({
        feedbackId: feedback.id,
        data: feedback.data,
        channelId: feedback.channel.id,
      });
    }

    const result = await client.executePrompt(
      new PromptParameters(
        aiField.aiFieldTemplate.model,
        aiField.aiFieldTemplate.temperature,
        integration.systemPrompt,
        aiField.aiFieldTemplate.prompt,
        aiTargetFields.map((field) => field.key).join(', '),
        promptTargetText,
        feedback.channel.project.name,
        feedback.channel.project.description ?? '',
        feedback.channel.name,
        feedback.channel.description ?? '',
      ),
    );
    this.logger.log(`Result: ${result.content}`);
    this.convertAiFieldToString(feedback.data, fields);
    feedback.data[aiField.key] =
      `{"status": "${result.status}", "message": "${result.content.replace(/"/g, "'").replace(/\n/g, '')}"}`;

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
      this.convertAiFieldToJson(feedback.data, fields);
      await this.feedbackOSService.upsertFeedbackItem({
        feedbackId: feedback.id,
        data: feedback.data,
        channelId: feedback.channel.id,
      });
    }

    return true;
  }

  async processFeedbacksAIFields(feedbackIds: number[]) {
    this.logger.log(
      `Processing AI Field for feedback IDs: ${feedbackIds.toString()}`,
    );
    const tasks = feedbackIds.map((feedbackId) => {
      return this.processFeedbackAIFields(feedbackId);
    });

    try {
      await Promise.all(tasks);
    } catch {
      throw new BadRequestException('Error processing AI fields');
    }
  }

  async processFeedbackAIFields(feedbackId: number) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: feedbackId },
      relations: {
        channel: {
          project: true,
        },
      },
    });

    if (!feedback)
      throw new NotFoundException(`Feedback ${feedbackId} not found`);

    const fields = await this.fieldRepo.find({
      where: { channel: { id: feedback.channel.id } },
      relations: { options: true, aiFieldTemplate: true },
    });

    for (const field of fields) {
      if (
        field.format === FieldFormatEnum.aiField &&
        field.status === FieldStatusEnum.ACTIVE
      ) {
        const targetFields = fields.filter((f) =>
          field.aiFieldTargetKeys?.includes(f.key),
        );

        if (
          !(await this.executeAIFieldPrompt(
            feedback,
            field,
            targetFields,
            fields,
          ))
        ) {
          throw new BadRequestException(
            'Token threshold exceeded, cannot process AI field',
          );
        }
      }
    }
  }

  async processAIField(feedbackId: number, fieldId: number) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: feedbackId },
      relations: {
        channel: {
          project: true,
        },
      },
    });

    if (!feedback)
      throw new NotFoundException(`Feedback ${feedbackId} not found`);

    const fields = await this.fieldRepo.find({
      where: { channel: { id: feedback.channel.id } },
      relations: { aiFieldTemplate: true },
    });

    const aiField = fields.find(
      (field) =>
        field.id === fieldId &&
        field.format === FieldFormatEnum.aiField &&
        field.status === FieldStatusEnum.ACTIVE,
    );

    if (!aiField) {
      throw new NotFoundException(`AI Field for fieldId ${fieldId} not found`);
    }

    const targetFields = fields.filter((f) =>
      aiField.aiFieldTargetKeys?.includes(f.key),
    );

    if (
      !(await this.executeAIFieldPrompt(
        feedback,
        aiField,
        targetFields,
        fields,
      ))
    ) {
      throw new BadRequestException(
        'Token threshold exceeded, cannot process AI field',
      );
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

    const project = await this.projectRepo.findOneBy({ id: dto.projectId });

    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    const promptTargetText = dto.temporaryFields.reduce((acc, field) => {
      return `${acc}
        fieldName: ${field.name}
        fieldDesc: ${field.description}
        fieldValue: ${field.value}
        `;
    }, '');

    if (await this.hasTokenThresholdExceeded(dto.projectId))
      return 'Token threshold exceeded.';

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    const result = await client.executePrompt(
      new PromptParameters(
        dto.model,
        dto.temperature,
        integration.systemPrompt,
        dto.templatePrompt,
        dto.temporaryFields.map((field) => field.name).join(', '),
        promptTargetText,
        project.name,
        project.description ?? '',
        '',
        '',
      ),
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

  async getUsages(projectId: number, from: Date, to: Date) {
    const usages = await this.aiUsagesRepo.find({
      where: {
        project: {
          id: projectId,
        },
        createdAt: Between(from, to),
      },
    });

    return usages.map((usage) => {
      return {
        year: usage.year,
        month: usage.month,
        day: usage.day,
        category: usage.category,
        provider: usage.provider,
        usedTokens: usage.usedTokens,
      };
    });
  }

  private convertToLinkedIssueCount(dataReferenceAmount: number) {
    switch (dataReferenceAmount) {
      case 1:
        return 0.2;
      case 2:
        return 0.4;
      case 3:
        return 0.6;
      case 4:
        return 0.8;
      case 5:
        return 1;
      default:
        return 0.6;
    }
  }

  async recommendAIIssue(feedbackId: number) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: feedbackId },
      relations: {
        channel: {
          project: true,
        },
      },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback ${feedbackId} not found`);
    }

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

    if (await this.hasTokenThresholdExceeded(feedback.channel.project.id)) {
      throw new BadRequestException(
        'Token threshold exceeded, cannot process AI Issue recommendation',
      );
    }
    const issueTemplate = await this.aiIssueTemplatesRepo.findOne({
      where: {
        channel: {
          id: feedback.channel.id,
        },
        isEnabled: true,
      },
    });

    if (issueTemplate === null) {
      throw new NotFoundException('No issue templates found');
    }

    if (!issueTemplate.model) {
      throw new BadRequestException(
        `The model is not set for the AI issue template (channelId: ${feedback.channel.id})`,
      );
    }

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    let targetFieldValues = '';

    const targetFeedback = JSON.stringify(
      issueTemplate.targetFieldKeys.reduce((acc: FieldType[], key) => {
        if (feedback.data[key] !== undefined) {
          acc.push({ [key]: feedback.data[key] as string });
          targetFieldValues += feedback.data[key] as string;
          return acc;
        }
        return acc;
      }, []),
    );

    if (!targetFieldValues.trim()) {
      throw new BadRequestException(`The content of target fields are empty.`);
    }

    const count = await this.issueRepo.count();
    const issues = await this.issueRepo.find({
      relations: {
        feedbacks: true,
      },
      where: {
        project: {
          id: feedback.channel.project.id,
        },
      },
      order: {
        feedbackCount: 'DESC',
      },
      take: Math.ceil(
        count *
          this.convertToLinkedIssueCount(issueTemplate.dataReferenceAmount),
      ),
    });

    const existingIssues = issues.map((issue) => issue.name).join(',');

    const param = new IssueRecommendParameters(
      issueTemplate.model,
      issueTemplate.temperature,
      integration.systemPrompt,
      targetFeedback,
      issueTemplate.prompt,
      existingIssues,
      feedback.channel.project.name,
      feedback.channel.project.description ?? '',
      feedback.channel.name,
      feedback.channel.description ?? '',
    );

    const result = await client.executeIssueRecommend(param);

    this.logger.log(`Issue Recommend Result: ${result.content}`);

    void this.saveAIUsage(
      result.usedTokens,
      integration.provider,
      UsageCategoryEnum.ISSUE_RECOMMEND,
      feedback.channel.project.id,
    );

    if (result.status === AIPromptStatusEnum.success) {
      return {
        success: true,
        result: this.parseIssueRecommendResult(result.content),
      };
    }

    return {
      success: false,
      message: result.content,
      result: [],
    };
  }

  async getIssuePlaygroundPromptResult(dto: GetAIIssuePlaygroundResultDto) {
    const channel = await this.channelRepo.findOne({
      where: { id: dto.channelId },
      relations: {
        project: true,
      },
    });

    if (!channel) {
      throw new NotFoundException(`Channel ${dto.channelId} not found`);
    }

    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: channel.project.id,
        },
      },
    });

    if (!integration) {
      throw new BadRequestException('Integration not found');
    }

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
      baseUrl: integration.endpointUrl,
    });

    const targetFeedback = JSON.stringify(
      dto.temporaryFields.reduce((acc: FieldType[], temporaryField) => {
        acc.push({
          [temporaryField.name]: temporaryField.value,
        });
        return acc;
      }, []),
    );

    const count = await this.issueRepo.count();
    const issues = await this.issueRepo.find({
      relations: {
        feedbacks: true,
      },
      where: {
        project: {
          id: channel.project.id,
        },
      },
      order: {
        feedbackCount: 'DESC',
      },
      take: Math.ceil(
        count * this.convertToLinkedIssueCount(dto.dataReferenceAmount),
      ),
    });

    const existingIssues = issues.map((issue) => issue.name).join(',');

    const param = new IssueRecommendParameters(
      dto.model,
      dto.temperature,
      integration.systemPrompt,
      targetFeedback,
      dto.templatePrompt,
      existingIssues,
      channel.project.name,
      channel.project.description ?? '',
      channel.name,
      channel.description ?? '',
    );

    const result = await client.executeIssueRecommend(param);

    this.logger.log(`Issue Recommend Result: ${result.content}`);

    void this.saveAIUsage(
      result.usedTokens,
      integration.provider,
      UsageCategoryEnum.ISSUE_RECOMMEND,
      channel.project.id,
    );

    return !result.content ? [] : result.content.split(',');
  }

  private parseIssueRecommendResult(content: string) {
    if (!content) return [];

    return content.split(',').map((issue) => {
      const name = issue;
      return {
        issueName: name.trim(),
      };
    });
  }

  async addPermissions() {
    const permissions: Record<string, PermissionEnum[]> = {
      Admin: [
        PermissionEnum.project_genai_read,
        PermissionEnum.project_genai_update,
      ],
      Editor: [PermissionEnum.project_genai_read],
      Viewer: [],
    };

    const existingRoles = await this.roleRepo.find({
      where: {
        name: In(Object.keys(permissions)),
      },
    });

    for (const role of existingRoles) {
      const existingPermissions = role.permissions;
      const newPermissions = permissions[role.name].filter(
        (perm) => !existingPermissions.includes(perm),
      );

      if (newPermissions.length > 0) {
        role.permissions = [...existingPermissions, ...newPermissions];
        await this.roleRepo.save(role);
      }
    }
    this.logger.log('Permissions added successfully to roles');
  }
}
