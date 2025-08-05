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
import { FeedbackIssueStatisticsController } from './feedback-issue-statistics.controller';
import { FeedbackIssueStatisticsService } from './feedback-issue-statistics.service';

const MockFeedbackIssueStatisticsService = {
  getCountByDateByIssue: jest.fn(),
};

describe('FeedbackIssue Statistics Controller', () => {
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

  it('getCountByDateByIssue', async () => {
    jest.spyOn(MockFeedbackIssueStatisticsService, 'getCountByDateByIssue');
    const startDate = '2023-01-01';
    const endDate = '2023-12-01';
    const interval = ['day', 'week', 'month'][
      faker.number.int({ min: 0, max: 2 })
    ] as 'day' | 'week' | 'month';
    const issueIds = [faker.number.int(), faker.number.int()];

    await feedbackIssueStatisticsController.getCountByDateByIssue(
      startDate,
      endDate,
      interval,
      issueIds.join(','),
    );

    expect(
      MockFeedbackIssueStatisticsService.getCountByDateByIssue,
    ).toHaveBeenCalledTimes(1);
  });
});
