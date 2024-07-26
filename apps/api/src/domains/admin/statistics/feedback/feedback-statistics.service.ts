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
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import { Between, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { LockTypeEnum } from '@/domains/operation/scheduler-lock/lock-type.enum';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import { ProjectNotFoundException } from '../../project/project/exceptions';
import { getIntervalDatesInFormat } from '../utils/util-functions';
import { UpdateCountDto } from './dtos';
import type {
  GetCountByDateByChannelDto,
  GetCountDto,
  GetIssuedRateDto,
} from './dtos';
import { FeedbackStatisticsEntity } from './feedback-statistics.entity';

dotenv.config();

@Injectable()
export class FeedbackStatisticsService {
  private logger = new Logger(FeedbackStatisticsService.name);

  constructor(
    @InjectRepository(FeedbackStatisticsEntity)
    private readonly repository: Repository<FeedbackStatisticsEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly schedulerLockService: SchedulerLockService,
  ) {}

  async getCountByDateByChannel(dto: GetCountByDateByChannelDto) {
    const { startDate, endDate, interval, channelIds } = dto;

    const feedbackStatistics = await this.repository.find({
      where: {
        channel: In(channelIds),
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: { channel: true },
      order: { channel: { id: 'ASC' }, date: 'ASC' },
    });

    return {
      channels: feedbackStatistics.reduce(
        (acc, curr) => {
          let channel = acc.find((ch) => ch.id === curr.channel.id);
          if (!channel) {
            channel = {
              id: curr.channel.id,
              name: curr.channel.name,
              statistics: [],
            };
            acc.push(channel);
          }

          const { startOfInterval, endOfInterval } = getIntervalDatesInFormat(
            startDate,
            endDate,
            curr.date,
            interval,
          );

          let statistic = channel.statistics.find(
            (stat) => stat.startDate === startOfInterval,
          );
          if (!statistic) {
            statistic = {
              startDate: startOfInterval,
              endDate: endOfInterval,
              count: 0,
            };
            channel.statistics.push(statistic);
          }
          statistic.count += curr.count;

          return acc;
        },
        [] as {
          id: number;
          name: string;
          statistics: { startDate: string; endDate: string; count: number }[];
        }[],
      ),
    };
  }

  async getCount(dto: GetCountDto) {
    return {
      count: await this.feedbackRepository.count({
        where: {
          createdAt: Between(dto.from, dto.to),
          channel: { project: { id: dto.projectId } },
        },
      }),
    };
  }

  async getIssuedRatio(dto: GetIssuedRateDto) {
    return {
      ratio:
        (
          await this.issueRepository
            .createQueryBuilder('issue')
            .select('feedbacks.id')
            .innerJoin('issue.feedbacks', 'feedbacks')
            .innerJoin('feedbacks.channel', 'channel')
            .innerJoin('channel.project', 'project')
            .where('feedbacks.createdAt BETWEEN :from AND :to', {
              from: dto.from,
              to: dto.to,
            })
            .andWhere('project.id = :projectId', {
              projectId: dto.projectId,
            })
            .groupBy('feedbacks.id')
            .getRawMany()
        ).length /
        (await this.feedbackRepository.count({
          where: {
            createdAt: Between(dto.from, dto.to),
            channel: { project: { id: dto.projectId } },
          },
        })),
    };
  }

  async addCronJobByProjectId(projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (project === null) throw new ProjectNotFoundException();

    const timezoneOffset = project.timezone.offset;

    const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

    const job = new CronJob(`0 ${cronHour} * * *`, async () => {
      if (
        await this.schedulerLockService.acquireLock(
          LockTypeEnum.FEEDBACK_STATISTICS,
          1000 * 60 * 5,
        )
      ) {
        try {
          await this.createFeedbackStatistics(projectId, 365);
        } finally {
          await this.schedulerLockService.releaseLock(
            LockTypeEnum.FEEDBACK_STATISTICS,
          );
        }
      } else {
        this.logger.log({
          message: 'Failed to acquire lock for feedback count calculation',
        });
      }
    });
    this.schedulerRegistry.addCronJob(`feedback-statistics-${projectId}`, job);
    job.start();

    this.logger.log(`feedback-statistics-${projectId} cron job started`);
  }

  async createFeedbackStatistics(projectId: number, dayToCreate = 1) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (project === null) throw new ProjectNotFoundException();
    const timezoneOffset = project.timezone.offset;
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    const channels = await this.channelRepository.find({
      where: { project: { id: projectId } },
    });

    for (let day = 1; day <= dayToCreate; day++) {
      for (const channel of channels) {
        try {
          await this.repository.manager.transaction(
            async (transactionalEntityManager) => {
              const feedbackCount = await this.feedbackRepository.count({
                where: {
                  channel: { id: channel.id },
                  createdAt: Between(
                    DateTime.utc()
                      .minus({ days: day })
                      .startOf('day')
                      .minus({ hours: offset })
                      .toJSDate(),
                    DateTime.utc()
                      .minus({ days: day })
                      .endOf('day')
                      .minus({ hours: offset })
                      .toJSDate(),
                  ),
                },
              });

              if (feedbackCount === 0) return;

              await transactionalEntityManager
                .createQueryBuilder()
                .insert()
                .into(FeedbackStatisticsEntity)
                .values({
                  date:
                    offset >= 0 ?
                      DateTime.utc()
                        .minus({ days: day })
                        .endOf('day')
                        .minus({ hours: offset })
                        .toFormat('yyyy-MM-dd')
                    : DateTime.utc()
                        .minus({ days: day })
                        .startOf('day')
                        .minus({ hours: offset })
                        .toFormat('yyyy-MM-dd'),
                  count: feedbackCount,
                  channel: { id: channel.id },
                })
                .orUpdate(['count'], ['date', 'channel'])
                .updateEntity(false)
                .execute();
            },
          );
        } catch (error) {
          this.logger.error({
            message: 'Failed to create feedback statistics',
            error: error as Error,
          });
        }
      }
    }
  }

  @Transactional()
  async updateCount(dto: UpdateCountDto) {
    if (dto.count === 0) return;
    if (!dto.count) dto.count = 1;

    const project = await this.projectRepository.findOne({
      where: { channels: { id: dto.channelId } },
    });
    if (project === null) throw new ProjectNotFoundException();
    const timezoneOffset = project.timezone.offset;
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    const date = new Date(
      DateTime.fromJSDate(dto.date)
        .plus({ hours: offset })
        .toISO()
        ?.split('T')[0] + 'T00:00:00',
    );

    const stats = await this.repository.findOne({
      where: {
        date,
        channel: { id: dto.channelId },
      },
    });

    if (stats) {
      stats.count += dto.count;
      await this.repository.save(stats);
      return;
    } else {
      await this.repository
        .createQueryBuilder()
        .insert()
        .values({
          date,
          count: dto.count,
          channel: { id: dto.channelId },
        })
        .orUpdate(['count'], ['date', 'channel'])
        .updateEntity(false)
        .execute();
    }
  }
}
