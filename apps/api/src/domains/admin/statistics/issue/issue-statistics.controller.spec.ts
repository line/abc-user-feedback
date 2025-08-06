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
  getIssuedRatio: jest.fn(),
};

describe('Issue Statistics Controller', () => {
  let issueStatisticsController: IssueStatisticsController;

  beforeEach(async () => {
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

    await issueStatisticsController.getCountByDate(
      startDate,
      endDate,
      interval,
      projectId,
    );

    expect(MockIssueStatisticsService.getCountByDate).toHaveBeenCalledTimes(1);
  });

  it('getCount', async () => {
    jest.spyOn(MockIssueStatisticsService, 'getCountByDate');
    const from = faker.date.past();
    const to = faker.date.future();
    const projectId = faker.number.int();
    await issueStatisticsController.getCount(from, to, projectId);
    expect(MockIssueStatisticsService.getCount).toHaveBeenCalledTimes(1);
  });
});
