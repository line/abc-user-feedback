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
import { IssueStatisticsController } from './issue-statistics.controller';
import { IssueStatisticsService } from './issue-statistics.service';

const MockIssueStatisticsService = {
  getCountByDate: jest.fn(),
  getCount: jest.fn(),
  getCountByStatus: jest.fn(),
};

describe('Issue Statistics Controller', () => {
  let issueStatisticsController: IssueStatisticsController;

  beforeEach(async () => {
    // Mock 초기화
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [IssueStatisticsController],
      providers: [
        getMockProvider(IssueStatisticsService, MockIssueStatisticsService),
      ],
    }).compile();

    issueStatisticsController = module.get<IssueStatisticsController>(
      IssueStatisticsController,
    );
  });

  it('getCountByDate', async () => {
    jest.spyOn(MockIssueStatisticsService, 'getCountByDate');
    const startDate = '2023-01-01';
    const endDate = '2023-12-01';
    const interval = ['day', 'week', 'month'][
      faker.number.int({ min: 0, max: 2 })
    ] as 'day' | 'week' | 'month';
    const projectId = faker.number.int();
    const mockResult = {
      statistics: [
        {
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          count: faker.number.int({ min: 0, max: 100 }),
        },
        {
          startDate: '2023-01-02',
          endDate: '2023-01-02',
          count: faker.number.int({ min: 0, max: 100 }),
        },
      ],
    };

    MockIssueStatisticsService.getCountByDate.mockResolvedValue(mockResult);

    const result = await issueStatisticsController.getCountByDate(
      startDate,
      endDate,
      interval,
      projectId,
    );

    expect(MockIssueStatisticsService.getCountByDate).toHaveBeenCalledTimes(1);
    expect(MockIssueStatisticsService.getCountByDate).toHaveBeenCalledWith({
      startDate,
      endDate,
      interval,
      projectId,
    });
    expect(result).toEqual(mockResult);
  });

  it('getCount', async () => {
    jest.spyOn(MockIssueStatisticsService, 'getCount');
    const from = faker.date.past();
    const to = faker.date.future();
    const projectId = faker.number.int();
    const mockResult = { count: faker.number.int({ min: 0, max: 1000 }) };

    MockIssueStatisticsService.getCount.mockResolvedValue(mockResult);

    const result = await issueStatisticsController.getCount(
      from,
      to,
      projectId,
    );

    expect(MockIssueStatisticsService.getCount).toHaveBeenCalledTimes(1);
    expect(MockIssueStatisticsService.getCount).toHaveBeenCalledWith({
      from,
      to,
      projectId,
    });
    expect(result).toEqual(mockResult);
  });

  it('getCountByStatus', async () => {
    jest.spyOn(MockIssueStatisticsService, 'getCountByStatus');
    const projectId = faker.number.int();
    const mockResult = {
      statistics: [
        { status: 'OPEN', count: faker.number.int({ min: 0, max: 100 }) },
        { status: 'CLOSED', count: faker.number.int({ min: 0, max: 100 }) },
        {
          status: 'IN_PROGRESS',
          count: faker.number.int({ min: 0, max: 100 }),
        },
      ],
    };

    MockIssueStatisticsService.getCountByStatus.mockResolvedValue(mockResult);

    const result = await issueStatisticsController.getCountByStatus(projectId);

    expect(MockIssueStatisticsService.getCountByStatus).toHaveBeenCalledTimes(
      1,
    );
    expect(MockIssueStatisticsService.getCountByStatus).toHaveBeenCalledWith({
      projectId,
    });
    expect(result).toEqual(mockResult);
  });

  describe('Edge Cases', () => {
    it('getCountByDate with empty statistics', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCountByDate');
      const startDate = '2023-01-01';
      const endDate = '2023-01-02';
      const interval = 'day' as const;
      const projectId = faker.number.int();
      const mockResult = { statistics: [] };

      MockIssueStatisticsService.getCountByDate.mockResolvedValue(mockResult);

      const result = await issueStatisticsController.getCountByDate(
        startDate,
        endDate,
        interval,
        projectId,
      );

      expect(result).toEqual(mockResult);
    });

    it('getCountByStatus with empty statistics', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCountByStatus');
      const projectId = faker.number.int();
      const mockResult = { statistics: [] };

      MockIssueStatisticsService.getCountByStatus.mockResolvedValue(mockResult);

      const result =
        await issueStatisticsController.getCountByStatus(projectId);

      expect(result).toEqual(mockResult);
    });

    it('getCount with zero count', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCount');
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const mockResult = { count: 0 };

      MockIssueStatisticsService.getCount.mockResolvedValue(mockResult);

      const result = await issueStatisticsController.getCount(
        from,
        to,
        projectId,
      );

      expect(result).toEqual(mockResult);
    });

    it('getCountByDate with different interval types', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCountByDate');
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const projectId = faker.number.int();

      const intervals: ('day' | 'week' | 'month')[] = ['day', 'week', 'month'];

      for (const interval of intervals) {
        const mockResult = {
          statistics: [
            {
              startDate: '2023-01-01',
              endDate:
                interval === 'day' ? '2023-01-01'
                : interval === 'week' ? '2023-01-07'
                : '2023-01-31',
              count: faker.number.int({ min: 0, max: 100 }),
            },
          ],
        };

        MockIssueStatisticsService.getCountByDate.mockResolvedValue(mockResult);

        const result = await issueStatisticsController.getCountByDate(
          startDate,
          endDate,
          interval,
          projectId,
        );

        expect(MockIssueStatisticsService.getCountByDate).toHaveBeenCalledWith({
          startDate,
          endDate,
          interval,
          projectId,
        });
        expect(result).toEqual(mockResult);
      }
    });
  });

  describe('Error Handling', () => {
    it('getCount should handle service errors', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCount');
      const from = faker.date.past();
      const to = faker.date.future();
      const projectId = faker.number.int();
      const error = new Error('Database connection failed');

      MockIssueStatisticsService.getCount.mockRejectedValue(error);

      await expect(
        issueStatisticsController.getCount(from, to, projectId),
      ).rejects.toThrow('Database connection failed');
    });

    it('getCountByDate should handle service errors', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCountByDate');
      const startDate = '2023-01-01';
      const endDate = '2023-12-01';
      const interval = 'day' as const;
      const projectId = faker.number.int();
      const error = new Error('Invalid date range');

      MockIssueStatisticsService.getCountByDate.mockRejectedValue(error);

      await expect(
        issueStatisticsController.getCountByDate(
          startDate,
          endDate,
          interval,
          projectId,
        ),
      ).rejects.toThrow('Invalid date range');
    });

    it('getCountByStatus should handle service errors', async () => {
      jest.spyOn(MockIssueStatisticsService, 'getCountByStatus');
      const projectId = faker.number.int();
      const error = new Error('Project not found');

      MockIssueStatisticsService.getCountByStatus.mockRejectedValue(error);

      await expect(
        issueStatisticsController.getCountByStatus(projectId),
      ).rejects.toThrow('Project not found');
    });
  });
});
