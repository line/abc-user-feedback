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
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { FastifyReply } from 'fastify';
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { AuthService } from '../auth/auth.service';
import type { ChannelEntity } from '../channel/channel/channel.entity';
import { ChannelService } from '../channel/channel/channel.service';
import { HistoryService } from '../history/history.service';
import { UserDto } from '../user/dtos';
import {
  DeleteFeedbacksRequestDto,
  ExportFeedbacksRequestDto,
  FindFeedbacksByChannelIdRequestDto,
} from './dtos/requests';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

const MockFeedbackService = {
  create: jest.fn(),
  findByChannelId: jest.fn(),
  findByChannelIdV2: jest.fn(),
  upsertFeedbackItem: jest.fn(),
  updateFeedback: jest.fn(),
  deleteByIds: jest.fn(),
  generateFile: jest.fn(),
  addIssue: jest.fn(),
  removeIssue: jest.fn(),
};
const MockAuthService = {
  validateApiKey: jest.fn(),
};
const MockChannelService = {
  findById: jest.fn(),
};
const MockHistoryService = {
  createHistory: jest.fn(),
};

describe('FeedbackController', () => {
  let feedbackController: FeedbackController;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        getMockProvider(FeedbackService, MockFeedbackService),
        getMockProvider(AuthService, MockAuthService),
        getMockProvider(ChannelService, MockChannelService),
        getMockProvider(HistoryService, MockHistoryService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    feedbackController = module.get<FeedbackController>(FeedbackController);
  });

  describe('create', () => {
    it('should create feedback successfully', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const body = { message: faker.string.sample() };

      jest
        .spyOn(MockFeedbackService, 'create')
        .mockResolvedValue({ id: feedbackId });
      jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as ChannelEntity);

      const result = await feedbackController.create(
        projectId,
        channelId,
        body,
      );

      expect(MockChannelService.findById).toHaveBeenCalledWith({ channelId });
      expect(MockFeedbackService.create).toHaveBeenCalledWith({
        data: body,
        channelId,
      });
      expect(result).toEqual({ id: feedbackId });
    });

    it('should throw BadRequestException when channel project id does not match', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const differentProjectId = faker.number.int();

      jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
        project: { id: differentProjectId },
      } as ChannelEntity);

      await expect(
        feedbackController.create(projectId, channelId, {}),
      ).rejects.toThrow('Invalid channel id');

      expect(MockChannelService.findById).toHaveBeenCalledWith({ channelId });
      expect(MockFeedbackService.create).not.toHaveBeenCalled();
    });
  });

  describe('findByChannelId', () => {
    it('should find feedbacks by channel id successfully', async () => {
      const channelId = faker.number.int();
      const limit = faker.number.int({ min: 1, max: 100 });
      const page = faker.number.int({ min: 1, max: 10 });

      const dto = new FindFeedbacksByChannelIdRequestDto(limit, page, {
        message: 'test',
      });
      const mockResult = {
        items: [{ id: faker.number.int(), message: 'test' }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: limit,
          totalPages: 1,
          currentPage: page,
        },
      };

      jest
        .spyOn(MockFeedbackService, 'findByChannelIdV2')
        .mockResolvedValue(mockResult);

      const result = await feedbackController.findByChannelId(channelId, dto);

      expect(MockFeedbackService.findByChannelIdV2).toHaveBeenCalledWith({
        ...dto,
        channelId,
      });
      expect(result).toBeDefined();
    });
  });

  describe('addIssue', () => {
    it('should add issue to feedback successfully', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const issueId = faker.number.int();
      const mockResult = { success: true };

      jest.spyOn(MockFeedbackService, 'addIssue').mockResolvedValue(mockResult);

      const result = await feedbackController.addIssue(
        channelId,
        feedbackId,
        issueId,
      );

      expect(MockFeedbackService.addIssue).toHaveBeenCalledWith({
        issueId,
        channelId,
        feedbackId,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('removeIssue', () => {
    it('should remove issue from feedback successfully', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const issueId = faker.number.int();
      const mockResult = { success: true };

      jest
        .spyOn(MockFeedbackService, 'removeIssue')
        .mockResolvedValue(mockResult);

      const result = await feedbackController.removeIssue(
        channelId,
        feedbackId,
        issueId,
      );

      expect(MockFeedbackService.removeIssue).toHaveBeenCalledWith({
        issueId,
        channelId,
        feedbackId,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('exportFeedbacks', () => {
    it('should export feedbacks successfully', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const response = {
        type: jest.fn(),
        header: jest.fn(),
        send: jest.fn(),
      } as unknown as FastifyReply;
      const dto = new ExportFeedbacksRequestDto(
        faker.number.int(),
        faker.number.int(),
      );
      const userDto = new UserDto();
      const mockStream = { pipe: jest.fn() };

      jest.spyOn(MockFeedbackService, 'generateFile').mockResolvedValue({
        streamableFile: { getStream: jest.fn().mockReturnValue(mockStream) },
        feedbackIds: [faker.number.int()],
      });
      jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
        project: { name: faker.string.sample() },
        name: faker.string.sample(),
      } as ChannelEntity);

      await feedbackController.exportFeedbacks(
        projectId,
        channelId,
        dto,
        response,
        userDto,
      );

      expect(MockChannelService.findById).toHaveBeenCalledWith({ channelId });
      expect(MockFeedbackService.generateFile).toHaveBeenCalledWith({
        projectId,
        channelId,
        queries: dto.queries,
        operator: dto.operator,
        sort: dto.sort,
        type: dto.type,
        fieldIds: dto.fieldIds,
        filterFeedbackIds: dto.filterFeedbackIds,
        defaultQueries: dto.defaultQueries,
      });
      expect(MockHistoryService.createHistory).toHaveBeenCalled();
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback successfully', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const body = { message: faker.string.sample() };

      jest
        .spyOn(MockFeedbackService, 'updateFeedback')
        .mockResolvedValue(undefined);

      await feedbackController.updateFeedback(channelId, feedbackId, body);

      expect(MockFeedbackService.updateFeedback).toHaveBeenCalledWith({
        channelId,
        feedbackId,
        data: body,
      });
    });
  });

  describe('deleteMany', () => {
    it('should delete feedbacks successfully', async () => {
      const channelId = faker.number.int();
      const feedbackIds = [faker.number.int(), faker.number.int()];

      const dto = new DeleteFeedbacksRequestDto();
      dto.feedbackIds = feedbackIds;

      jest
        .spyOn(MockFeedbackService, 'deleteByIds')
        .mockResolvedValue(undefined);

      await feedbackController.deleteMany(channelId, dto);

      expect(MockFeedbackService.deleteByIds).toHaveBeenCalledWith({
        channelId,
        feedbackIds,
      });
    });
  });

  describe('Error Cases', () => {
    it('should handle service errors in create', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const body = { message: faker.string.sample() };

      jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as ChannelEntity);
      jest
        .spyOn(MockFeedbackService, 'create')
        .mockRejectedValue(new BadRequestException('Invalid field key: test'));

      await expect(
        feedbackController.create(projectId, channelId, body),
      ).rejects.toThrow('Invalid field key: test');
    });

    it('should handle service errors in findByChannelId', async () => {
      const channelId = faker.number.int();
      const dto = new FindFeedbacksByChannelIdRequestDto(10, 1, {});

      jest
        .spyOn(MockFeedbackService, 'findByChannelIdV2')
        .mockRejectedValue(new BadRequestException('Invalid channel'));

      await expect(
        feedbackController.findByChannelId(channelId, dto),
      ).rejects.toThrow('Invalid channel');
    });

    it('should handle service errors in updateFeedback', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const body = { message: faker.string.sample() };

      jest
        .spyOn(MockFeedbackService, 'updateFeedback')
        .mockRejectedValue(new BadRequestException('This field is read-only'));

      await expect(
        feedbackController.updateFeedback(channelId, feedbackId, body),
      ).rejects.toThrow('This field is read-only');
    });

    it('should handle service errors in deleteMany', async () => {
      const channelId = faker.number.int();
      const feedbackIds = [faker.number.int()];
      const dto = new DeleteFeedbacksRequestDto();
      dto.feedbackIds = feedbackIds;

      jest
        .spyOn(MockFeedbackService, 'deleteByIds')
        .mockRejectedValue(new BadRequestException('Feedback not found'));

      await expect(
        feedbackController.deleteMany(channelId, dto),
      ).rejects.toThrow('Feedback not found');
    });

    it('should handle service errors in addIssue', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const issueId = faker.number.int();

      jest
        .spyOn(MockFeedbackService, 'addIssue')
        .mockRejectedValue(new BadRequestException('Issue not found'));

      await expect(
        feedbackController.addIssue(channelId, feedbackId, issueId),
      ).rejects.toThrow('Issue not found');
    });

    it('should handle service errors in removeIssue', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const issueId = faker.number.int();

      jest
        .spyOn(MockFeedbackService, 'removeIssue')
        .mockRejectedValue(new BadRequestException('Issue not found'));

      await expect(
        feedbackController.removeIssue(channelId, feedbackId, issueId),
      ).rejects.toThrow('Issue not found');
    });

    it('should handle service errors in exportFeedbacks', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const response = {
        type: jest.fn(),
        header: jest.fn(),
        send: jest.fn(),
      } as unknown as FastifyReply;
      const dto = new ExportFeedbacksRequestDto(10, 1);
      const userDto = new UserDto();

      jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
        project: { name: faker.string.sample() },
        name: faker.string.sample(),
      } as ChannelEntity);
      jest
        .spyOn(MockFeedbackService, 'generateFile')
        .mockRejectedValue(new BadRequestException('Invalid export type'));

      await expect(
        feedbackController.exportFeedbacks(
          projectId,
          channelId,
          dto,
          response,
          userDto,
        ),
      ).rejects.toThrow('Invalid export type');
    });
  });
});
