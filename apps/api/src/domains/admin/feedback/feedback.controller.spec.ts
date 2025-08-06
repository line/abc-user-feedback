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

  it('create', async () => {
    const projectId = faker.number.int();
    const channelId = faker.number.int();
    jest
      .spyOn(MockFeedbackService, 'create')
      .mockResolvedValue({ id: faker.number.int() });
    jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
      project: { id: projectId },
    } as ChannelEntity);

    await feedbackController.create(projectId, channelId, {});
    expect(MockFeedbackService.create).toHaveBeenCalledTimes(1);
  });
  it('findByChannelId', async () => {
    const channelId = faker.number.int();

    const dto = new FindFeedbacksByChannelIdRequestDto(
      faker.number.int(),
      faker.number.int(),
      {},
    );

    await feedbackController.findByChannelId(channelId, dto);
    expect(MockFeedbackService.findByChannelIdV2).toHaveBeenCalledTimes(1);
  });
  it('exportFeedbacks', async () => {
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
    jest.spyOn(MockFeedbackService, 'generateFile').mockResolvedValue({
      streamableFile: { getStream: jest.fn() },
      feedbackIds: [],
    });
    jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
      project: { name: faker.string.sample() },
    } as ChannelEntity);

    await feedbackController.exportFeedbacks(
      projectId,
      channelId,
      dto,
      response,
      userDto,
    );

    expect(MockFeedbackService.generateFile).toHaveBeenCalledTimes(1);
  });
  it('updateFeedback', async () => {
    const channelId = faker.number.int();
    const feedbackId = faker.number.int();
    const body = { [faker.string.sample()]: faker.string.sample() };

    await feedbackController.updateFeedback(channelId, feedbackId, body);
    expect(MockFeedbackService.updateFeedback).toHaveBeenCalledTimes(1);
  });

  it('delete Feedback', async () => {
    const channelId = faker.number.int();
    const feedbackIds = [faker.number.int()];

    const dto = new DeleteFeedbacksRequestDto();
    dto.feedbackIds = feedbackIds;

    await feedbackController.deleteMany(channelId, dto);
    expect(MockFeedbackService.deleteByIds).toHaveBeenCalledTimes(1);
  });
});
