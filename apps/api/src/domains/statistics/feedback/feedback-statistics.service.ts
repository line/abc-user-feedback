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

import { ChannelEntity } from '@/domains/channel/channel/channel.entity';
import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
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

          if (interval === 'day') {
            channel.statistics.push({
              date: DateTime.fromJSDate(new Date(curr.date)).toFormat(
                'yyyy-MM-dd',
              ),
              count: curr.count,
            });
          } else {
            const intervalCount = Math.ceil(
              DateTime.fromJSDate(new Date(curr.date))
                .until(DateTime.fromJSDate(to))
                .length(interval),
            );
            const endOfInterval = DateTime.fromJSDate(to).minus({
              [interval]: intervalCount,
            });

            let statistic = channel.statistics.find(
              (stat) => stat.date === endOfInterval.toFormat('yyyy-MM-dd'),
            );
            if (!statistic) {
              statistic = {
                date: endOfInterval.toFormat('yyyy-MM-dd'),
                count: 0,
              };
              channel.statistics.push(statistic);
            }
            statistic.count += curr.count;
            console.log(
              'endOfInterval: ',
              endOfInterval.toFormat('yyyy-MM-dd'),
            );
            console.log('statistic.count: ', statistic.count);
          }

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

        if (feedbackCount === 0) continue;

        await this.repository
          .createQueryBuilder()
          .insert()
          .values({
            date:
              offset >= 0
                ? DateTime.utc()
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
      }
    }
  }

  @Transactional()
  async updateCount(dto: UpdateCountDto) {
    if (dto.count === 0) return;
    if (!dto.count) dto.count = 1;

    const stats = await this.repository.findOne({
      where: {
        date: new Date(dto.date.toISOString().split('T')[0] + 'T00:00:00'),
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
          date: new Date(dto.date.toISOString().split('T')[0] + 'T00:00:00'),
          count: dto.count,
          channel: { id: dto.channelId },
        })
        .orUpdate(['count'], ['date', 'channel'])
        .updateEntity(false)
        .execute();
    }
  }
}
