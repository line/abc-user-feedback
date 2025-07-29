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

import { getMockProvider } from '@/test-utils/util-functions';
import { FeedbackStatisticsController } from './feedback-statistics.controller';
import { FeedbackStatisticsService } from './feedback-statistics.service';

const MockFeedbackStatisticsService = {
  getCountByDateByChannel: jest.fn(),
  getCount: jest.fn(),
  getIssuedRatio: jest.fn(),
};

describe('Feedback Statistics Controller', () => {
  let feedbackStatisticsController: FeedbackStatisticsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FeedbackStatisticsController],
      providers: [
        getMockProvider(
          FeedbackStatisticsService,
          MockFeedbackStatisticsService,
        ),
      ],
    }).compile();

    feedbackStatisticsController = module.get<FeedbackStatisticsController>(
      FeedbackStatisticsController,
    );
  });

  it('getCountByDateByChannel', async () => {
    jest.spyOn(MockFeedbackStatisticsService, 'getCountByDateByChannel');
    const startDate = '2023-01-01';
    const endDate = '2023-12-01';
    const interval = ['day', 'week', 'month'][
      faker.number.int({ min: 0, max: 2 })
    ] as 'day' | 'week' | 'month';
    const channelIds = [faker.number.int(), faker.number.int()];

    await feedbackStatisticsController.getCountByDateByChannel(
      startDate,
      endDate,
      interval,
      channelIds.join(','),
    );

    expect(
      MockFeedbackStatisticsService.getCountByDateByChannel,
    ).toHaveBeenCalledTimes(1);
  });

  it('getCount', async () => {
    jest.spyOn(MockFeedbackStatisticsService, 'getCountByDateByChannel');
    const from = faker.date.past();
    const to = faker.date.future();
    const projectId = faker.number.int();
    await feedbackStatisticsController.getCount(from, to, projectId);
    expect(MockFeedbackStatisticsService.getCount).toHaveBeenCalledTimes(1);
  });

  it('getIssuedRatio', async () => {
    jest.spyOn(MockFeedbackStatisticsService, 'getIssuedRatio');
    const from = faker.date.past();
    const to = faker.date.future();
    const projectId = faker.number.int();
    await feedbackStatisticsController.getIssuedRatio(from, to, projectId);
    expect(MockFeedbackStatisticsService.getIssuedRatio).toHaveBeenCalledTimes(
      1,
    );
  });
});
