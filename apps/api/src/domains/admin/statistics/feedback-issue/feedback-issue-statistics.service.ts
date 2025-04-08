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
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import { Between, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { LockTypeEnum } from '@/domains/operation/scheduler-lock/lock-type.enum';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import { ProjectNotFoundException } from '../../project/project/exceptions';
import { getIntervalDatesInFormat } from '../utils/util-functions';
import { UpdateFeedbackCountDto } from './dtos';
import type { GetCountByDateByIssueDto } from './dtos';
import { FeedbackIssueStatisticsEntity } from './feedback-issue-statistics.entity';

dotenv.config();

@Injectable()
export class FeedbackIssueStatisticsService {
  private logger = new Logger(FeedbackIssueStatisticsService.name);

  constructor(
    @InjectRepository(FeedbackIssueStatisticsEntity)
    private readonly repository: Repository<FeedbackIssueStatisticsEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly schedulerLockService: SchedulerLockService,
  ) {}

  async getCountByDateByIssue(dto: GetCountByDateByIssueDto) {
    const { startDate, endDate, interval, issueIds } = dto;

    const feedbackIssueStatistics = await this.repository.find({
      where: {
        issue: { id: In(issueIds) },
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: { issue: true },
      order: { issue: { id: 'ASC' }, date: 'ASC' },
    });

    return {
      issues: feedbackIssueStatistics.reduce(
        (acc, curr) => {
          let issue = acc.find((ch) => ch.id === curr.issue.id);
          if (!issue) {
            issue = {
              id: curr.issue.id,
              name: curr.issue.name,
              statistics: [],
            };
            acc.push(issue);
          }

          const { startOfInterval, endOfInterval } = getIntervalDatesInFormat(
            startDate,
            endDate,
            curr.date,
            interval,
          );

          let statistic = issue.statistics.find(
            (stat) => stat.startDate === startOfInterval,
          );
          if (!statistic) {
            statistic = {
              startDate: startOfInterval,
              endDate: endOfInterval,
              feedbackCount: 0,
            };
            issue.statistics.push(statistic);
          }
          statistic.feedbackCount += curr.feedbackCount;

          return acc;
        },
        [] as {
          id: number;
          name: string;
          statistics: {
            startDate: string;
            endDate: string;
            feedbackCount: number;
          }[];
        }[],
      ),
    };
  }

  async addCronJobByProjectId(projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (project === null) throw new ProjectNotFoundException();
    const timezoneOffset = project.timezone.offset;

    const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

    const job = new CronJob(`2 ${cronHour} * * *`, async () => {
      if (
        await this.schedulerLockService.acquireLock(
          LockTypeEnum.FEEDBACK_ISSUE_STATISTICS,
          1000 * 60 * 5,
        )
      ) {
        try {
          await this.createFeedbackIssueStatistics(projectId, 365);
        } finally {
          await this.schedulerLockService.releaseLock(
            LockTypeEnum.FEEDBACK_ISSUE_STATISTICS,
          );
        }
      } else {
        this.logger.log({
          message: 'Failed to acquire lock for feedback count calculation',
        });
      }
    });

    const name = `feedback-issue-statistics-${projectId}`;
    const cronJobs = this.schedulerRegistry.getCronJobs();
    if (cronJobs.has(name)) {
      this.logger.warn(
        `Cron job with name ${name} already exists. Skipping addition.`,
      );
      return;
    }

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(`feedback-issue-statistics-${projectId} cron job started`);
  }

  async createFeedbackIssueStatistics(projectId: number, dayToCreate = 1) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (project === null) throw new ProjectNotFoundException();
    const timezoneOffset = project.timezone.offset;
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    const issues = await this.issueRepository.find({
      where: { project: { id: projectId } },
    });

    for (let day = 1; day <= dayToCreate; day++) {
      for (const issue of issues) {
        try {
          await this.repository.manager.transaction(
            async (transactionalEntityManager) => {
              const feedbackCount = await this.feedbackRepository.count({
                where: {
                  issues: { id: issue.id },
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
                .into(FeedbackIssueStatisticsEntity)
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
                  issue: { id: issue.id },
                  feedbackCount,
                })
                .orUpdate(['feedback_count'], ['date', 'issue'])
                .updateEntity(false)
                .execute();
            },
          );
        } catch (error) {
          this.logger.error({
            message: 'Failed to create feedback issue statistics',
            error: error as Error,
          });
        }
      }
    }
  }

  @Transactional()
  async updateFeedbackCount(dto: UpdateFeedbackCountDto) {
    if (dto.feedbackCount === 0) return;
    dto.feedbackCount ??= 1;

    const project = await this.projectRepository.findOne({
      where: { issues: { id: dto.issueId } },
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
        issue: { id: dto.issueId },
      },
    });

    if (stats) {
      stats.feedbackCount += dto.feedbackCount;
      await this.repository.save(stats);
      return;
    } else {
      await this.repository
        .createQueryBuilder()
        .insert()
        .values({
          date,
          feedbackCount: dto.feedbackCount,
          issue: { id: dto.issueId },
        })
        .orUpdate(['feedback_count'], ['date', 'issue'])
        .updateEntity(false)
        .execute();
    }
  }
}
