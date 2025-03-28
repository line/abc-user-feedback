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
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import { Between, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { LockTypeEnum } from '@/domains/operation/scheduler-lock/lock-type.enum';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import { getIntervalDatesInFormat } from '../utils/util-functions';
import { UpdateCountDto } from './dtos';
import type {
  GetCountByDateDto,
  GetCountByStatusDto,
  GetCountDto,
} from './dtos';
import { IssueStatisticsEntity } from './issue-statistics.entity';

dotenv.config();

interface IssueEntityWithCount extends IssueEntity {
  count: string;
}

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
    private readonly schedulerLockService: SchedulerLockService,
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
    const { startDate, endDate, interval } = dto;

    const issueStatistics = await this.repository.find({
      where: {
        date: Between(new Date(startDate), new Date(endDate)),
        project: { id: dto.projectId },
      },
      order: { date: 'ASC' },
    });

    return {
      statistics: issueStatistics.reduce(
        (acc, curr) => {
          const { startOfInterval, endOfInterval } = getIntervalDatesInFormat(
            startDate,
            endDate,
            curr.date,
            interval,
          );

          let statistic = acc.find(
            (stat) => stat.startDate === startOfInterval,
          );
          if (!statistic) {
            statistic = {
              startDate: startOfInterval,
              endDate: endOfInterval,
              count: 0,
            };
            acc.push(statistic);
          }
          statistic.count += curr.count;

          return acc;
        },
        [] as { startDate: string; endDate: string; count: number }[],
      ),
    };
  }

  async getCountByStatus(dto: GetCountByStatusDto) {
    return {
      statistics: await this.issueRepository
        .createQueryBuilder('issue')
        .select('issue.status', 'status')
        .addSelect('COUNT(issue.id)', 'count')
        .where('issue.project_id = :projectId', { projectId: dto.projectId })
        .groupBy('issue.status')
        .getRawMany()
        .then((res) =>
          res.map((stat: IssueEntityWithCount) => ({
            status: stat.status,
            count: +stat.count,
          })),
        ),
    };
  }

  async addCronJobByProjectId(projectId: number) {
    const project: ProjectEntity | null = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (project === null) {
      throw new NotFoundException(`Project(id: ${projectId}) not found`);
    }

    const timezoneOffset = project.timezone.offset;

    const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

    const job = new CronJob(`4 ${cronHour} * * *`, async () => {
      if (
        await this.schedulerLockService.acquireLock(
          LockTypeEnum.ISSUE_STATISTICS,
          1000 * 60 * 5,
        )
      ) {
        try {
          await this.createIssueStatistics(projectId, 365);
        } finally {
          await this.schedulerLockService.releaseLock(
            LockTypeEnum.ISSUE_STATISTICS,
          );
        }
      } else {
        this.logger.log({
          message: 'Failed to acquire lock for feedback count calculation',
        });
      }
    });

    const name = `issue-statistics-${projectId}`;
    const cronJobs = this.schedulerRegistry.getCronJobs();
    if (cronJobs.has(name)) {
      this.logger.warn(
        `Cron job with name ${name} already exists. Skipping addition.`,
      );
      return;
    }

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(`issue-statistics-${projectId} cron job started`);
  }

  async createIssueStatistics(projectId: number, dayToCreate = 1) {
    const project: ProjectEntity | null = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (project === null) {
      throw new NotFoundException(`Project(id: ${projectId}) not found`);
    }

    const timezoneOffset = project.timezone.offset;
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    for (let day = 1; day <= dayToCreate; day++) {
      try {
        await this.repository.manager.transaction(
          async (transactionalEntityManager) => {
            const issueCount = await this.issueRepository.count({
              where: {
                project: { id: project.id },
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

            if (issueCount === 0) return;

            await transactionalEntityManager
              .createQueryBuilder()
              .insert()
              .into(IssueStatisticsEntity)
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
                count: issueCount,
                project: { id: project.id },
              })
              .orUpdate(['count'], ['date', 'project'])
              .updateEntity(false)
              .execute();
          },
        );
      } catch (error) {
        this.logger.error({
          message: 'Failed to create issue statistics',
          error: error as Error,
        });
      }
    }
  }

  @Transactional()
  async updateCount(dto: UpdateCountDto) {
    if (dto.count === 0) return;
    dto.count ??= 1;

    const project: ProjectEntity | null = await this.projectRepository.findOne({
      where: { id: dto.projectId },
    });

    if (project === null) {
      throw new NotFoundException(`Project(id: ${dto.projectId}) not found`);
    }
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
          date,
          count: dto.count,
          project: { id: dto.projectId },
        })
        .orUpdate(['count'], ['date', 'project'])
        .updateEntity(false)
        .execute();
    }
  }
}
