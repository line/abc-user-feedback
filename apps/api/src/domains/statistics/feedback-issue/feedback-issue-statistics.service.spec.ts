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
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import { FeedbackIssueStatisticsServiceProviders } from '@/test-utils/providers/feedback-issue-statistics.service.providers';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { GetCountByDateByIssueDto } from './dtos';
import { FeedbackIssueStatisticsEntity } from './feedback-issue-statistics.entity';
import { FeedbackIssueStatisticsService } from './feedback-issue-statistics.service';

const feedbackIssueStatsFixture = [
  {
    id: 1,
    date: new Date('2023-01-01'),
    feedbackCount: 1,
    issue: {
      id: 1,
      name: 'issue1',
    },
  },
  {
    id: 2,
    date: new Date('2023-01-02'),
    feedbackCount: 2,
    issue: {
      id: 1,
      name: 'issue1',
    },
  },
  {
    id: 3,
    date: new Date('2023-01-08'),
    feedbackCount: 3,
    issue: {
      id: 1,
      name: 'issue1',
    },
  },
  {
    id: 4,
    date: new Date('2023-02-01'),
    feedbackCount: 4,
    issue: {
      id: 1,
      name: 'issue1',
    },
  },
] as FeedbackIssueStatisticsEntity[];

describe('FeedbackIssueStatisticsService suite', () => {
  let feedbackIssueStatsService: FeedbackIssueStatisticsService;
  let feedbackIssueStatsRepo: Repository<FeedbackIssueStatisticsEntity>;
  let feedbackRepo: Repository<FeedbackEntity>;
  let issueRepo: Repository<IssueEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: FeedbackIssueStatisticsServiceProviders,
    }).compile();

    feedbackIssueStatsService = module.get<FeedbackIssueStatisticsService>(
      FeedbackIssueStatisticsService,
    );
    feedbackIssueStatsRepo = module.get(
      getRepositoryToken(FeedbackIssueStatisticsEntity),
    );
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    schedulerRegistry = module.get(SchedulerRegistry);
  });

  describe('getCountByDateByissue', () => {
    it('getting counts by day by issue succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');
      const interval = 'day';
      const issueIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.from = from;
      dto.to = to;
      dto.interval = interval;
      dto.issueIds = issueIds;
      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(feedbackIssueStatsFixture);

      const countByDateByissue =
        await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(feedbackIssueStatsRepo.find).toBeCalledTimes(1);
      expect(countByDateByissue).toEqual({
        issues: [
          {
            id: 1,
            name: 'issue1',
            statistics: [
              {
                feedbackCount: 1,
                date: '2023-01-01',
              },
              {
                feedbackCount: 2,
                date: '2023-01-02',
              },
              {
                feedbackCount: 3,
                date: '2023-01-08',
              },
              {
                feedbackCount: 4,
                date: '2023-02-01',
              },
            ],
          },
        ],
      });
    });
    it('getting counts by week by issue succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');
      const interval = 'week';
      const issueIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.from = from;
      dto.to = to;
      dto.interval = interval;
      dto.issueIds = issueIds;
      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(feedbackIssueStatsFixture);

      const countByDateByIssue =
        await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(feedbackIssueStatsRepo.find).toBeCalledTimes(1);
      expect(countByDateByIssue).toEqual({
        issues: [
          {
            id: 1,
            name: 'issue1',
            statistics: [
              {
                feedbackCount: 3,
                date: '2023-01-01',
              },
              {
                feedbackCount: 3,
                date: '2023-01-08',
              },
              {
                feedbackCount: 4,
                date: '2023-01-29',
              },
            ],
          },
        ],
      });
    });
    it('getting counts by month by issue succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');
      const interval = 'month';
      const issueIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.from = from;
      dto.to = to;
      dto.interval = interval;
      dto.issueIds = issueIds;
      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(feedbackIssueStatsFixture);

      const countByDateByIssue =
        await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(feedbackIssueStatsRepo.find).toBeCalledTimes(1);
      expect(countByDateByIssue).toEqual({
        issues: [
          {
            id: 1,
            name: 'issue1',
            statistics: [
              {
                feedbackCount: 6,
                date: '2022-12-31',
              },
              {
                feedbackCount: 4,
                date: '2023-01-31',
              },
            ],
          },
        ],
      });
    });
  });

  describe('addCronJobByProjectId', () => {
    it('adding a cron job succeeds with valid input', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezoneOffset: '+09:00',
      } as ProjectEntity);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toBeCalledTimes(1);
      expect(schedulerRegistry.addCronJob).toBeCalledWith(
        `feedback-issue-statistics-${projectId}`,
        expect.anything(),
      );
    });
  });

  describe('createFeedbackIssueStatistics', () => {
    it('creating feedback issue statistics data succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 2, max: 10 });
      const issueCount = faker.number.int({ min: 2, max: 10 });
      const issues = Array.from({ length: issueCount }).map(() => ({
        id: faker.number.int(),
      }));
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezoneOffset: '+09:00',
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValueOnce(0);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(1);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      expect(feedbackRepo.count).toBeCalledTimes(dayToCreate * issueCount);
      expect(feedbackIssueStatsRepo.createQueryBuilder).toBeCalledTimes(
        dayToCreate * issueCount - 1,
      );
    });
  });

  describe('updateFeedbackCount', () => {
    it('updating feedback count succeeds with valid inputs and existent date', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue({
        feedbackCount: 1,
      } as FeedbackIssueStatisticsEntity);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.findOne).toBeCalledTimes(1);
      expect(feedbackIssueStatsRepo.save).toBeCalledTimes(1);
      expect(feedbackIssueStatsRepo.save).toBeCalledWith({
        feedbackCount: 1 + feedbackCount,
      });
    });
    it('updating feedback count succeeds with valid inputs and nonexistent date', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'values');

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.findOne).toBeCalledTimes(1);
      expect(feedbackIssueStatsRepo.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilder.values).toBeCalledTimes(1);
      expect(createQueryBuilder.values).toBeCalledWith({
        date: new Date(date.toISOString().split('T')[0] + 'T00:00:00'),
        feedbackCount,
        issue: { id: issueId },
      });
    });
  });
});
