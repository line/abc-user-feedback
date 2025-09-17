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
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { FieldFormatEnum, FieldStatusEnum } from '@/common/enums';
import { AIPromptStatusEnum } from '@/common/enums/ai-prompt-status.enum';
import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { FeedbackMySQLService } from '@/domains/admin/feedback/feedback.mysql.service';
import { FeedbackOSService } from '@/domains/admin/feedback/feedback.os.service';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { RoleEntity } from '@/domains/admin/project/role/role.entity';
import { mockRepository, TestConfig } from '@/test-utils/util-functions';
import { AIFieldTemplatesEntity } from './ai-field-templates.entity';
import { AIIntegrationsEntity } from './ai-integrations.entity';
import { AIIssueTemplatesEntity } from './ai-issue-templates.entity';
import { AIUsagesEntity, UsageCategoryEnum } from './ai-usages.entity';
import { AIService } from './ai.service';
import { CreateAIFieldTemplateDto } from './dtos/create-ai-field-template.dto';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import { CreateAIIssueTemplateDto } from './dtos/create-ai-issue-template.dto';
import { GetAIIssuePlaygroundResultDto } from './dtos/get-ai-issue-playground-result.dto';
import { GetAIPlaygroundResultDto } from './dtos/get-ai-playground-result.dto';
import { UpdateAIFieldTemplateDto } from './dtos/update-ai-field-template.dto';
import { UpdateAIIssueTemplateDto } from './dtos/update-ai-issue-template.dto';

// Mock AIClient
jest.mock('./ai.client', () => ({
  AIClient: jest.fn().mockImplementation(() => ({
    validateAPIKey: jest.fn(),
    getModelList: jest.fn(),
    executePrompt: jest.fn(),
    executeIssueRecommend: jest.fn(),
  })),
  PromptParameters: jest.fn(),
  IssueRecommendParameters: jest.fn(),
}));

