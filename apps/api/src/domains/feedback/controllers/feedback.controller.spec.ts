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
import * as XLSX from 'xlsx';

import { getMockProvider } from '@/utils/test-utils';

import { FeedbackService } from '../services/feedback.service';
import {
  FindFeedbacksByChannelIdRequestDto,
  UpsertFeedbackItemRequestDto,
} from './dtos/requests';
import { FeedbackController } from './feedback.controller';

jest.spyOn(XLSX.utils, 'book_new');
jest.spyOn(XLSX.utils, 'json_to_sheet');
jest.spyOn(XLSX.utils, 'book_append_sheet');
jest.spyOn(XLSX, 'write');

describe('FeedbackController', () => {
  let feedbackController: FeedbackController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [getMockProvider(FeedbackService, MockFeedbackService)],
    }).compile();

    feedbackController = module.get<FeedbackController>(FeedbackController);
  });

  it('create', async () => {
    jest
      .spyOn(MockFeedbackService, 'create')
      .mockResolvedValue({ id: faker.datatype.uuid() });

    const channelId = faker.datatype.uuid();

    await feedbackController.create(channelId, {});
    expect(MockFeedbackService.create).toBeCalledTimes(1);
  });
  it('findByChannelId', async () => {
    const channelId = faker.datatype.uuid();

    const dto = new FindFeedbacksByChannelIdRequestDto();
    dto.limit = faker.datatype.number();
    dto.page = faker.datatype.number();

    await feedbackController.findByChannelId(channelId, dto);
    expect(MockFeedbackService.findByChannelId).toBeCalledTimes(1);
  });
  // it('exportFeedbacks', async () => {
  //   const channelId = faker.datatype.uuid();
  //   const response = {
  //     type: jest.fn(),
  //     header: jest.fn(),
  //     send: jest.fn(),
  //   } as unknown as Response;

  //   const dto = new ExportFeedbacksRequestDto();
  //   dto.limit = faker.datatype.number();
  //   dto.page = faker.datatype.number();
  //   dto.type = 'csv';

  //   await feedbackController.exportFeedbacks(channelId, dto, response);
  //   expect(MockFeedbackService.findByChannelId).toBeCalledTimes(1);
  // });
  it('upsertFeedbackItem', async () => {
    const channelId = faker.datatype.uuid();
    const feedbackId = faker.datatype.uuid();
    const fieldId = faker.datatype.uuid();

    const dto = new UpsertFeedbackItemRequestDto();
    dto.value = faker.datatype.string();

    await feedbackController.upsertFeedbackItem(
      channelId,
      feedbackId,
      fieldId,
      dto,
    );
    expect(MockFeedbackService.upsertFeedbackItem).toBeCalledTimes(1);
  });
});

const MockFeedbackService = {
  create: jest.fn(),
  findByChannelId: jest.fn(),
  upsertFeedbackItem: jest.fn(),
};
