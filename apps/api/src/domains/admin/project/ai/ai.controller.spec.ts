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
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import type {
  CreateAIFieldTemplateRequestDto,
  CreateAIIssueTemplateRequestDto,
  GetAIIssuePlaygroundResultRequestDto,
  GetAIPlaygroundResultRequestDto,
  ProcessAIFieldRequestDto,
  ProcessSingleAIFieldRequestDto,
  UpdateAIIntegrationsRequestDto,
  ValidteAPIKeyRequestDto,
} from './dtos/requests';
import type { ValidateAPIKeyResponseDto } from './dtos/responses';

const MockAIService = {
  validateAPIKey: jest.fn(),
  getIntegration: jest.fn(),
  upsertIntegration: jest.fn(),
  getModels: jest.fn(),
  findFieldTemplatesByProjectId: jest.fn(),
  createNewFieldTemplate: jest.fn(),
  updateFieldTemplate: jest.fn(),
  deleteFieldTemplateById: jest.fn(),
  findIssueTemplatesByProjectId: jest.fn(),
  createNewIssueTemplate: jest.fn(),
  updateIssueTemplate: jest.fn(),
  deleteIssueTemplateById: jest.fn(),
  processFeedbacksAIFields: jest.fn(),
  processAIField: jest.fn(),
  getPlaygroundPromptResult: jest.fn(),
  recommendAIIssue: jest.fn(),
  getIssuePlaygroundPromptResult: jest.fn(),
  getUsages: jest.fn(),
};

