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
import { Between, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import type { GetCountByDateDto, GetCountDto } from './dtos';
import { IssueStatisticsEntity } from './issue-statistics.entity';

dotenv.config();

@Injectable()
export class IssueStatisticsService {
  private logger = new Logger(IssueStatisticsService.name);

  constructor(
    @InjectRepository(IssueStatisticsEntity)
    private readonly repository: Repository<IssueStatisticsEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async getCount(dto: GetCountDto) {
    return {
      count: await this.issueRepository.count({
        where: {
          createdAt: Between(dto.from, dto.to),
          project: { id: dto.projectId },
        },
      }),
    };
  }

  async getCountByDate(dto: GetCountByDateDto) {
    const { from, to, interval } = dto;

    const issueStatistics = await this.repository.find({
      where: {
        date: Between(from, to),
        project: { id: dto.projectId },
      },
      order: { date: 'ASC' },
    });

    return {
      statistics: issueStatistics.reduce(
        (acc, curr) => {
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

          let statistic = acc.find(
            (stat) => stat.date === endDate.format('YYYY-MM-DD'),
          );
          if (!statistic) {
            statistic = {
              date: endDate.format('YYYY-MM-DD'),
              count: 0,
            };
            acc.push(statistic);
          }
          statistic.count += curr.count;

          return acc;
        },
        [] as { date: string; count: number }[],
      ),
    };
  }

  async addCronJobByProjectId(projectId: number) {
    const { timezoneOffset } = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

    const job = new CronJob(`0 ${cronHour} * * *`, async () => {
      await this.createIssueStatistics(projectId);
    });
    this.schedulerRegistry.addCronJob(`issue-statistics-${projectId}`, job);
    job.start();

    this.logger.log(`issue-statistics-${projectId} cron job started`);
  }

  @Transactional()
  async createIssueStatistics(projectId: number, dayToCreate: number = 1) {
    const { timezoneOffset, id } = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    for (let day = 1; day <= dayToCreate; day++) {
      const issueCount = await this.issueRepository.count({
        where: {
          project: { id },
          createdAt: Between(
            dayjs()
              .subtract(day, 'day')
              .startOf('day')
              .subtract(offset, 'hour')
              .toDate(),
            dayjs()
              .subtract(day, 'day')
              .endOf('day')
              .subtract(offset, 'hour')
              .toDate(),
          ),
        },
      });

      if (issueCount === 0) continue;

      await this.repository
        .createQueryBuilder()
        .insert()
        .values({
          date: dayjs().subtract(day, 'day').toDate(),
          count: issueCount,
          project: { id },
        })
        .orUpdate(['count'], ['date', 'project'])
        .updateEntity(false)
        .execute();
    }
  }
}
