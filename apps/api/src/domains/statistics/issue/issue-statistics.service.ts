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
import { DateTime } from 'luxon';
import { Between, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import { UpdateCountDto } from './dtos';
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
          const intervalCount = Math.floor(
            DateTime.fromJSDate(from)
              .until(DateTime.fromJSDate(new Date(curr.date)))
              .length(interval),
          );
          const endOfInterval = DateTime.fromJSDate(from).plus({
            [interval]: intervalCount,
          });

          let statistic = acc.find(
            (stat) => stat.date === endOfInterval.toFormat('yyyy-MM-dd'),
          );
          if (!statistic) {
            statistic = {
              date: endOfInterval.toFormat('yyyy-MM-dd'),
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

  async getCountByStatus(dto: GetCountDto) {
    return {
      statistics: await this.issueRepository
        .createQueryBuilder('issue')
        .select('issue.status', 'status')
        .addSelect('COUNT(issue.id)', 'count')
        .where('issue.project_id = :projectId', { projectId: dto.projectId })
        .andWhere('issue.createdAt BETWEEN :from AND :to', {
          from: dto.from,
          to: dto.to,
        })
        .groupBy('issue.status')
        .getRawMany()
        .then((res) =>
          res.map((stat) => ({ status: stat.status, count: stat.count })),
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

  @Transactional()
  async updateCount(dto: UpdateCountDto) {
    if (dto.count === 0) return;
    if (!dto.count) dto.count = 1;

    const stats = await this.repository.findOne({
      where: {
        date: new Date(dto.date.toISOString().split('T')[0] + 'T00:00:00'),
        project: { id: dto.projectId },
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
          project: { id: dto.projectId },
        })
        .orUpdate(['count'], ['date', 'project'])
        .updateEntity(false)
        .execute();
    }
  }
}
