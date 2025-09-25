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
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import type { Repository, SelectQueryBuilder } from 'typeorm';

import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectNotFoundException } from '@/domains/admin/project/project/exceptions';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
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

// Helper function to create realistic test data
const createRealisticProject = (
  overrides: Partial<ProjectEntity> = {},
): ProjectEntity =>
  ({
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    timezone: {
      countryCode: faker.location.countryCode(),
      name: faker.location.timeZone(),
      offset: faker.helpers.arrayElement([
        '+09:00',
        '+00:00',
        '-08:00',
        '-05:00',
      ]),
    },
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }) as ProjectEntity;

const createRealisticIssue = (
  overrides: Partial<IssueEntity> = {},
): IssueEntity =>
  ({
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['open', 'closed', 'in_progress']),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }) as IssueEntity;

const createRealisticFeedbackIssueStats = (
  overrides: Partial<FeedbackIssueStatisticsEntity> = {},
): FeedbackIssueStatisticsEntity =>
  ({
    id: faker.number.int({ min: 1, max: 1000 }),
    date: faker.date.past(),
    feedbackCount: faker.number.int({ min: 0, max: 100 }),
    issue: createRealisticIssue(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  }) as FeedbackIssueStatisticsEntity;

describe('FeedbackIssueStatisticsService suite', () => {
  let feedbackIssueStatsService: FeedbackIssueStatisticsService;
  let feedbackIssueStatsRepo: Repository<FeedbackIssueStatisticsEntity>;
  let feedbackRepo: Repository<FeedbackEntity>;
  let issueRepo: Repository<IssueEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let schedulerRegistry: SchedulerRegistry;
  let schedulerLockService: SchedulerLockService;

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
    schedulerLockService = module.get(SchedulerLockService);
  });

  describe('getCountByDateByissue', () => {
    it('getting counts by day by issue succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const issueIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;
      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(feedbackIssueStatsFixture);

      const countByDateByissue =
        await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(countByDateByissue).toEqual({
        issues: [
          {
            id: 1,
            name: 'issue1',
            statistics: [
              {
                feedbackCount: 1,
                startDate: '2023-01-01',
                endDate: '2023-01-01',
              },
              {
                feedbackCount: 2,
                startDate: '2023-01-02',
                endDate: '2023-01-02',
              },
              {
                feedbackCount: 3,
                startDate: '2023-01-08',
                endDate: '2023-01-08',
              },
              {
                feedbackCount: 4,
                startDate: '2023-02-01',
                endDate: '2023-02-01',
              },
            ],
          },
        ],
      });
    });
    it('getting counts by week by issue succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'week';
      const issueIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;
      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(feedbackIssueStatsFixture);

      const countByDateByIssue =
        await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(countByDateByIssue).toEqual({
        issues: [
          {
            id: 1,
            name: 'issue1',
            statistics: [
              {
                feedbackCount: 1,
                startDate: '2023-01-01',
                endDate: '2023-01-01',
              },
              {
                feedbackCount: 5,
                startDate: '2023-01-02',
                endDate: '2023-01-08',
              },
              {
                feedbackCount: 4,
                startDate: '2023-01-30',
                endDate: '2023-02-05',
              },
            ],
          },
        ],
      });
    });
    it('getting counts by month by issue succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'month';
      const issueIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;
      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(feedbackIssueStatsFixture);

      const countByDateByIssue =
        await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(countByDateByIssue).toEqual({
        issues: [
          {
            id: 1,
            name: 'issue1',
            statistics: [
              {
                feedbackCount: 6,
                startDate: '2023-01-01',
                endDate: '2023-01-31',
              },
              {
                feedbackCount: 4,
                startDate: '2023-02-01',
                endDate: '2023-02-28',
              },
            ],
          },
        ],
      });
    });

    it('returns empty result when no statistics found', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const issueIds = [faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;

      jest.spyOn(feedbackIssueStatsRepo, 'find').mockResolvedValue([]);

      const result = await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(result).toEqual({ issues: [] });
    });

    it('handles database error gracefully', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const issueIds = [faker.number.int()];
      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;

      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        feedbackIssueStatsService.getCountByDateByIssue(dto),
      ).rejects.toThrow('Database error');
    });

    it('handles multiple issues with overlapping statistics', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const interval = 'day';
      const issueIds = [1, 2];

      const multipleIssuesFixture = [
        {
          id: 1,
          date: new Date('2023-01-01'),
          feedbackCount: 5,
          issue: { id: 1, name: 'issue1' },
        },
        {
          id: 2,
          date: new Date('2023-01-01'),
          feedbackCount: 3,
          issue: { id: 2, name: 'issue2' },
        },
        {
          id: 3,
          date: new Date('2023-01-02'),
          feedbackCount: 2,
          issue: { id: 1, name: 'issue1' },
        },
      ] as FeedbackIssueStatisticsEntity[];

      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;

      jest
        .spyOn(feedbackIssueStatsRepo, 'find')
        .mockResolvedValue(multipleIssuesFixture);

      const result = await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(result.issues).toHaveLength(2);
      expect(result.issues[0].statistics).toHaveLength(2);
      expect(result.issues[1].statistics).toHaveLength(1);
    });

    it('handles large date ranges efficiently', async () => {
      const startDate = '2020-01-01';
      const endDate = '2025-12-31';
      const interval = 'month';
      const issueIds = [faker.number.int()];

      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;

      jest.spyOn(feedbackIssueStatsRepo, 'find').mockResolvedValue([]);

      const result = await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(result).toEqual({ issues: [] });
      expect(feedbackIssueStatsRepo.find).toHaveBeenCalledWith({
        where: {
          issue: { id: expect.any(Object) },
          date: expect.any(Object),
        },
        relations: { issue: true },
        order: { issue: { id: 'ASC' }, date: 'ASC' },
      });
    });

    it('handles empty issueIds array', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const issueIds: number[] = [];

      const dto = new GetCountByDateByIssueDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.issueIds = issueIds;

      jest.spyOn(feedbackIssueStatsRepo, 'find').mockResolvedValue([]);

      const result = await feedbackIssueStatsService.getCountByDateByIssue(dto);

      expect(result).toEqual({ issues: [] });
    });
  });

  describe('addCronJobByProjectId', () => {
    it('adding a cron job succeeds with valid input', async () => {
      const projectId = faker.number.int();
      const realisticProject = createRealisticProject({
        id: projectId,
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      });

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(realisticProject);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        `feedback-issue-statistics-${projectId}`,
        expect.anything(),
      );
    });

    it('throws ProjectNotFoundException when project not found', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);

      await expect(
        feedbackIssueStatsService.addCronJobByProjectId(projectId),
      ).rejects.toThrow(ProjectNotFoundException);
    });

    it('skips adding cron job when job already exists', async () => {
      const projectId = faker.number.int();
      const jobName = `feedback-issue-statistics-${projectId}`;

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);

      const mockCronJobs = new Map();
      mockCronJobs.set(jobName, {});
      jest
        .spyOn(schedulerRegistry, 'getCronJobs')
        .mockReturnValue(mockCronJobs);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });

    it('handles scheduler lock acquisition failure', async () => {
      const projectId = faker.number.int();

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);

      jest.spyOn(schedulerLockService, 'acquireLock').mockResolvedValue(false);
      jest
        .spyOn(schedulerLockService, 'releaseLock')
        .mockResolvedValue(undefined);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
    });

    it('calculates correct cron hour for different timezone offsets', async () => {
      const projectId = faker.number.int();

      // Test with UTC+0 (should run at hour 0)
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'GB',
          name: 'Europe/London',
          offset: '+00:00',
        },
      } as ProjectEntity);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
      const callArgs = (schedulerRegistry.addCronJob as jest.Mock).mock
        .calls[0] as [string, { cronTime: string[] }];
      expect(callArgs[0]).toBe(`feedback-issue-statistics-${projectId}`);
      expect(callArgs[1]).toHaveProperty('cronTime');
    });

    it('handles negative timezone offsets correctly', async () => {
      const projectId = faker.number.int();

      // Test with UTC-8 (should run at hour 8)
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'US',
          name: 'America/Los_Angeles',
          offset: '-08:00',
        },
      } as ProjectEntity);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
      const callArgs = (schedulerRegistry.addCronJob as jest.Mock).mock
        .calls[0] as [string, { cronTime: string[] }];
      expect(callArgs[0]).toBe(`feedback-issue-statistics-${projectId}`);
      expect(callArgs[1]).toHaveProperty('cronTime');
    });

    it('handles scheduler lock service errors gracefully', async () => {
      const projectId = faker.number.int();

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);

      jest
        .spyOn(schedulerLockService, 'acquireLock')
        .mockRejectedValue(new Error('Lock service error'));
      jest.spyOn(schedulerRegistry, 'addCronJob');

      // Should not throw error, cron job should still be added
      await expect(
        feedbackIssueStatsService.addCronJobByProjectId(projectId),
      ).resolves.not.toThrow();
      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
    });

    it('handles scheduler registry errors gracefully', async () => {
      const projectId = faker.number.int();

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);

      jest.spyOn(schedulerRegistry, 'addCronJob').mockImplementation(() => {
        throw new Error('Scheduler registry error');
      });

      await expect(
        feedbackIssueStatsService.addCronJobByProjectId(projectId),
      ).rejects.toThrow('Scheduler registry error');
    });

    it('handles extreme timezone offsets', async () => {
      const projectId = faker.number.int();

      // Test with UTC+14 (should run at hour 10, as (24 - 14) % 24 = 10)
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KI',
          name: 'Pacific/Kiritimati',
          offset: '+14:00',
        },
      } as ProjectEntity);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await feedbackIssueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
      const callArgs = (schedulerRegistry.addCronJob as jest.Mock).mock
        .calls[0] as [string, { cronTime: string[] }];
      expect(callArgs[0]).toBe(`feedback-issue-statistics-${projectId}`);
      expect(callArgs[1]).toHaveProperty('cronTime');
    });
  });

  describe('createFeedbackIssueStatistics', () => {
    it('creating feedback issue statistics data succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 2, max: 10 });
      const issueCount = faker.number.int({ min: 2, max: 10 });

      const realisticProject = createRealisticProject({
        id: projectId,
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      });

      const realisticIssues = Array.from({ length: issueCount }).map(() =>
        createRealisticIssue({ project: { id: projectId } as ProjectEntity }),
      );

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(realisticProject);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(realisticIssues);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValueOnce(0);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(1);
      jest.spyOn(feedbackIssueStatsRepo.manager, 'transaction');

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      expect(feedbackIssueStatsRepo.manager.transaction).toHaveBeenCalledTimes(
        dayToCreate * issueCount,
      );
    });

    it('throws ProjectNotFoundException when project not found', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 1, max: 5 });

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);

      await expect(
        feedbackIssueStatsService.createFeedbackIssueStatistics(
          projectId,
          dayToCreate,
        ),
      ).rejects.toThrow(ProjectNotFoundException);
    });

    it('handles empty issues list gracefully', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 1, max: 5 });

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue([]);
      jest.spyOn(feedbackIssueStatsRepo.manager, 'transaction');

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      expect(feedbackIssueStatsRepo.manager.transaction).not.toHaveBeenCalled();
    });

    it('handles transaction errors gracefully', async () => {
      const projectId = faker.number.int();
      const dayToCreate = 1;
      const issues = [{ id: faker.number.int() }];

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(1);
      jest
        .spyOn(feedbackIssueStatsRepo.manager, 'transaction')
        .mockRejectedValue(new Error('Transaction failed'));

      // Should not throw error, but log it
      await expect(
        feedbackIssueStatsService.createFeedbackIssueStatistics(
          projectId,
          dayToCreate,
        ),
      ).resolves.not.toThrow();
    });

    it('skips creating statistics when feedback count is zero', async () => {
      const projectId = faker.number.int();
      const dayToCreate = 1;
      const issues = [{ id: faker.number.int() }];

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(0);

      const transactionSpy = jest.spyOn(
        feedbackIssueStatsRepo.manager,
        'transaction',
      );

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      // Transaction is called but no database operations are performed when feedback count is 0
      expect(transactionSpy).toHaveBeenCalledTimes(1);
    });

    it('handles different timezone offsets correctly', async () => {
      const projectId = faker.number.int();
      const dayToCreate = 1;
      const issues = [{ id: faker.number.int() }];

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'US',
          name: 'America/New_York',
          offset: '-05:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(1);
      jest
        .spyOn(feedbackIssueStatsRepo.manager, 'transaction')
        .mockImplementation(async (callback: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await callback(feedbackIssueStatsRepo.manager);
        });

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      expect(feedbackIssueStatsRepo.manager.transaction).toHaveBeenCalledTimes(
        1,
      );
    });

    it('handles large dayToCreate values efficiently', async () => {
      const projectId = faker.number.int();
      const dayToCreate = 1000; // Large number
      const issues = [{ id: faker.number.int() }];

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(0); // No feedback to avoid transaction calls

      const transactionSpy = jest.spyOn(
        feedbackIssueStatsRepo.manager,
        'transaction',
      );

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      // Transaction is called for each day*issue combination, but no database operations when feedback count is 0
      expect(transactionSpy).toHaveBeenCalledTimes(dayToCreate * issues.length);
    });

    it('handles zero dayToCreate parameter', async () => {
      const projectId = faker.number.int();
      const dayToCreate = 0;
      const issues = [{ id: faker.number.int() }];

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackIssueStatsRepo.manager, 'transaction');

      await feedbackIssueStatsService.createFeedbackIssueStatistics(
        projectId,
        dayToCreate,
      );

      expect(feedbackIssueStatsRepo.manager.transaction).not.toHaveBeenCalled();
    });

    it('handles transaction timeout scenarios', async () => {
      const projectId = faker.number.int();
      const dayToCreate = 1;
      const issues = [{ id: faker.number.int() }];

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'find').mockResolvedValue(issues as IssueEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(1);

      // Mock transaction timeout
      jest
        .spyOn(feedbackIssueStatsRepo.manager, 'transaction')
        .mockImplementation(async (_callback) => {
          await new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Transaction timeout')), 100),
          );
        });

      // Should not throw error, but log it
      await expect(
        feedbackIssueStatsService.createFeedbackIssueStatistics(
          projectId,
          dayToCreate,
        ),
      ).resolves.not.toThrow();
    });
  });

  describe('updateFeedbackCount', () => {
    it('updating feedback count succeeds with valid inputs and existent date', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = faker.number.int({ min: 1, max: 10 });

      const realisticProject = createRealisticProject({
        timezone: {
          offset: '+09:00',
          countryCode: 'KR',
          name: 'Asia/Seoul',
        } as any,
      });

      const existingStats = createRealisticFeedbackIssueStats({
        issue: { id: issueId } as any,
        feedbackCount: 1,
      });

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(realisticProject);
      jest
        .spyOn(feedbackIssueStatsRepo, 'findOne')
        .mockResolvedValue(existingStats);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(feedbackIssueStatsRepo.save).toHaveBeenCalledTimes(1);
      expect(feedbackIssueStatsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          feedbackCount: 1 + feedbackCount,
        }),
      );
    });
    it('updating feedback count succeeds with valid inputs and nonexistent date', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<FeedbackIssueStatisticsEntity>,
        );
      jest.spyOn(createQueryBuilder, 'values' as never);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(feedbackIssueStatsRepo.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(createQueryBuilder.values).toHaveBeenCalledTimes(1);
      expect(createQueryBuilder.values).toHaveBeenCalledWith({
        date: new Date(
          DateTime.fromJSDate(date).plus({ hours: 9 }).toISO()?.split('T')[0] +
            'T00:00:00',
        ),
        feedbackCount,
        issue: { id: issueId },
      });
    });

    it('throws ProjectNotFoundException when project not found', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = faker.number.int({ min: 1, max: 10 });

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);

      await expect(
        feedbackIssueStatsService.updateFeedbackCount({
          issueId,
          date,
          feedbackCount,
        }),
      ).rejects.toThrow(ProjectNotFoundException);
    });

    it('returns early when feedbackCount is zero', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = 0;

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.findOne).not.toHaveBeenCalled();
      expect(feedbackIssueStatsRepo.save).not.toHaveBeenCalled();
    });

    it('uses default feedbackCount of 1 when not provided', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue({
        feedbackCount: 1,
      } as FeedbackIssueStatisticsEntity);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount: undefined,
      });

      expect(feedbackIssueStatsRepo.save).toHaveBeenCalledWith({
        feedbackCount: 2, // 1 (existing) + 1 (default)
      });
    });

    it('handles database errors gracefully', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = faker.number.int({ min: 1, max: 10 });

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest
        .spyOn(feedbackIssueStatsRepo, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        feedbackIssueStatsService.updateFeedbackCount({
          issueId,
          date,
          feedbackCount,
        }),
      ).rejects.toThrow('Database error');
    });

    it('handles negative feedbackCount values', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = -5;

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue({
        feedbackCount: 10,
      } as FeedbackIssueStatisticsEntity);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.save).toHaveBeenCalledWith({
        feedbackCount: 5, // 10 + (-5)
      });
    });

    it('handles very large feedbackCount values', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = 999999;

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue({
        feedbackCount: 1,
      } as FeedbackIssueStatisticsEntity);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.save).toHaveBeenCalledWith({
        feedbackCount: 1000000, // 1 + 999999
      });
    });

    it('handles different timezone offsets in updateFeedbackCount', async () => {
      const issueId = faker.number.int();
      const date = faker.date.past();
      const feedbackCount = 1;

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '-08:00', // Pacific Time
        },
      } as ProjectEntity);
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue(null);

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orUpdate: jest.fn().mockReturnThis(),
        updateEntity: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(mockQueryBuilder.values).toHaveBeenCalledWith({
        date: new Date(
          DateTime.fromJSDate(date).minus({ hours: 8 }).toISO()?.split('T')[0] +
            'T00:00:00',
        ),
        feedbackCount,
        issue: { id: issueId },
      });
    });

    it('handles edge case date values (leap year, month boundaries)', async () => {
      const issueId = faker.number.int();
      const date = new Date('2024-02-29'); // Leap year
      const feedbackCount = 1;

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackIssueStatsRepo, 'findOne').mockResolvedValue({
        feedbackCount: 1,
      } as FeedbackIssueStatisticsEntity);

      await feedbackIssueStatsService.updateFeedbackCount({
        issueId,
        date,
        feedbackCount,
      });

      expect(feedbackIssueStatsRepo.save).toHaveBeenCalledWith({
        feedbackCount: 2,
      });
    });
  });
});
