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

import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import { IssueStatisticsServiceProviders } from '@/test-utils/providers/issue-statistics.service.providers';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { GetCountByDateDto, GetCountDto } from './dtos';
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
      const from = new Date('2023-01-01');
      const to = faker.date.future();
      const interval = 'day';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.from = from;
      dto.to = to;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(issueStatsFixture);

      const countByDateByChannel = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toBeCalledTimes(1);
      expect(countByDateByChannel).toEqual({
        statistics: [
          {
            count: 1,
            date: '2023-01-01',
          },
          {
            count: 2,
            date: '2023-01-02',
          },
          {
            count: 3,
            date: '2023-01-08',
          },
          {
            count: 4,
            date: '2023-02-01',
          },
        ],
      });
    });
    it('getting counts by week by channel succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = faker.date.future();
      const interval = 'week';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.from = from;
      dto.to = to;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(issueStatsFixture);

      const countByDateByChannel = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toBeCalledTimes(1);
      expect(countByDateByChannel).toEqual({
        statistics: [
          {
            count: 3,
            date: '2023-01-01',
          },
          {
            count: 3,
            date: '2023-01-08',
          },
          {
            count: 4,
            date: '2023-01-29',
          },
        ],
      });
    });
    it('getting counts by month by channel succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = faker.date.future();
      const interval = 'month';
      const projectId = faker.number.int();
      const dto = new GetCountByDateDto();
      dto.from = from;
      dto.to = to;
      dto.interval = interval;
      dto.projectId = projectId;
      jest.spyOn(issueStatsRepo, 'find').mockResolvedValue(issueStatsFixture);

      const countByDateByChannel = await issueStatsService.getCountByDate(dto);

      expect(issueStatsRepo.find).toBeCalledTimes(1);
      expect(countByDateByChannel).toEqual({
        statistics: [
          {
            count: 6,
            date: '2023-01-01',
          },
          {
            count: 4,
            date: '2023-02-01',
          },
        ],
      });
    });
  });

  describe('getCount', () => {
    it('getting count succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = faker.date.future();
      const projectId = faker.number.int();
      const dto = new GetCountDto();
      dto.from = from;
      dto.to = to;
      dto.projectId = projectId;
      jest
        .spyOn(issueRepo, 'count')
        .mockResolvedValue(issueStatsFixture.length);

      const countByDateByChannel = await issueStatsService.getCount(dto);

      expect(issueRepo.count).toBeCalledTimes(1);
      expect(countByDateByChannel).toEqual({
        count: issueStatsFixture.length,
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

      await issueStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toBeCalledTimes(1);
      expect(schedulerRegistry.addCronJob).toBeCalledWith(
        `issue-statistics-${projectId}`,
        expect.anything(),
      );
    });
  });

  describe('createIssueStatistics', () => {
    it('creating issue statistics data succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 2, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezoneOffset: '+09:00',
      } as ProjectEntity);
      jest.spyOn(issueRepo, 'count').mockResolvedValueOnce(0);
      jest.spyOn(issueRepo, 'count').mockResolvedValue(1);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await issueStatsService.createIssueStatistics(projectId, dayToCreate);

      expect(issueRepo.count).toBeCalledTimes(dayToCreate);
      expect(issueStatsRepo.createQueryBuilder).toBeCalledTimes(
        dayToCreate - 1,
      );
    });
  });

  describe('updateCount', () => {
    it('updating count succeeds with valid inputs and existent date', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(issueStatsRepo, 'findOne').mockResolvedValue({
        count: 1,
      } as IssueStatisticsEntity);

      await issueStatsService.updateCount({
        projectId,
        date,
        count,
      });

      expect(issueStatsRepo.findOne).toBeCalledTimes(1);
      expect(issueStatsRepo.save).toBeCalledTimes(1);
      expect(issueStatsRepo.save).toBeCalledWith({
        count: 1 + count,
      });
    });
    it('updating count succeeds with valid inputs and nonexistent date', async () => {
      const projectId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(issueStatsRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'values');

      await issueStatsService.updateCount({
        projectId,
        date,
        count,
      });

      expect(issueStatsRepo.findOne).toBeCalledTimes(1);
      expect(issueStatsRepo.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilder.values).toBeCalledTimes(1);
      expect(createQueryBuilder.values).toBeCalledWith({
        date: new Date(date.toISOString().split('T')[0] + 'T00:00:00'),
        count,
        project: { id: projectId },
      });
    });
  });
});
