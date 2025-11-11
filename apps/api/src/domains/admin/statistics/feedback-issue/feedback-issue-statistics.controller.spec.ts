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
import { Test } from '@nestjs/testing';

import { getMockProvider } from '@/test-utils/util-functions';
import { FeedbackIssueStatisticsController } from './feedback-issue-statistics.controller';
import { FeedbackIssueStatisticsService } from './feedback-issue-statistics.service';

const MockFeedbackIssueStatisticsService = {
  getCountByDateByIssue: jest.fn(),
};

describe('FeedbackIssueStatisticsController', () => {
  let feedbackIssueStatisticsController: FeedbackIssueStatisticsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FeedbackIssueStatisticsController],
      providers: [
        getMockProvider(
          FeedbackIssueStatisticsService,
          MockFeedbackIssueStatisticsService,
        ),
      ],
    }).compile();

    feedbackIssueStatisticsController =
      module.get<FeedbackIssueStatisticsController>(
        FeedbackIssueStatisticsController,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountByDateByIssue', () => {
    it('should call service with correct parameters and return transformed response', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = '1,2,3';
      const mockServiceResponse = {
        issues: [
          {
            id: 1,
            name: 'Issue 1',
            statistics: [
              {
                startDate: '2023-01-01',
                endDate: '2023-01-01',
                feedbackCount: 10,
              },
            ],
          },
        ],
      };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledTimes(1);
      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [1, 2, 3],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle empty issueIds string', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'week' as const;
      const issueIds = '';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should filter out invalid issueIds', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'month' as const;
      const issueIds = '1,invalid,2,3.5,4';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [1, 2, 3, 4],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle single issueId', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = '42';
      const mockServiceResponse = {
        issues: [
          {
            id: 42,
            name: 'Single Issue',
            statistics: [
              {
                startDate: '2023-01-01',
                endDate: '2023-01-01',
                feedbackCount: 5,
              },
            ],
          },
        ],
      };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [42],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle all interval types', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const issueIds = '1,2';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const intervals: ('day' | 'week' | 'month')[] = ['day', 'week', 'month'];

      for (const interval of intervals) {
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

        expect(
          MockFeedbackIssueStatisticsService.getCountByDateByIssue,
        ).toHaveBeenCalledWith({
          startDate,
          endDate,
          interval,
          issueIds: [1, 2],
        });
      }

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledTimes(3);
    });

    it('should handle service errors gracefully', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = '1,2';
      const error = new Error('Database connection failed');

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockRejectedValue(
        error,
      );

      await expect(
        feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        ),
      ).rejects.toThrow('Database connection failed');

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle whitespace in issueIds', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = ' 1 , 2 , 3 ';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [1, 2, 3],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle negative issueIds', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = '1,-2,3';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [1, -2, 3],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle zero issueIds', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = '0';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [0],
      });
      expect(result).toEqual(mockServiceResponse);
    });

    it('should handle very large issueIds', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const issueIds = '999999999,1000000000';
      const mockServiceResponse = { issues: [] };

      MockFeedbackIssueStatisticsService.getCountByDateByIssue.mockResolvedValue(
        mockServiceResponse,
      );

      const result =
        await feedbackIssueStatisticsController.getCountByDateByIssue(
          startDate,
          endDate,
          interval,
          issueIds,
        );

      expect(
        MockFeedbackIssueStatisticsService.getCountByDateByIssue,
      ).toHaveBeenCalledWith({
        startDate,
        endDate,
        interval,
        issueIds: [999999999, 1000000000],
      });
      expect(result).toEqual(mockServiceResponse);
    });
  });
});
