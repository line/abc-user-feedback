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

describe('FeedbackStatisticsController', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountByDateByChannel', () => {
    it('should call service with correct parameters and return transformed response', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const channelIds = '1,2,3';
      const mockServiceResponse = {
        channels: [
          {
            id: 1,
            name: 'Channel 1',
            statistics: [
              {
                startDate: '2023-01-01',
                endDate: '2023-01-01',
                count: 10,
              },
            ],
          },
        ],
      };

      MockFeedbackStatisticsService.getCountByDateByChannel.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getCountByDateByChannel(
        startDate,
        endDate,
        interval,
        channelIds,
      );

      expect(
        MockFeedbackStatisticsService.getCountByDateByChannel,
      ).toHaveBeenCalledTimes(1);
      expect(
        MockFeedbackStatisticsService.getCountByDateByChannel,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        channelIds: [1, 2, 3],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle empty channelIds string', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'week' as const;
      const channelIds = '';
      const mockServiceResponse = { channels: [] };

      MockFeedbackStatisticsService.getCountByDateByChannel.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getCountByDateByChannel(
        startDate,
        endDate,
        interval,
        channelIds,
      );

      expect(
        MockFeedbackStatisticsService.getCountByDateByChannel,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        channelIds: [],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should filter out invalid channelIds', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'month' as const;
      const channelIds = '1,invalid,3,abc';
      const mockServiceResponse = { channels: [] };

      MockFeedbackStatisticsService.getCountByDateByChannel.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getCountByDateByChannel(
        startDate,
        endDate,
        interval,
        channelIds,
      );

      expect(
        MockFeedbackStatisticsService.getCountByDateByChannel,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        channelIds: [1, 3],
      });
      expect(result).toEqual(mockServiceResponse);
    });
  });

  describe('getCount', () => {
    it('should call service with correct parameters and return transformed response', async () => {
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const mockServiceResponse = { count: 42 };

      MockFeedbackStatisticsService.getCount.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getCount(
        from,
        to,
        projectId,
      );

      expect(MockFeedbackStatisticsService.getCount).toHaveBeenCalledTimes(1);
      expect(MockFeedbackStatisticsService.getCount).toHaveBeenCalledWith({
        from,
        to,
        projectId,
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle zero count response', async () => {
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const mockServiceResponse = { count: 0 };

      MockFeedbackStatisticsService.getCount.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getCount(
        from,
        to,
        projectId,
      );

      expect(MockFeedbackStatisticsService.getCount).toHaveBeenCalledWith({
        from,
        to,
        projectId,
      });
      expect(result).toEqual(mockServiceResponse);
    });
  });

  describe('getIssuedRatio', () => {
    it('should call service with correct parameters and return transformed response', async () => {
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const mockServiceResponse = { ratio: 0.75 };

      MockFeedbackStatisticsService.getIssuedRatio.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getIssuedRatio(
        from,
        to,
        projectId,
      );

      expect(
        MockFeedbackStatisticsService.getIssuedRatio,
      ).toHaveBeenCalledTimes(1);
      expect(MockFeedbackStatisticsService.getIssuedRatio).toHaveBeenCalledWith(
        {
          from,
          to,
          projectId,
        },
      );
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle zero ratio response', async () => {
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const mockServiceResponse = { ratio: 0 };

      MockFeedbackStatisticsService.getIssuedRatio.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getIssuedRatio(
        from,
        to,
        projectId,
      );

      expect(MockFeedbackStatisticsService.getIssuedRatio).toHaveBeenCalledWith(
        {
          from,
          to,
          projectId,
        },
      );
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle maximum ratio response', async () => {
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const mockServiceResponse = { ratio: 1 };

      MockFeedbackStatisticsService.getIssuedRatio.mockResolvedValue(
        mockServiceResponse,
      );

      const result = await feedbackStatisticsController.getIssuedRatio(
        from,
        to,
        projectId,
      );

      expect(MockFeedbackStatisticsService.getIssuedRatio).toHaveBeenCalledWith(
        {
          from,
          to,
          projectId,
        },
      );
      expect(result).toEqual(mockServiceResponse);
    });
  });
});
