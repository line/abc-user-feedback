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

import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { FeedbackStatisticsServiceProviders } from '@/test-utils/providers/feedback-statistics.service.providers';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { GetCountByDateByChannelDto, GetCountDto } from './dtos';
import { FeedbackStatisticsEntity } from './feedback-statistics.entity';
import { FeedbackStatisticsService } from './feedback-statistics.service';

const feedbackStatsFixture = [
  {
    id: 1,
    date: new Date('2023-01-01'),
    count: 1,
    channel: {
      id: 1,
      name: 'channel1',
    },
  },
  {
    id: 2,
    date: new Date('2023-01-02'),
    count: 2,
    channel: {
      id: 1,
      name: 'channel1',
    },
  },
  {
    id: 3,
    date: new Date('2023-01-08'),
    count: 3,
    channel: {
      id: 1,
      name: 'channel1',
    },
  },
  {
    id: 4,
    date: new Date('2023-02-01'),
    count: 4,
    channel: {
      id: 1,
      name: 'channel1',
    },
  },
] as FeedbackStatisticsEntity[];

describe('FeedbackStatisticsService suite', () => {
  let feedbackStatsService: FeedbackStatisticsService;
  let feedbackStatsRepo: Repository<FeedbackStatisticsEntity>;
  let feedbackRepo: Repository<FeedbackEntity>;
  let issueRepo: Repository<IssueEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: FeedbackStatisticsServiceProviders,
    }).compile();

    feedbackStatsService = module.get<FeedbackStatisticsService>(
      FeedbackStatisticsService,
    );
    feedbackStatsRepo = module.get(
      getRepositoryToken(FeedbackStatisticsEntity),
    );
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    schedulerRegistry = module.get(SchedulerRegistry);
  });

  describe('getCountByDateByChannel', () => {
    it('getting counts by day by channel succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'day';
      const channelIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByChannelDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.channelIds = channelIds;
      jest
        .spyOn(feedbackStatsRepo, 'find')
        .mockResolvedValue(feedbackStatsFixture);

      const countByDateByChannel =
        await feedbackStatsService.getCountByDateByChannel(dto);

      expect(countByDateByChannel).toEqual({
        channels: [
          {
            id: 1,
            name: 'channel1',
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
          },
        ],
      });
    });
    it('getting counts by week by channel succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-02-07';
      const interval = 'week';
      const channelIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByChannelDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.channelIds = channelIds;
      jest
        .spyOn(feedbackStatsRepo, 'find')
        .mockResolvedValue(feedbackStatsFixture);

      const countByDateByChannel =
        await feedbackStatsService.getCountByDateByChannel(dto);

      expect(countByDateByChannel).toEqual({
        channels: [
          {
            id: 1,
            name: 'channel1',
            statistics: [
              {
                count: 3,
                startDate: '2023-01-01',
                endDate: '2023-01-03',
              },
              {
                count: 3,
                startDate: '2023-01-04',
                endDate: '2023-01-10',
              },
              {
                count: 4,
                startDate: '2023-02-01',
                endDate: '2023-02-07',
              },
            ],
          },
        ],
      });
    });
    it('getting counts by month by channel succeeds with valid inputs', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const interval = 'month';
      const channelIds = [faker.number.int(), faker.number.int()];
      const dto = new GetCountByDateByChannelDto();
      dto.startDate = startDate;
      dto.endDate = endDate;
      dto.interval = interval;
      dto.channelIds = channelIds;
      jest
        .spyOn(feedbackStatsRepo, 'find')
        .mockResolvedValue(feedbackStatsFixture);

      const countByDateByChannel =
        await feedbackStatsService.getCountByDateByChannel(dto);

      expect(countByDateByChannel).toEqual({
        channels: [
          {
            id: 1,
            name: 'channel1',
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
        .spyOn(feedbackRepo, 'count')
        .mockResolvedValue(feedbackStatsFixture.length);

      const countByDateByChannel = await feedbackStatsService.getCount(dto);

      expect(countByDateByChannel).toEqual({
        count: feedbackStatsFixture.length,
      });
    });
  });

  describe('getIssuedRatio', () => {
    it('getting issued ratio succeeds with valid inputs', async () => {
      const from = new Date('2023-01-01');
      const to = faker.date.future();
      const projectId = faker.number.int();
      const dto = new GetCountDto();
      dto.from = from;
      dto.to = to;
      dto.projectId = projectId;
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      jest
        .spyOn(createQueryBuilder, 'getRawMany' as never)
        .mockResolvedValue(feedbackStatsFixture as never);
      jest
        .spyOn(feedbackRepo, 'count')
        .mockResolvedValue(feedbackStatsFixture.length);

      const countByDateByChannel =
        await feedbackStatsService.getIssuedRatio(dto);

      expect(countByDateByChannel).toEqual({
        ratio: 1,
      });
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

      await feedbackStatsService.addCronJobByProjectId(projectId);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(1);
      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        `feedback-statistics-${projectId}`,
        expect.anything(),
      );
    });
  });

  describe('createFeedbackStatistics', () => {
    it('creating feedback statistics data succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      const dayToCreate = faker.number.int({ min: 2, max: 10 });
      const channelCount = faker.number.int({ min: 2, max: 10 });
      const channels = Array.from({ length: channelCount }).map(() => ({
        id: faker.number.int(),
      }));
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        timezone: {
          countryCode: 'KR',
          name: 'Asia/Seoul',
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest
        .spyOn(channelRepo, 'find')
        .mockResolvedValue(channels as ChannelEntity[]);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValueOnce(0);
      jest.spyOn(feedbackRepo, 'count').mockResolvedValue(1);
      jest.spyOn(feedbackStatsRepo.manager, 'transaction');

      await feedbackStatsService.createFeedbackStatistics(
        projectId,
        dayToCreate,
      );

      expect(feedbackStatsRepo.manager.transaction).toHaveBeenCalledTimes(
        dayToCreate * channelCount,
      );
    });
  });

  describe('updateCount', () => {
    it('updating count succeeds with valid inputs and existent date', async () => {
      const channelId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackStatsRepo, 'findOne').mockResolvedValue({
        count: 1,
      } as FeedbackStatisticsEntity);

      await feedbackStatsService.updateCount({
        channelId,
        date,
        count,
      });

      expect(feedbackStatsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(feedbackStatsRepo.save).toHaveBeenCalledTimes(1);
      expect(feedbackStatsRepo.save).toHaveBeenCalledWith({
        count: 1 + count,
      });
    });
    it('updating count succeeds with valid inputs and nonexistent date', async () => {
      const channelId = faker.number.int();
      const date = faker.date.past();
      const count = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(feedbackStatsRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(feedbackStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<FeedbackStatisticsEntity>,
        );
      jest.spyOn(createQueryBuilder, 'values' as never);

      await feedbackStatsService.updateCount({
        channelId,
        date,
        count,
      });

      expect(feedbackStatsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(feedbackStatsRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(createQueryBuilder.values).toHaveBeenCalledTimes(1);
      expect(createQueryBuilder.values).toHaveBeenCalledWith({
        date: new Date(
          DateTime.fromJSDate(date).plus({ hours: 9 }).toISO()?.split('T')[0] +
            'T00:00:00',
        ),
        count,
        channel: { id: channelId },
      });
    });
  });
});
