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
import { Between } from 'typeorm';

import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { IssueStatisticsServiceProviders } from '@/test-utils/providers/issue-statistics.service.providers';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { GetCountByDateDto, GetCountByStatusDto, GetCountDto } from './dtos';
import { IssueStatisticsEntity } from './issue-statistics.entity';
import { IssueStatisticsService } from './issue-statistics.service';

const issueStatsFixture = [
  {
    id: 1,
    date: new Date('2023-01-01'),
    count: 1,
    project: {
      id: 1,
      name: 'project1',
    },
  },
  {
    id: 2,
    date: new Date('2023-01-02'),
    count: 2,
    project: {
      id: 1,
      name: 'project1',
    },
  },
  {
    id: 3,
    date: new Date('2023-01-08'),
    count: 3,
    project: {
      id: 1,
      name: 'project1',
    },
  },
  {
    id: 4,
    date: new Date('2023-02-01'),
    count: 4,
    project: {
      id: 1,
      name: 'project1',
    },
  },
] as IssueStatisticsEntity[];

describe('IssueStatisticsService suite', () => {
  let issueStatsService: IssueStatisticsService;
  let issueStatsRepo: Repository<IssueStatisticsEntity>;
  let issueRepo: Repository<IssueEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: IssueStatisticsServiceProviders,
    }).compile();

    issueStatsService = module.get<IssueStatisticsService>(
      IssueStatisticsService,
    );
    issueStatsRepo = module.get(getRepositoryToken(IssueStatisticsEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    schedulerRegistry = module.get(SchedulerRegistry);
  });

  describe('getCountByDate', () => {
    it('getting counts by date succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(issueStatsFixture);

      const countByDateByChannel = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toHaveBeenCalledTimes(1);
      expect(issueStatsRepo.find).toHaveBeenCalledWith({
        where: {
          date: Between(new Date(startDate), new Date(endDate)),
          project: { id: projectId },
        },
        order: { date: 'ASC' },
      });
      expect(countByDateByChannel).toEqual({
        statistics: [
          {
            count: 1,
            startDate: '2023-01-01',
            endDate: '2023-01-01',
          },
          {
            count: 2,
            startDate: '2023-01-02',
            endDate: '2023-01-02',
          },
          {
            count: 3,
            startDate: '2023-01-08',
            endDate: '2023-01-08',
          },
          {
            count: 4,
            startDate: '2023-02-01',
            endDate: '2023-02-01',
          },
        ],
      });
    });
    it('getting counts by week by channel succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-03';
      const interval = 'week';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(issueStatsFixture);

      const countByDateByChannel = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toHaveBeenCalledTimes(1);
      expect(countByDateByChannel).toEqual({
        statistics: [
          {
            count: 1,
            startDate: '2023-01-01',
            endDate: '2023-01-01',
          },
          {
            count: 5,
            startDate: '2023-01-02',
            endDate: '2023-01-08',
          },
          {
            count: 4,
            startDate: '2023-01-30',
            endDate: '2023-02-05',
          },
        ],
      });
    });
    it('getting counts by month by channel succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'month';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(issueStatsFixture);

      const countByDateByChannel = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toHaveBeenCalledTimes(1);
      expect(countByDateByChannel).toEqual({
        statistics: [
          {
            count: 6,
            startDate: '2023-01-01',
            endDate: '2023-01-31',
          },
          {
            count: 4,
            startDate: '2023-02-01',
            endDate: '2023-02-28',
          },
        ],
      });
    });

    it('getting counts by date returns empty statistics when no data found', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue([]);

      const result = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ statistics: [] });
    });

    it('getting counts by date handles single day interval correctly', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-01';
      const interval = 'day';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.projectId = projectId;
      const singleDayFixture = [issueStatsFixture[0]];
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(singleDayFixture);

      const result = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        statistics: [
          {
            count: 1,
            startDate: '2023-01-01',
            endDate: '2023-01-01',
          },
        ],
      });
    });
  });

  describe('getCount', () => {
    it('getting count succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');
      const projectId = faker.number.int();
      const dto = new GetCountDto();
      dto.from = from;
      dto.to = to;
      dto.projectId = projectId;
      jest
        .spyOn(issueRepo, 'count')
        .mockResolvedValue(issueStatsFixture.length);

      const countByDateByChannel = await issueStatsService.getCount(dto);

      expect(issueRepo.count).toHaveBeenCalledTimes(1);
      expect(issueRepo.count).toHaveBeenCalledWith({
        where: {
          createdAt: Between(from, to),
          project: { id: projectId },
        },
      });
      expect(countByDateByChannel).toEqual({
        count: issueStatsFixture.length,
      });
    });

    it('getting count returns zero when no issues found', async () => {
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');
      const projectId = faker.number.int();
      const dto = new GetCountDto();
      dto.from = from;
      dto.to = to;
      dto.projectId = projectId;
      jest.spyOn(issueRepo, 'count').mockResolvedValue(0);

      const result = await issueStatsService.getCount(dto);

      expect(issueRepo.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ count: 0 });
    });
  });

  describe('getCountByStatus', () => {
    it('getting count by status succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      const dto = new GetCountByStatusDto();
      dto.projectId = projectId;

      const mockRawResults = [
        { status: 'OPEN', count: '5' },
        { status: 'CLOSED', count: '3' },
        { status: 'IN_PROGRESS', count: '2' },
      ];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockRawResults),
      };

      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await issueStatsService.getCountByStatus(dto);

      expect(issueRepo.createQueryBuilder).toHaveBeenCalledWith('issue');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'issue.status',
        'status',
      );
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
        'COUNT(issue.id)',
        'count',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'issue.project_id = :projectId',
        { projectId },
      );
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('issue.status');
      expect(result).toEqual({
        statistics: [
          { status: 'OPEN', count: 5 },
          { status: 'CLOSED', count: 3 },
          { status: 'IN_PROGRESS', count: 2 },
        ],
      });
    });

    it('getting count by status returns empty array when no issues found', async () => {
      const projectId = faker.number.int();
      const dto = new GetCountByStatusDto();
      dto.projectId = projectId;

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await issueStatsService.getCountByStatus(dto);

      expect(result).toEqual({ statistics: [] });
    });
  });

  describe('addCronJobByProjectId', () => {
    it('adding a cron job succeeds with valid input', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(schedulerRegistry, 'addCronJob');
      jest.spyOn(schedulerRegistry, 'getCronJobs').mockReturnValue(new Map());

      await issueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        `issue-statistics-${projectId}`,
        expect.anything(),
      );
    });

    it('adding a cron job throws NotFoundException when project not found', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);

      await expect(
        issueStatsService.addCronJobByProjectId(projectId),
      ).rejects.toThrow(`Project(id: ${projectId}) not found`);
    });

    it('adding a cron job skips when cron job already exists', async () => {
      const projectId = faker.number.int();
      const existingCronJobs = new Map();
      existingCronJobs.set(`issue-statistics-${projectId}`, {});

      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest
        .spyOn(schedulerRegistry, 'getCronJobs')
        .mockReturnValue(existingCronJobs);
      jest.spyOn(schedulerRegistry, 'addCronJob');

      await issueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });
  });

  describe('createIssueStatistics', () => {
    it('creating issue statistics data succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 2, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'count').mockResolvedValueOnce(0);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(1);
      jest.spyOn(issueStatsRepo.manager, 'transaction');

      await issueStatsService.createIssueStatistics(projectId, dayToCreate);

      expect(issueStatsRepo.manager.transaction).toHaveBeenCalledTimes(
        dayToCreate,
      );
    });

    it('creating issue statistics throws NotFoundException when project not found', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 1, max: 5 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);

      await expect(
        issueStatsService.createIssueStatistics(projectId, dayToCreate),
      ).rejects.toThrow(`Project(id: ${projectId}) not found`);
    });

    it('creating issue statistics skips transaction when issue count is zero', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 1, max: 3 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(0);
      jest.spyOn(issueStatsRepo.manager, 'transaction');

      await issueStatsService.createIssueStatistics(projectId, dayToCreate);

      expect(issueStatsRepo.manager.transaction).toHaveBeenCalledTimes(
        dayToCreate,
      );
    });

    it('creating issue statistics handles default dayToCreate parameter', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(1);
      jest.spyOn(issueStatsRepo.manager, 'transaction');

      await issueStatsService.createIssueStatistics(projectId);

      expect(issueStatsRepo.manager.transaction).toHaveBeenCalledTimes(1);
    });

    it('creating issue statistics handles negative timezone offset', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 1, max: 3 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'US',
          name: 'America/New_York',
          offset: '-05:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(1);
      jest.spyOn(issueStatsRepo.manager, 'transaction');

      await issueStatsService.createIssueStatistics(projectId, dayToCreate);

      expect(issueStatsRepo.manager.transaction).toHaveBeenCalledTimes(
        dayToCreate,
      );
    });

    it('creating issue statistics handles zero dayToCreate', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueStatsRepo.manager, 'transaction');

      await issueStatsService.createIssueStatistics(projectId, 0);

      expect(issueStatsRepo.manager.transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateCount', () => {
    it('updating count succeeds with valid inputs and existent date', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueStatsRepo, 'findOne').mockResolvedValue({
        count: 1,
      } as IssueStatisticsEntity);

      await issueStatsService.updateCount({
        projectId,
        date,
        count,
      });

      expect(issueStatsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(issueStatsRepo.findOne).toHaveBeenCalledWith({
        where: {
          date: expect.any(Date),
          project: { id: projectId },
        },
      });
      expect(issueStatsRepo.save).toHaveBeenCalledTimes(1);
      expect(issueStatsRepo.save).toHaveBeenCalledWith({
        count: 1 + count,
      });
    });

    it('updating count succeeds with valid inputs and nonexistent date', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueStatsRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
        );
      jest.spyOn(createQueryBuilder, 'values' as never);

      await issueStatsService.updateCount({
        projectId,
        date,
        count,
      });

      expect(issueStatsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(issueStatsRepo.findOne).toHaveBeenCalledWith({
        where: {
          date: expect.any(Date),
          project: { id: projectId },
        },
      });
      expect(issueStatsRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(createQueryBuilder.values).toHaveBeenCalledTimes(1);
      expect(createQueryBuilder.values).toHaveBeenCalledWith({
        date: new Date(
          DateTime.fromJSDate(date).plus({ hours: 9 }).toISO()?.split('T')[0] +
            'T00:00:00',
        ),
        count,
        project: { id: projectId },
      });
    });

    it('updating count throws NotFoundException when project not found', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);

      await expect(
        issueStatsService.updateCount({
          projectId,
          date,
          count,
        }),
      ).rejects.toThrow(`Project(id: ${projectId}) not found`);
    });

    it('updating count returns early when count is zero', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      const count = 0;
      jest.spyOn(projectRepo, 'findOne');

      await issueStatsService.updateCount({
        projectId,
        date,
        count,
      });

      expect(projectRepo.findOne).not.toHaveBeenCalled();
    });

    it('updating count uses default count of 1 when count is undefined', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(issueStatsRepo, 'findOne').mockResolvedValue(null);

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orUpdate: jest.fn().mockReturnThis(),
        updateEntity: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await issueStatsService.updateCount({
        projectId,
        date,
        count: undefined,
      });

      expect(mockQueryBuilder.values).toHaveBeenCalledWith({
        date: new Date(
          DateTime.fromJSDate(date).plus({ hours: 9 }).toISO()?.split('T')[0] +
            'T00:00:00',
        ),
        count: 1,
        project: { id: projectId },
      });
    });
  });
});
