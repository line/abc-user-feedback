/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { FastifyReply } from 'fastify';
import { DataSource } from 'typeorm';
import * as XLSX from 'xlsx';

import { MockDataSource, getMockProvider } from '@/utils/test-utils';

import { AuthService } from '../auth/auth.service';
import { ChannelEntity } from '../channel/channel/channel.entity';
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

jest.spyOn(XLSX.utils, 'book_new');
jest.spyOn(XLSX.utils, 'json_to_sheet');
jest.spyOn(XLSX.utils, 'book_append_sheet');
jest.spyOn(XLSX, 'write');

const MockFeedbackService = {
  create: jest.fn(),
  findByChannelId: jest.fn(),
  upsertFeedbackItem: jest.fn(),
  deleteByIds: jest.fn(),
  findForDownload: jest.fn(),
  updateFeedback: jest.fn(),
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
    const projectId = faker.datatype.number();
    const channelId = faker.datatype.number();
    jest
      .spyOn(MockFeedbackService, 'create')
      .mockResolvedValue({ id: faker.datatype.number() });
    jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
      project: { id: projectId },
    } as ChannelEntity);

    await feedbackController.create(projectId, channelId, {});
    expect(MockFeedbackService.create).toBeCalledTimes(1);
  });
  it('findByChannelId', async () => {
    const channelId = faker.datatype.number();

    const dto = new FindFeedbacksByChannelIdRequestDto(
      faker.datatype.number(),
      faker.datatype.number(),
      {},
    );

    await feedbackController.findByChannelId(channelId, dto);
    expect(MockFeedbackService.findByChannelId).toBeCalledTimes(1);
  });
  it('exportFeedbacks', async () => {
    const channelId = faker.datatype.number();
    const response = {
      type: jest.fn(),
      header: jest.fn(),
      send: jest.fn(),
    } as unknown as FastifyReply;
    const dto = new ExportFeedbacksRequestDto(
      faker.datatype.number(),
      faker.datatype.number(),
      'csv',
    );
    const userDto = new UserDto();
    jest
      .spyOn(MockFeedbackService, 'findForDownload')
      .mockResolvedValue({ feedbacks: [], fields: [] });
    jest.spyOn(MockChannelService, 'findById').mockResolvedValue({
      project: { name: faker.datatype.string() },
    } as ChannelEntity);

    await feedbackController.exportFeedbacks(
      channelId,
      dto,
      'csv',
      response,
      userDto,
    );

    expect(MockFeedbackService.findForDownload).toBeCalledTimes(1);
  });
  it('updateFeedback', async () => {
    const channelId = faker.datatype.number();
    const feedbackId = faker.datatype.number();
    const body = { [faker.datatype.string()]: faker.datatype.string() };

    await feedbackController.updateFeedback(channelId, feedbackId, body);
    expect(MockFeedbackService.updateFeedback).toBeCalledTimes(1);
  });

  it('delete Feedback', async () => {
    const channelId = faker.datatype.number();
    const feedbackIds = [faker.datatype.number()];

    const dto = new DeleteFeedbacksRequestDto();
    dto.feedbackIds = feedbackIds;

    await feedbackController.deleteMany(channelId, dto);
    expect(MockFeedbackService.deleteByIds).toBeCalledTimes(1);
  });
});
