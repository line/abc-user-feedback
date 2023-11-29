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
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import { Between, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ChannelEntity } from '@/domains/channel/channel/channel.entity';
import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
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
  ) {}

  async getCountByDateByChannel(dto: GetCountByDateByChannelDto) {
    const { from, to, interval, channelIds } = dto;

    const feedbackStatistics = await this.repository.find({
      where: {
        channel: In(channelIds),
        date: Between(from, to),
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

          let endDate: dayjs.Dayjs;
          switch (interval) {
            case 'week':
              endDate = dayjs(curr.date).endOf('week');
              break;
            case 'month':
              endDate = dayjs(curr.date).endOf('month');
              break;
            default:
              endDate = dayjs(curr.date);
          }

          let statistic = channel.statistics.find(
            (stat) => stat.date === endDate.format('YYYY-MM-DD'),
          );
          if (!statistic) {
            statistic = {
              date: endDate.format('YYYY-MM-DD'),
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
          statistics: { date: string; count: number }[];
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
    const { timezoneOffset } = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

    const job = new CronJob(`0 ${cronHour} * * *`, async () => {
      await this.createFeedbackStatistics(projectId);
    });
    this.schedulerRegistry.addCronJob(`feedback-statistics-${projectId}`, job);
    job.start();

    this.logger.log(`feedback-statistics-${projectId} cron job started`);
  }

  @Transactional()
  async createFeedbackStatistics(projectId: number, dayToCreate: number = 1) {
    const { timezoneOffset } = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    const channels = await this.channelRepository.find({
      where: { project: { id: projectId } },
    });

    for (let day = 1; day <= dayToCreate; day++) {
      for (const channel of channels) {
        const feedbackCount = await this.feedbackRepository.count({
          where: {
            channel: { id: channel.id },
            createdAt: Between(
              dayjs()
                .subtract(day, 'day')
                .startOf('day')
                .subtract(-offset, 'hour')
                .toDate(),
              dayjs()
                .subtract(day, 'day')
                .endOf('day')
                .subtract(-offset, 'hour')
                .toDate(),
            ),
          },
        });

        if (feedbackCount === 0) continue;

        await this.repository
          .createQueryBuilder()
          .insert()
          .values({
            date: dayjs().subtract(day, 'day').toDate(),
            count: feedbackCount,
            channel: { id: channel.id },
          })
          .orUpdate(['count'], ['date', 'channel'])
          .updateEntity(false)
          .execute();
      }
    }
  }
}