describe('AIController', () => {
  let aiController: AIController;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [AIController],
      providers: [
        getMockProvider(AIService, MockAIService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    aiController = module.get<AIController>(AIController);
  });

  describe('validateAPIKey', () => {
    it('should validate API key successfully', async () => {
      const body: ValidteAPIKeyRequestDto = {
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
      };
      const mockResult: ValidateAPIKeyResponseDto = { valid: true };

      jest.spyOn(MockAIService, 'validateAPIKey').mockResolvedValue(mockResult);

      const result = await aiController.validateAPIKey(body);

      expect(MockAIService.validateAPIKey).toHaveBeenCalledWith(
        body.provider,
        body.apiKey,
        body.endpointUrl,
      );
      expect(result).toEqual(mockResult);
    });

    it('should return invalid API key result', async () => {
      const body: ValidteAPIKeyRequestDto = {
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: 'invalid-key',
        endpointUrl: faker.internet.url(),
      };
      const mockResult: ValidateAPIKeyResponseDto = {
        valid: false,
        error: 'Invalid API key',
      };

      jest.spyOn(MockAIService, 'validateAPIKey').mockResolvedValue(mockResult);

      const result = await aiController.validateAPIKey(body);

      expect(MockAIService.validateAPIKey).toHaveBeenCalledWith(
        body.provider,
        body.apiKey,
        body.endpointUrl,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getIntegration', () => {
    it('should get AI integration successfully', async () => {
      const projectId = faker.number.int();
      const mockIntegration = {
        id: faker.number.int(),
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
        systemPrompt: faker.string.sample(),
        tokenThreshold: faker.number.int(),
      };

      jest
        .spyOn(MockAIService, 'getIntegration')
        .mockResolvedValue(mockIntegration);

      const result = await aiController.getIntegration(projectId);

      expect(MockAIService.getIntegration).toHaveBeenCalledWith(projectId);
      expect(result).toBeDefined();
    });

    it('should return null when no integration found', async () => {
      const projectId = faker.number.int();

      jest.spyOn(MockAIService, 'getIntegration').mockResolvedValue(null);

      const result = await aiController.getIntegration(projectId);

      expect(MockAIService.getIntegration).toHaveBeenCalledWith(projectId);
      expect(result).toBeNull();
    });
  });

  describe('updateIntegration', () => {
    it('should update AI integration successfully', async () => {
      const projectId = faker.number.int();
      const body: UpdateAIIntegrationsRequestDto = {
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
        systemPrompt: faker.string.sample(),
        tokenThreshold: faker.number.int(),
      };
      const mockIntegration = {
        id: faker.number.int(),
        ...body,
        projectId,
      };

      jest
        .spyOn(MockAIService, 'upsertIntegration')
        .mockResolvedValue(mockIntegration);

      const result = await aiController.updateIntegration(projectId, body);

      expect(MockAIService.upsertIntegration).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getModels', () => {
    it('should get AI models successfully', async () => {
      const projectId = faker.number.int();
      const mockModels = [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      ];

      jest.spyOn(MockAIService, 'getModels').mockResolvedValue(mockModels);

      const result = await aiController.getModels(projectId);

      expect(MockAIService.getModels).toHaveBeenCalledWith(projectId);
      expect(result).toBeDefined();
    });

    it('should return empty array when no models found', async () => {
      const projectId = faker.number.int();

      jest.spyOn(MockAIService, 'getModels').mockResolvedValue([]);

      const result = await aiController.getModels(projectId);

      expect(MockAIService.getModels).toHaveBeenCalledWith(projectId);
      expect(result).toEqual({ models: [] });
    });
  });

  describe('getFieldTemplates', () => {
    it('should get AI field templates successfully', async () => {
      const projectId = faker.number.int();
      const mockTemplates = [
        {
          id: faker.number.int(),
          title: 'Summary',
          prompt: 'Summarize the feedback',
          model: 'gpt-4o',
          temperature: 0.5,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        },
      ];

      jest
        .spyOn(MockAIService, 'findFieldTemplatesByProjectId')
        .mockResolvedValue(mockTemplates);

      const result = await aiController.getFieldTemplates(projectId);

      expect(MockAIService.findFieldTemplatesByProjectId).toHaveBeenCalledWith(
        projectId,
      );
      expect(result).toBeDefined();
    });
  });

  describe('createNewFieldTemplate', () => {
    it('should create new AI field template successfully', async () => {
      const projectId = faker.number.int();
      const body: CreateAIFieldTemplateRequestDto = {
        title: faker.string.sample(),
        prompt: faker.string.sample(),
        model: 'gpt-4o',
        temperature: 0.5,
      };
      const mockTemplate = {
        id: faker.number.int(),
        ...body,
        projectId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      jest
        .spyOn(MockAIService, 'createNewFieldTemplate')
        .mockResolvedValue(mockTemplate);

      const result = await aiController.createNewFieldTemplate(projectId, body);

      expect(MockAIService.createNewFieldTemplate).toHaveBeenCalledWith({
        ...body,
        projectId,
      });
      expect(result).toBeDefined();
    });
  });

  describe('updateFieldTemplate', () => {
    it('should update AI field template successfully', async () => {
      const projectId = faker.number.int();
      const templateId = faker.number.int();
      const body: CreateAIFieldTemplateRequestDto = {
        title: faker.string.sample(),
        prompt: faker.string.sample(),
        model: 'gpt-4o',
        temperature: 0.5,
      };

      jest
        .spyOn(MockAIService, 'updateFieldTemplate')
        .mockResolvedValue(undefined);

      await aiController.updateFieldTemplate(projectId, templateId, body);

      expect(MockAIService.updateFieldTemplate).toHaveBeenCalledWith({
        ...body,
        projectId,
        templateId,
      });
    });
  });

  describe('deleteFieldTemplate', () => {
    it('should delete AI field template successfully', async () => {
      const projectId = faker.number.int();
      const templateId = faker.number.int();

      jest
        .spyOn(MockAIService, 'deleteFieldTemplateById')
        .mockResolvedValue(undefined);

      await aiController.deleteFieldTemplate(projectId, templateId);

      expect(MockAIService.deleteFieldTemplateById).toHaveBeenCalledWith(
        projectId,
        templateId,
      );
    });
  });

  describe('getIssueTemplates', () => {
    it('should get AI issue templates successfully', async () => {
      const projectId = faker.number.int();
      const mockTemplates = [
        {
          id: faker.number.int(),
          channelId: faker.number.int(),
          targetFieldKeys: ['message', 'title'],
          prompt: 'Generate issue recommendations',
          isEnabled: true,
          model: 'gpt-4o',
          temperature: 0.5,
          dataReferenceAmount: 3,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        },
      ];

      jest
        .spyOn(MockAIService, 'findIssueTemplatesByProjectId')
        .mockResolvedValue(mockTemplates);

      const result = await aiController.getIssueTemplates(projectId);

      expect(MockAIService.findIssueTemplatesByProjectId).toHaveBeenCalledWith(
        projectId,
      );
      expect(result).toBeDefined();
    });
  });

  describe('createNewIssueTemplate', () => {
    it('should create new AI issue template successfully', async () => {
      const projectId = faker.number.int();
      const body: CreateAIIssueTemplateRequestDto = {
        channelId: faker.number.int(),
        targetFieldKeys: ['message', 'title'],
        prompt: 'Generate issue recommendations',
        isEnabled: true,
        model: 'gpt-4o',
        temperature: 0.5,
        dataReferenceAmount: 3,
      };
      const mockTemplate = {
        id: faker.number.int(),
        ...body,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      jest
        .spyOn(MockAIService, 'createNewIssueTemplate')
        .mockResolvedValue(mockTemplate);

      const result = await aiController.createNewIssueTemplate(projectId, body);

      expect(MockAIService.createNewIssueTemplate).toHaveBeenCalledWith({
        ...body,
      });
      expect(result).toBeDefined();
    });
  });

  describe('updateIssueTemplate', () => {
    it('should update AI issue template successfully', async () => {
      const templateId = faker.number.int();
      const body: CreateAIIssueTemplateRequestDto = {
        channelId: faker.number.int(),
        targetFieldKeys: ['message', 'title'],
        prompt: 'Generate issue recommendations',
        isEnabled: true,
        model: 'gpt-4o',
        temperature: 0.5,
        dataReferenceAmount: 3,
      };

      jest
        .spyOn(MockAIService, 'updateIssueTemplate')
        .mockResolvedValue(undefined);

      await aiController.updateIssueTemplate(templateId, body);

      expect(MockAIService.updateIssueTemplate).toHaveBeenCalledWith({
        ...body,
        templateId,
      });
    });
  });

  describe('deleteIssueTemplate', () => {
    it('should delete AI issue template successfully', async () => {
      const templateId = faker.number.int();

      jest
        .spyOn(MockAIService, 'deleteIssueTemplateById')
        .mockResolvedValue(undefined);

      await aiController.deleteIssueTemplate(templateId);

      expect(MockAIService.deleteIssueTemplateById).toHaveBeenCalledWith(
        templateId,
      );
    });
  });

  describe('processAIFields', () => {
    it('should process AI fields successfully', async () => {
      const body: ProcessAIFieldRequestDto = {
        feedbackIds: [faker.number.int(), faker.number.int()],
      };

      jest
        .spyOn(MockAIService, 'processFeedbacksAIFields')
        .mockResolvedValue(undefined);

      await aiController.processAIFields(body);

      expect(MockAIService.processFeedbacksAIFields).toHaveBeenCalledWith(
        body.feedbackIds,
      );
    });
  });

  describe('processAIField', () => {
    it('should process single AI field successfully', async () => {
      const body: ProcessSingleAIFieldRequestDto = {
        feedbackId: faker.number.int(),
        aiFieldId: faker.number.int(),
      };

      jest.spyOn(MockAIService, 'processAIField').mockResolvedValue(undefined);

      await aiController.processAIField(body);

      expect(MockAIService.processAIField).toHaveBeenCalledWith(
        body.feedbackId,
        body.aiFieldId,
      );
    });
  });

  describe('getPlaygroundResult', () => {
    it('should get playground result successfully', async () => {
      const projectId = faker.number.int();
      const body: GetAIPlaygroundResultRequestDto = {
        model: 'gpt-4o',
        temperature: 0.5,
        templatePrompt: 'Test prompt',
        temporaryFields: [
          {
            name: 'message',
            description: 'User message',
            value: 'Test message',
          },
        ],
      };
      const mockResult = 'Test result';

      jest
        .spyOn(MockAIService, 'getPlaygroundPromptResult')
        .mockResolvedValue(mockResult);

      const result = await aiController.getPlaygroundResult(projectId, body);

      expect(MockAIService.getPlaygroundPromptResult).toHaveBeenCalledWith({
        ...body,
        projectId,
      });
      expect(result).toBeDefined();
    });
  });

  describe('recommendAIIssue', () => {
    it('should recommend AI issue successfully', async () => {
      const feedbackId = faker.number.int();
      const mockResult = {
        success: true,
        result: [{ issueName: 'Bug Report' }, { issueName: 'Feature Request' }],
      };

      jest
        .spyOn(MockAIService, 'recommendAIIssue')
        .mockResolvedValue(mockResult);

      const result = await aiController.recommendAIIssue(feedbackId);

      expect(MockAIService.recommendAIIssue).toHaveBeenCalledWith(feedbackId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAIIssuePlaygroundResult', () => {
    it('should get AI issue playground result successfully', async () => {
      const projectId = faker.number.int();
      const body: GetAIIssuePlaygroundResultRequestDto = {
        channelId: faker.number.int(),
        targetFieldKeys: ['message', 'title'],
        model: 'gpt-4o',
        temperature: 0.5,
        templatePrompt: 'Test prompt',
        dataReferenceAmount: 3,
        temporaryFields: [
          {
            name: 'message',
            description: 'User message',
            value: 'Test message',
          },
        ],
      };
      const mockResult = ['Issue 1', 'Issue 2'];

      jest
        .spyOn(MockAIService, 'getIssuePlaygroundPromptResult')
        .mockResolvedValue(mockResult);

      const result = await aiController.getAIIssuePlaygroundResult(
        projectId,
        body,
      );

      expect(MockAIService.getIssuePlaygroundPromptResult).toHaveBeenCalledWith(
        {
          ...body,
        },
      );
      expect(result).toBeDefined();
    });
  });

  describe('getUsages', () => {
    it('should get AI usages successfully', async () => {
      const projectId = faker.number.int();
      const from = faker.date.past();
      const to = faker.date.recent();
      const mockUsages = [
        {
          year: 2024,
          month: 1,
          day: 15,
          category: 'AI_FIELD',
          provider: AIProvidersEnum.OPEN_AI,
          usedTokens: 1000,
        },
      ];

      jest.spyOn(MockAIService, 'getUsages').mockResolvedValue(mockUsages);

      const result = await aiController.getUsages(projectId, from, to);

      expect(MockAIService.getUsages).toHaveBeenCalledWith(projectId, from, to);
      expect(result).toBeDefined();
    });
  });

  describe('Error Cases', () => {
    it('should handle service errors in validateAPIKey', async () => {
      const body: ValidteAPIKeyRequestDto = {
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
      };

      jest
        .spyOn(MockAIService, 'validateAPIKey')
        .mockRejectedValue(new BadRequestException('Invalid provider'));

      await expect(aiController.validateAPIKey(body)).rejects.toThrow(
        'Invalid provider',
      );
    });

    it('should handle service errors in getIntegration', async () => {
      const projectId = faker.number.int();

      jest
        .spyOn(MockAIService, 'getIntegration')
        .mockRejectedValue(new NotFoundException('Project not found'));

      await expect(aiController.getIntegration(projectId)).rejects.toThrow(
        'Project not found',
      );
    });

    it('should handle service errors in updateIntegration', async () => {
      const projectId = faker.number.int();
      const body: UpdateAIIntegrationsRequestDto = {
        provider: AIProvidersEnum.OPEN_AI,
        apiKey: faker.string.alphanumeric(32),
        endpointUrl: faker.internet.url(),
        systemPrompt: faker.string.sample(),
        tokenThreshold: faker.number.int(),
      };

      jest
        .spyOn(MockAIService, 'upsertIntegration')
        .mockRejectedValue(new BadRequestException('Invalid API key'));

      await expect(
        aiController.updateIntegration(projectId, body),
      ).rejects.toThrow('Invalid API key');
    });

    it('should handle service errors in getModels', async () => {
      const projectId = faker.number.int();

      jest
        .spyOn(MockAIService, 'getModels')
        .mockRejectedValue(new NotFoundException('Integration not found'));

      await expect(aiController.getModels(projectId)).rejects.toThrow(
        'Integration not found',
      );
    });

    it('should handle service errors in createNewFieldTemplate', async () => {
      const projectId = faker.number.int();
      const body: CreateAIFieldTemplateRequestDto = {
        title: faker.string.sample(),
        prompt: faker.string.sample(),
        model: 'gpt-4o',
        temperature: 0.5,
      };

      jest
        .spyOn(MockAIService, 'createNewFieldTemplate')
        .mockRejectedValue(new BadRequestException('Template already exists'));

      await expect(
        aiController.createNewFieldTemplate(projectId, body),
      ).rejects.toThrow('Template already exists');
    });

    it('should handle service errors in updateFieldTemplate', async () => {
      const projectId = faker.number.int();
      const templateId = faker.number.int();
      const body: CreateAIFieldTemplateRequestDto = {
        title: faker.string.sample(),
        prompt: faker.string.sample(),
        model: 'gpt-4o',
        temperature: 0.5,
      };

      jest
        .spyOn(MockAIService, 'updateFieldTemplate')
        .mockRejectedValue(new NotFoundException('Template not found'));

      await expect(
        aiController.updateFieldTemplate(projectId, templateId, body),
      ).rejects.toThrow('Template not found');
    });

    it('should handle service errors in deleteFieldTemplate', async () => {
      const projectId = faker.number.int();
      const templateId = faker.number.int();

      jest
        .spyOn(MockAIService, 'deleteFieldTemplateById')
        .mockRejectedValue(new NotFoundException('Template not found'));

      await expect(
        aiController.deleteFieldTemplate(projectId, templateId),
      ).rejects.toThrow('Template not found');
    });

    it('should handle service errors in processAIFields', async () => {
      const body: ProcessAIFieldRequestDto = {
        feedbackIds: [faker.number.int()],
      };

      jest
        .spyOn(MockAIService, 'processFeedbacksAIFields')
        .mockRejectedValue(new BadRequestException('Token threshold exceeded'));

      await expect(aiController.processAIFields(body)).rejects.toThrow(
        'Token threshold exceeded',
      );
    });

    it('should handle service errors in processAIField', async () => {
      const body: ProcessSingleAIFieldRequestDto = {
        feedbackId: faker.number.int(),
        aiFieldId: faker.number.int(),
      };

      jest
        .spyOn(MockAIService, 'processAIField')
        .mockRejectedValue(new NotFoundException('Feedback not found'));

      await expect(aiController.processAIField(body)).rejects.toThrow(
        'Feedback not found',
      );
    });

    it('should handle service errors in getPlaygroundResult', async () => {
      const projectId = faker.number.int();
      const body: GetAIPlaygroundResultRequestDto = {
        model: 'gpt-4o',
        temperature: 0.5,
        templatePrompt: 'Test prompt',
        temporaryFields: [],
      };

      jest
        .spyOn(MockAIService, 'getPlaygroundPromptResult')
        .mockRejectedValue(new BadRequestException('Token threshold exceeded'));

      await expect(
        aiController.getPlaygroundResult(projectId, body),
      ).rejects.toThrow('Token threshold exceeded');
    });

    it('should handle service errors in recommendAIIssue', async () => {
      const feedbackId = faker.number.int();

      jest
        .spyOn(MockAIService, 'recommendAIIssue')
        .mockRejectedValue(new NotFoundException('Feedback not found'));

      await expect(aiController.recommendAIIssue(feedbackId)).rejects.toThrow(
        'Feedback not found',
      );
    });

    it('should handle service errors in getAIIssuePlaygroundResult', async () => {
      const projectId = faker.number.int();
      const body: GetAIIssuePlaygroundResultRequestDto = {
        channelId: faker.number.int(),
        targetFieldKeys: ['message', 'title'],
        model: 'gpt-4o',
        temperature: 0.5,
        templatePrompt: 'Test prompt',
        dataReferenceAmount: 3,
        temporaryFields: [],
      };

      jest
        .spyOn(MockAIService, 'getIssuePlaygroundPromptResult')
        .mockRejectedValue(new NotFoundException('Channel not found'));

      await expect(
        aiController.getAIIssuePlaygroundResult(projectId, body),
      ).rejects.toThrow('Channel not found');
    });

    it('should handle service errors in getUsages', async () => {
      const projectId = faker.number.int();
      const from = faker.date.past();
      const to = faker.date.recent();

      jest
        .spyOn(MockAIService, 'getUsages')
        .mockRejectedValue(new NotFoundException('Project not found'));

      await expect(aiController.getUsages(projectId, from, to)).rejects.toThrow(
        'Project not found',
      );
    });
  });
});