describe('AIService', () => {
  let aiService: AIService;
  let aiIntegrationsRepo: Repository<AIIntegrationsEntity>;
  let aiFieldTemplatesRepo: Repository<AIFieldTemplatesEntity>;
  let aiIssueTemplatesRepo: Repository<AIIssueTemplatesEntity>;
  let aiUsagesRepo: Repository<AIUsagesEntity>;
  let feedbackRepo: Repository<FeedbackEntity>;
  let issueRepo: Repository<IssueEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let roleRepo: Repository<RoleEntity>;
  let _feedbackMySQLService: FeedbackMySQLService;
  let _feedbackOSService: FeedbackOSService;
  let _configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: [
        AIService,
        {
          provide: getRepositoryToken(AIIntegrationsEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(AIFieldTemplatesEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(AIIssueTemplatesEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(AIUsagesEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(FeedbackEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(IssueEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(FieldEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(ChannelEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(ProjectEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useFactory: mockRepository,
        },
        {
          provide: FeedbackMySQLService,
          useValue: {
            updateFeedback: jest.fn(),
          },
        },
        {
          provide: FeedbackOSService,
          useValue: {
            upsertFeedbackItem: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    aiService = module.get<AIService>(AIService);
    aiIntegrationsRepo = module.get(getRepositoryToken(AIIntegrationsEntity));
    aiFieldTemplatesRepo = module.get(
      getRepositoryToken(AIFieldTemplatesEntity),
    );
    aiIssueTemplatesRepo = module.get(
      getRepositoryToken(AIIssueTemplatesEntity),
    );
    aiUsagesRepo = module.get(getRepositoryToken(AIUsagesEntity));
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    roleRepo = module.get(getRepositoryToken(RoleEntity));
    _feedbackMySQLService =
      module.get<FeedbackMySQLService>(FeedbackMySQLService);
    _feedbackOSService = module.get<FeedbackOSService>(FeedbackOSService);
    _configService = module.get<ConfigService>(ConfigService);
  });

  describe('validateAPIKey', () => {
    it('should successfully validate a valid API key', async () => {
      const provider = AIProvidersEnum.OPEN_AI;
      const apiKey = faker.string.alphanumeric(32);
      const endpointUrl = faker.internet.url();

      const mockClient = {
        validateAPIKey: jest.fn().mockResolvedValue(undefined),
      };
      jest.spyOn(await import('./ai.client'), 'AIClient').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => mockClient as unknown as jest.MockedClass<any>,
      );

      const result = await aiService.validateAPIKey(
        provider,
        apiKey,
        endpointUrl,
      );

      expect(result.valid).toBe(true);
      expect(mockClient.validateAPIKey).toHaveBeenCalled();
    });

    it('should fail to validate an invalid API key', async () => {
      const provider = AIProvidersEnum.OPEN_AI;
      const apiKey = 'invalid-key';
      const endpointUrl = faker.internet.url();
      const errorMessage = 'Invalid API key';

      const mockClient = {
        validateAPIKey: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
      jest.spyOn(await import('./ai.client'), 'AIClient').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => mockClient as unknown as jest.MockedClass<any>,
      );

      const result = await aiService.validateAPIKey(
        provider,
        apiKey,
        endpointUrl,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('getIntegration', () => {
    it('should retrieve integration information by project ID', async () => {
      const projectId = faker.number.int();
      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
      };

      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);

      const result = await aiService.getIntegration(projectId);

      expect(result).toEqual(mockIntegration);
      expect(aiIntegrationsRepo.findOne).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
      });
    });

    it('should return null when integration information does not exist', async () => {
      const projectId = faker.number.int();

      jest.spyOn(aiIntegrationsRepo, 'findOne').mockResolvedValue(null);

      const result = await aiService.getIntegration(projectId);

      expect(result).toBeNull();
    });
  });

  describe('upsertIntegration', () => {
    it('should create new integration information', async () => {
      const dto = new CreateAIIntegrationsDto();
      dto.projectId = faker.number.int();
      dto.provider = AIProvidersEnum.OPEN_AI;
      dto.apiKey = faker.string.alphanumeric(32);
      dto.endpointUrl = faker.internet.url();
      dto.systemPrompt = faker.lorem.sentence();
      dto.tokenThreshold = faker.number.int({ min: 1000, max: 10000 });
      dto.notificationThreshold = faker.number.int({ min: 100, max: 1000 });

      jest.spyOn(aiIntegrationsRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(aiIntegrationsRepo, 'save').mockResolvedValue(dto as any);
      jest
        .spyOn(aiService, 'createDefaultFieldTemplates')
        .mockResolvedValue(undefined);

      await aiService.upsertIntegration(dto);

      expect(aiIntegrationsRepo.save).toHaveBeenCalled();
      expect(aiService.createDefaultFieldTemplates).toHaveBeenCalledWith(
        dto.projectId,
      );
    });

    it('should update existing integration information', async () => {
      const dto = new CreateAIIntegrationsDto();
      dto.projectId = faker.number.int();
      dto.provider = AIProvidersEnum.OPEN_AI;
      dto.apiKey = faker.string.alphanumeric(32);

      const existingIntegration = {
        id: faker.number.int(),
        projectId: dto.projectId,
        provider: AIProvidersEnum.GEMINI,
        apiKey: 'old-key',
      };

      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(
          existingIntegration as unknown as AIIntegrationsEntity,
        );
      jest
        .spyOn(aiIntegrationsRepo, 'save')
        .mockResolvedValue({ ...existingIntegration, ...dto } as any);

      await aiService.upsertIntegration(dto);

      expect(aiIntegrationsRepo.save).toHaveBeenCalledWith({
        ...existingIntegration,
        ...dto,
      });
    });
  });

  describe('findFieldTemplatesByProjectId', () => {
    it('should retrieve field template list by project ID', async () => {
      const projectId = faker.number.int();
      const mockTemplates = [
        {
          id: faker.number.int(),
          title: 'Summary',
          prompt: 'Summarize the feedback',
          model: 'gpt-4o',
          temperature: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: faker.number.int(),
          title: 'Sentiment Analysis',
          prompt: 'Analyze sentiment',
          model: 'gpt-4o',
          temperature: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(aiFieldTemplatesRepo, 'find')
        .mockResolvedValue(mockTemplates as any);

      const result = await aiService.findFieldTemplatesByProjectId(projectId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockTemplates[0].id,
        title: mockTemplates[0].title,
        prompt: mockTemplates[0].prompt,
        model: mockTemplates[0].model,
        temperature: mockTemplates[0].temperature,
        createdAt: mockTemplates[0].createdAt,
        updatedAt: mockTemplates[0].updatedAt,
      });
    });
  });

  describe('createNewFieldTemplate', () => {
    it('should create a new field template', async () => {
      const dto = new CreateAIFieldTemplateDto();
      dto.projectId = faker.number.int();
      dto.title = faker.lorem.words(2);
      dto.prompt = faker.lorem.sentence();
      dto.model = 'gpt-4o';
      dto.temperature = 0.5;

      const mockTemplate = {
        id: faker.number.int(),
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(aiFieldTemplatesRepo, 'save')
        .mockResolvedValue(mockTemplate as any);

      await aiService.createNewFieldTemplate(dto);

      expect(aiFieldTemplatesRepo.save).toHaveBeenCalled();
    });
  });

  describe('updateFieldTemplate', () => {
    it('should update existing field template', async () => {
      const dto = new UpdateAIFieldTemplateDto();
      dto.templateId = faker.number.int();
      dto.projectId = faker.number.int();
      dto.title = faker.lorem.words(2);
      dto.prompt = faker.lorem.sentence();

      const existingTemplate = {
        id: dto.templateId,
        projectId: dto.projectId,
        title: 'Old Title',
        prompt: 'Old Prompt',
        model: 'gpt-4o',
        temperature: 0.5,
      };

      jest
        .spyOn(aiFieldTemplatesRepo, 'findOne')
        .mockResolvedValue(existingTemplate as any);
      jest
        .spyOn(aiFieldTemplatesRepo, 'save')
        .mockResolvedValue({ ...existingTemplate, ...dto } as any);

      await aiService.updateFieldTemplate(dto);

      expect(aiFieldTemplatesRepo.save).toHaveBeenCalledWith({
        ...existingTemplate,
        ...dto,
      });
    });

    it('should throw exception when updating non-existent template', async () => {
      const dto = new UpdateAIFieldTemplateDto();
      dto.templateId = faker.number.int();
      dto.projectId = faker.number.int();

      jest.spyOn(aiFieldTemplatesRepo, 'findOne').mockResolvedValue(null);

      await expect(aiService.updateFieldTemplate(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteFieldTemplateById', () => {
    it('should delete field template', async () => {
      const projectId = faker.number.int();
      const templateId = faker.number.int();

      const mockTemplate = {
        id: templateId,
        projectId,
        title: 'Test Template',
      };

      jest
        .spyOn(aiFieldTemplatesRepo, 'findOne')
        .mockResolvedValue(mockTemplate as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (aiFieldTemplatesRepo as any).delete = jest
        .fn()
        .mockResolvedValue({ affected: 1 });

      await aiService.deleteFieldTemplateById(projectId, templateId);

      expect(
        (aiFieldTemplatesRepo as unknown as { delete: jest.Mock }).delete,
      ).toHaveBeenCalledWith(templateId);
    });

    it('should throw exception when deleting non-existent template', async () => {
      const projectId = faker.number.int();
      const templateId = faker.number.int();

      jest.spyOn(aiFieldTemplatesRepo, 'findOne').mockResolvedValue(null);

      await expect(
        aiService.deleteFieldTemplateById(projectId, templateId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getModels', () => {
    it('should return AI model list for project', async () => {
      const projectId = faker.number.int();
      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
      };

      const mockModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];

      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);

      const mockClient = {
        getModelList: jest.fn().mockResolvedValue(mockModels),
      };
      jest.spyOn(await import('./ai.client'), 'AIClient').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => mockClient as unknown as jest.MockedClass<any>,
      );

      const result = await aiService.getModels(projectId);

      expect(result).toEqual(mockModels);
      expect(mockClient.getModelList).toHaveBeenCalled();
    });

    it('should return empty array when integration does not exist', async () => {
      const projectId = faker.number.int();

      jest.spyOn(aiIntegrationsRepo, 'findOne').mockResolvedValue(null);

      const result = await aiService.getModels(projectId);

      expect(result).toEqual([]);
    });
  });

  describe('getUsages', () => {
    it('should retrieve AI usage for project', async () => {
      const projectId = faker.number.int();
      const from = new Date('2024-01-01');
      const to = new Date('2024-01-31');

      const mockUsages = [
        {
          id: faker.number.int(),
          projectId,
          year: 2024,
          month: 1,
          day: 1,
          category: UsageCategoryEnum.AI_FIELD,
          provider: AIProvidersEnum.OPEN_AI,
          usedTokens: 1000,
          createdAt: from,
        },
        {
          id: faker.number.int(),
          projectId,
          year: 2024,
          month: 1,
          day: 2,
          category: UsageCategoryEnum.ISSUE_RECOMMEND,
          provider: AIProvidersEnum.OPEN_AI,
          usedTokens: 500,
          createdAt: to,
        },
      ];

      jest.spyOn(aiUsagesRepo, 'find').mockResolvedValue(mockUsages as any);

      const result = await aiService.getUsages(projectId, from, to);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        year: mockUsages[0].year,
        month: mockUsages[0].month,
        day: mockUsages[0].day,
        category: mockUsages[0].category,
        provider: mockUsages[0].provider,
        usedTokens: mockUsages[0].usedTokens,
      });
    });
  });

  describe('recommendAIIssue', () => {
    it('should recommend issues for feedback', async () => {
      const feedbackId = faker.number.int();
      const projectId = faker.number.int();
      const channelId = faker.number.int();

      const mockFeedback = {
        id: feedbackId,
        data: {
          content: 'This is a test feedback',
          rating: 5,
        },
        channel: {
          id: channelId,
          project: {
            id: projectId,
            name: 'Test Project',
            description: 'Test Description',
          },
        },
      };

      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
        systemPrompt: 'You are a helpful assistant',
      };

      const mockIssueTemplate = {
        id: faker.number.int(),
        channelId,
        targetFieldKeys: ['content', 'rating'],
        prompt: 'Recommend issues based on feedback',
        isEnabled: true,
        model: 'gpt-4o',
        temperature: 0.5,
        dataReferenceAmount: 3,
      };

      const mockIssues = [
        { id: faker.number.int(), name: 'Bug Report', feedbackCount: 10 },
        { id: faker.number.int(), name: 'Feature Request', feedbackCount: 5 },
      ];

      const mockClient = {
        executeIssueRecommend: jest.fn().mockResolvedValue({
          status: AIPromptStatusEnum.success,
          content: 'Bug Report, Feature Request',
          usedTokens: 100,
        }),
      };

      jest
        .spyOn(feedbackRepo, 'findOne')
        .mockResolvedValue(mockFeedback as any);
      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);
      jest
        .spyOn(aiIssueTemplatesRepo, 'findOne')
        .mockResolvedValue(mockIssueTemplate as any);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(10);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(mockIssues as any);
      jest.spyOn(aiUsagesRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(aiUsagesRepo, 'save').mockResolvedValue({} as any);
      jest.spyOn(await import('./ai.client'), 'AIClient').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => mockClient as unknown as jest.MockedClass<any>,
      );

      const result = await aiService.recommendAIIssue(feedbackId);

      expect(result.success).toBe(true);
      expect(result.result).toHaveLength(2);
      expect(result.result[0].issueName).toBe('Bug Report');
      expect(result.result[1].issueName).toBe('Feature Request');
    });

    it('should throw exception when feedback does not exist', async () => {
      const feedbackId = faker.number.int();

      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue(null);

      await expect(aiService.recommendAIIssue(feedbackId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw exception when integration does not exist', async () => {
      const feedbackId = faker.number.int();
      const mockFeedback = {
        id: feedbackId,
        channel: {
          project: {
            id: faker.number.int(),
          },
        },
      };

      jest
        .spyOn(feedbackRepo, 'findOne')
        .mockResolvedValue(mockFeedback as any);
      jest.spyOn(aiIntegrationsRepo, 'findOne').mockResolvedValue(null);

      await expect(aiService.recommendAIIssue(feedbackId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw exception when issue template does not exist', async () => {
      const feedbackId = faker.number.int();
      const projectId = faker.number.int();
      const channelId = faker.number.int();

      const mockFeedback = {
        id: feedbackId,
        channel: {
          id: channelId,
          project: {
            id: projectId,
          },
        },
      };

      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
      };

      jest
        .spyOn(feedbackRepo, 'findOne')
        .mockResolvedValue(mockFeedback as any);
      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);
      jest.spyOn(aiIssueTemplatesRepo, 'findOne').mockResolvedValue(null);

      await expect(aiService.recommendAIIssue(feedbackId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addPermissions', () => {
    it('should add AI permissions to roles', async () => {
      const mockRoles = [
        {
          id: faker.number.int(),
          name: 'Admin',
          permissions: ['project_read', 'project_update'],
        },
        {
          id: faker.number.int(),
          name: 'Editor',
          permissions: ['project_read'],
        },
        {
          id: faker.number.int(),
          name: 'Viewer',
          permissions: [],
        },
      ];

      jest.spyOn(roleRepo, 'find').mockResolvedValue(mockRoles as any);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({} as any);

      await aiService.addPermissions();

      expect(roleRepo.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('processFeedbackAIFields', () => {
    it('should process AI fields for feedback', async () => {
      const feedbackId = faker.number.int();
      const projectId = faker.number.int();
      const channelId = faker.number.int();

      const mockFeedback = {
        id: feedbackId,
        data: {
          content: 'Test feedback content',
          rating: 5,
        },
        channel: {
          id: channelId,
          project: {
            id: projectId,
          },
        },
      };

      const mockFields = [
        {
          id: faker.number.int(),
          key: 'content',
          format: FieldFormatEnum.text,
          status: FieldStatusEnum.ACTIVE,
        },
        {
          id: faker.number.int(),
          key: 'ai_summary',
          format: FieldFormatEnum.aiField,
          status: FieldStatusEnum.ACTIVE,
          aiFieldTargetKeys: ['content'],
          aiFieldTemplate: {
            id: faker.number.int(),
            model: 'gpt-4o',
            temperature: 0.5,
            prompt: 'Summarize the content',
          },
        },
      ];

      jest
        .spyOn(feedbackRepo, 'findOne')
        .mockResolvedValue(mockFeedback as any);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(mockFields as any);
      jest.spyOn(aiService, 'executeAIFieldPrompt').mockResolvedValue(true);

      await aiService.processFeedbackAIFields(feedbackId);

      expect(aiService.executeAIFieldPrompt).toHaveBeenCalledWith(
        mockFeedback,
        mockFields[1],
        [mockFields[0]],
        mockFields,
      );
    });

    it('should throw exception when feedback does not exist', async () => {
      const feedbackId = faker.number.int();

      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue(null);

      await expect(
        aiService.processFeedbackAIFields(feedbackId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('processAIField', () => {
    it('should process specific AI field', async () => {
      const feedbackId = faker.number.int();
      const fieldId = faker.number.int();
      const projectId = faker.number.int();
      const channelId = faker.number.int();

      const mockFeedback = {
        id: feedbackId,
        data: {
          content: 'Test feedback content',
        },
        channel: {
          id: channelId,
          project: {
            id: projectId,
          },
        },
      };

      const mockFields = [
        {
          id: faker.number.int(),
          key: 'content',
          format: FieldFormatEnum.text,
        },
        {
          id: fieldId,
          key: 'ai_summary',
          format: FieldFormatEnum.aiField,
          status: FieldStatusEnum.ACTIVE,
          aiFieldTargetKeys: ['content'],
          aiFieldTemplate: {
            id: faker.number.int(),
            model: 'gpt-4o',
            temperature: 0.5,
            prompt: 'Summarize the content',
          },
        },
      ];

      jest
        .spyOn(feedbackRepo, 'findOne')
        .mockResolvedValue(mockFeedback as any);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(mockFields as any);
      jest.spyOn(aiService, 'executeAIFieldPrompt').mockResolvedValue(true);

      await aiService.processAIField(feedbackId, fieldId);

      expect(aiService.executeAIFieldPrompt).toHaveBeenCalledWith(
        mockFeedback,
        mockFields[1],
        [mockFields[0]],
        mockFields,
      );
    });

    it('should throw exception when AI field does not exist', async () => {
      const feedbackId = faker.number.int();
      const fieldId = faker.number.int();

      const mockFeedback = {
        id: feedbackId,
        channel: {
          id: faker.number.int(),
          project: {
            id: faker.number.int(),
          },
        },
      };

      const mockFields = [
        {
          id: faker.number.int(),
          key: 'content',
          format: FieldFormatEnum.text,
        },
      ];

      jest
        .spyOn(feedbackRepo, 'findOne')
        .mockResolvedValue(mockFeedback as any);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(mockFields as any);

      await expect(
        aiService.processAIField(feedbackId, fieldId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPlaygroundPromptResult', () => {
    it('should return playground prompt result', async () => {
      const projectId = faker.number.int();
      const dto = new GetAIPlaygroundResultDto();
      dto.projectId = projectId;
      dto.model = 'gpt-4o';
      dto.temperature = 0.5;
      dto.templatePrompt = 'Summarize the following content';
      dto.temporaryFields = [
        {
          name: 'content',
          description: 'User feedback content',
          value: 'This is a test feedback',
        },
      ];

      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
        systemPrompt: 'You are a helpful assistant',
      };

      const mockProject = {
        id: projectId,
        name: 'Test Project',
        description: 'Test Description',
      };

      const mockClient = {
        executePrompt: jest.fn().mockResolvedValue({
          status: AIPromptStatusEnum.success,
          content: 'This is a summary of the feedback',
          usedTokens: 50,
        }),
      };

      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue(mockProject as any);
      jest.spyOn(aiUsagesRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(aiUsagesRepo, 'save').mockResolvedValue({} as any);
      jest.spyOn(await import('./ai.client'), 'AIClient').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => mockClient as unknown as jest.MockedClass<any>,
      );

      const result = await aiService.getPlaygroundPromptResult(dto);

      expect(result).toBe('This is a summary of the feedback');
      expect(mockClient.executePrompt).toHaveBeenCalled();
    });

    it('should throw exception when integration does not exist', async () => {
      const dto = new GetAIPlaygroundResultDto();
      dto.projectId = faker.number.int();

      jest.spyOn(aiIntegrationsRepo, 'findOne').mockResolvedValue(null);

      await expect(aiService.getPlaygroundPromptResult(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw exception when project does not exist', async () => {
      const projectId = faker.number.int();
      const dto = new GetAIPlaygroundResultDto();
      dto.projectId = projectId;

      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
      };

      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);

      await expect(aiService.getPlaygroundPromptResult(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getIssuePlaygroundPromptResult', () => {
    it('should return issue playground prompt result', async () => {
      const channelId = faker.number.int();
      const projectId = faker.number.int();

      const dto = new GetAIIssuePlaygroundResultDto();
      dto.channelId = channelId;
      dto.model = 'gpt-4o';
      dto.temperature = 0.5;
      dto.templatePrompt = 'Recommend issues based on feedback';
      dto.dataReferenceAmount = 3;
      dto.temporaryFields = [
        {
          name: 'content',
          description: 'User feedback content',
          value: 'This is a test feedback',
        },
      ];

      const mockChannel = {
        id: channelId,
        project: {
          id: projectId,
          name: 'Test Project',
          description: 'Test Description',
        },
      };

      const mockIntegration = {
        id: faker.number.int(),
        projectId,
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
        systemPrompt: 'You are a helpful assistant',
      };

      const mockIssues = [
        { id: faker.number.int(), name: 'Bug Report', feedbackCount: 10 },
        { id: faker.number.int(), name: 'Feature Request', feedbackCount: 5 },
      ];

      const mockClient = {
        executeIssueRecommend: jest.fn().mockResolvedValue({
          status: AIPromptStatusEnum.success,
          content: 'Bug Report, Feature Request',
          usedTokens: 100,
        }),
      };

      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(mockChannel as any);
      jest
        .spyOn(aiIntegrationsRepo, 'findOne')
        .mockResolvedValue(mockIntegration as unknown as AIIntegrationsEntity);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(10);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(mockIssues as any);
      jest.spyOn(aiUsagesRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(aiUsagesRepo, 'save').mockResolvedValue({} as any);
      jest.spyOn(await import('./ai.client'), 'AIClient').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        () => mockClient as unknown as jest.MockedClass<any>,
      );

      const result = await aiService.getIssuePlaygroundPromptResult(dto);

      expect(result).toEqual(['Bug Report', ' Feature Request']);
      expect(mockClient.executeIssueRecommend).toHaveBeenCalled();
    });

    it('should throw exception when channel does not exist', async () => {
      const dto = new GetAIIssuePlaygroundResultDto();
      dto.channelId = faker.number.int();

      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(null);

      await expect(
        aiService.getIssuePlaygroundPromptResult(dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw exception when integration does not exist', async () => {
      const channelId = faker.number.int();
      const dto = new GetAIIssuePlaygroundResultDto();
      dto.channelId = channelId;

      const mockChannel = {
        id: channelId,
        project: {
          id: faker.number.int(),
        },
      };

      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(mockChannel as any);
      jest.spyOn(aiIntegrationsRepo, 'findOne').mockResolvedValue(null);

      await expect(
        aiService.getIssuePlaygroundPromptResult(dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findIssueTemplatesByProjectId', () => {
    it('should retrieve issue template list by project ID', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();

      const mockTemplates = [
        {
          id: faker.number.int(),
          channel: {
            id: channelId,
          },
          targetFieldKeys: ['content', 'rating'],
          prompt: 'Recommend issues based on feedback',
          isEnabled: true,
          model: 'gpt-4o',
          temperature: 0.5,
          dataReferenceAmount: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(aiIssueTemplatesRepo, 'find')
        .mockResolvedValue(mockTemplates as any);

      const result = await aiService.findIssueTemplatesByProjectId(projectId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockTemplates[0].id,
        channelId: mockTemplates[0].channel.id,
        targetFieldKeys: mockTemplates[0].targetFieldKeys,
        prompt: mockTemplates[0].prompt,
        isEnabled: mockTemplates[0].isEnabled,
        model: mockTemplates[0].model,
        temperature: mockTemplates[0].temperature,
        dataReferenceAmount: mockTemplates[0].dataReferenceAmount,
        createdAt: mockTemplates[0].createdAt,
        updatedAt: mockTemplates[0].updatedAt,
      });
    });
  });

  describe('createNewIssueTemplate', () => {
    it('should create new issue template', async () => {
      const dto = new CreateAIIssueTemplateDto();
      dto.channelId = faker.number.int();
      dto.targetFieldKeys = ['content', 'rating'];
      dto.prompt = 'Recommend issues based on feedback';
      dto.isEnabled = true;
      dto.model = 'gpt-4o';
      dto.temperature = 0.5;
      dto.dataReferenceAmount = 3;

      const mockTemplate = {
        id: faker.number.int(),
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(aiIssueTemplatesRepo, 'save')
        .mockResolvedValue(mockTemplate as any);

      await aiService.createNewIssueTemplate(dto);

      expect(aiIssueTemplatesRepo.save).toHaveBeenCalled();
    });
  });

  describe('updateIssueTemplate', () => {
    it('should update existing issue template', async () => {
      const dto = new UpdateAIIssueTemplateDto();
      dto.templateId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.prompt = 'Updated prompt';
      dto.isEnabled = false;

      const existingTemplate = {
        id: dto.templateId,
        channelId: dto.channelId,
        prompt: 'Old prompt',
        isEnabled: true,
        model: 'gpt-4o',
        temperature: 0.5,
        dataReferenceAmount: 3,
      };

      jest
        .spyOn(aiIssueTemplatesRepo, 'findOne')
        .mockResolvedValue(existingTemplate as any);
      jest
        .spyOn(aiIssueTemplatesRepo, 'save')
        .mockResolvedValue({ ...existingTemplate, ...dto } as any);

      await aiService.updateIssueTemplate(dto);

      expect(aiIssueTemplatesRepo.save).toHaveBeenCalledWith({
        ...existingTemplate,
        ...dto,
      });
    });

    it('should throw exception when updating non-existent template', async () => {
      const dto = new UpdateAIIssueTemplateDto();
      dto.templateId = faker.number.int();
      dto.channelId = faker.number.int();

      jest.spyOn(aiIssueTemplatesRepo, 'findOne').mockResolvedValue(null);

      await expect(aiService.updateIssueTemplate(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteIssueTemplateById', () => {
    it('should delete issue template', async () => {
      const templateId = faker.number.int();

      const mockTemplate = {
        id: templateId,
        prompt: 'Test Template',
      };

      jest
        .spyOn(aiIssueTemplatesRepo, 'findOne')
        .mockResolvedValue(mockTemplate as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (aiIssueTemplatesRepo as any).delete = jest
        .fn()
        .mockResolvedValue({ affected: 1 });

      await aiService.deleteIssueTemplateById(templateId);

      expect(
        (aiIssueTemplatesRepo as unknown as { delete: jest.Mock }).delete,
      ).toHaveBeenCalledWith(templateId);
    });

    it('should throw exception when deleting non-existent template', async () => {
      const templateId = faker.number.int();

      jest.spyOn(aiIssueTemplatesRepo, 'findOne').mockResolvedValue(null);

      await expect(
        aiService.deleteIssueTemplateById(templateId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('processFeedbacksAIFields', () => {
    it('should process AI fields for multiple feedbacks', async () => {
      const feedbackIds = [faker.number.int(), faker.number.int()];

      jest
        .spyOn(aiService, 'processFeedbackAIFields')
        .mockResolvedValue(undefined);

      await aiService.processFeedbacksAIFields(feedbackIds);

      expect(aiService.processFeedbackAIFields).toHaveBeenCalledTimes(2);
      expect(aiService.processFeedbackAIFields).toHaveBeenCalledWith(
        feedbackIds[0],
      );
      expect(aiService.processFeedbackAIFields).toHaveBeenCalledWith(
        feedbackIds[1],
      );
    });

    it('should throw exception when processing fails', async () => {
      const feedbackIds = [faker.number.int()];

      jest
        .spyOn(aiService, 'processFeedbackAIFields')
        .mockRejectedValue(new Error('Processing failed'));

      await expect(
        aiService.processFeedbacksAIFields(feedbackIds),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
