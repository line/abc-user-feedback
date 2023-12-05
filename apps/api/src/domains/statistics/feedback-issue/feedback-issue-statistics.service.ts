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
import { Between, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
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
  ) {}

  async getCountByDateByIssue(dto: GetCountByDateByIssueDto) {
    const { from, to, interval, issueIds } = dto;

    const feedbackIssueStatistics = await this.repository.find({
      where: {
        issue: { id: In(issueIds) },
        date: Between(from, to),
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

          const intervalCount = Math.floor(
            DateTime.fromJSDate(from)
              .until(DateTime.fromJSDate(new Date(curr.date)))
              .length(interval),
          );
          const endOfInterval = DateTime.fromJSDate(from).plus({
            [interval]: intervalCount,
          });

          let statistic = issue.statistics.find(
            (stat) => stat.date === endOfInterval.toFormat('yyyy-MM-dd'),
          );
          if (!statistic) {
            statistic = {
              date: endOfInterval.toFormat('yyyy-MM-dd'),
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
          statistics: { date: string; feedbackCount: number }[];
        }[],
      ),
    };
  }

  async addCronJobByProjectId(projectId: number) {
    const { timezoneOffset } = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

    const job = new CronJob(`0 ${cronHour} * * *`, async () => {
      await this.createFeedbackIssueStatistics(projectId);
    });
    this.schedulerRegistry.addCronJob(
      `feedback-issue-statistics-${projectId}`,
      job,
    );
    job.start();

    this.logger.log(`feedback-issue-statistics-${projectId} cron job started`);
  }

  @Transactional()
  async createFeedbackIssueStatistics(
    projectId: number,
    dayToCreate: number = 1,
  ) {
    const { timezoneOffset } = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const [hours, minutes] = timezoneOffset.split(':');
    const offset = Number(hours) + Number(minutes) / 60;

    const issues = await this.issueRepository.find({
      where: { project: { id: projectId } },
    });

    for (let day = 1; day <= dayToCreate; day++) {
      for (const issue of issues) {
        const feedbackCount = await this.feedbackRepository.count({
          where: {
            issues: { id: issue.id },
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

        if (feedbackCount === 0) continue;

        await this.repository
          .createQueryBuilder()
          .insert()
          .values({
            date: dayjs().subtract(day, 'day').toDate(),
            issue: { id: issue.id },
            feedbackCount,
          })
          .orUpdate(['feedback_count'], ['date', 'issue'])
          .updateEntity(false)
          .execute();
      }
    }
  }

  @Transactional()
  async updateFeedbackCount(dto: UpdateFeedbackCountDto) {
    if (dto.feedbackCount === 0) return;
    if (!dto.feedbackCount) dto.feedbackCount = 1;

    const stats = await this.repository.findOne({
      where: {
        date: new Date(dto.date.toISOString().split('T')[0] + 'T00:00:00'),
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
          date: new Date(dto.date.toISOString().split('T')[0] + 'T00:00:00'),
          feedbackCount: dto.feedbackCount,
          issue: { id: dto.issueId },
        })
        .orUpdate(['feedback_count'], ['date', 'issue'])
        .updateEntity(false)
        .execute();
    }
  }
}
