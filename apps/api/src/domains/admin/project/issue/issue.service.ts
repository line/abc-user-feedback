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
import { DateTime } from 'luxon';
import { paginate } from 'nestjs-typeorm-paginate';
import type { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { In, Like, Not, Raw, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { TimeRange } from '@/common/dtos';
import type { CountByProjectIdDto } from '@/domains/admin/feedback/dtos';
import { IssueStatisticsService } from '@/domains/admin/statistics/issue/issue-statistics.service';
import { LockTypeEnum } from '@/domains/operation/scheduler-lock/lock-type.enum';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import { ProjectEntity } from '../project/project.entity';
import type { FindByIssueIdDto, FindIssuesByProjectIdDto } from './dtos';
import { CreateIssueDto, UpdateIssueDto } from './dtos';
import {
  IssueInvalidNameException,
  IssueNameDuplicatedException,
  IssueNotFoundException,
} from './exceptions';
import { IssueEntity } from './issue.entity';

@Injectable()
export class IssueService {
  private logger = new Logger(IssueService.name);
  constructor(
    @InjectRepository(IssueEntity)
    private readonly repository: Repository<IssueEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly issueStatisticsService: IssueStatisticsService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly schedulerLockService: SchedulerLockService,
  ) {}

  @Transactional()
  async create(dto: CreateIssueDto) {
    const issue = CreateIssueDto.toIssueEntity(dto);

    const duplicateIssue = await this.repository.findOneBy({
      name: issue.name,
      project: { id: issue.project.id },
    });

    if (duplicateIssue) throw new IssueNameDuplicatedException();

    const savedIssue = await this.repository.save(issue);

    await this.issueStatisticsService.updateCount({
      projectId: savedIssue.project.id,
      date: DateTime.utc().toJSDate(),
      count: 1,
    });

    return savedIssue;
  }

  async findIssuesByProjectId(dto: FindIssuesByProjectIdDto) {
    const { projectId, query = {}, sort = {}, page, limit } = dto;

    const searchOptions: FindManyOptions<IssueEntity> = {
      order: sort,
    };

    const andWhere: FindOptionsWhere<IssueEntity> = {
      project: { id: projectId },
    };

    if (query.createdAt) {
      andWhere.createdAt = Raw(
        (alias) => `${alias} >= :gte AND ${alias} < :lt`,
        query.createdAt as TimeRange,
      );
    }

    if (query.updatedAt) {
      andWhere.updatedAt = Raw(
        (alias) => `${alias} >= :gte AND ${alias} < :lt`,
        query.updatedAt as TimeRange,
      );
    }

    if (query.id) {
      andWhere.id = query.id as number;
    }

    if (query.statuses) {
      andWhere.status = In(query.statuses as string[]);
    }

    for (const column of Object.keys(query)) {
      if (
        ['id', 'createdAt', 'updatedAt', 'searchText', 'statuses'].includes(
          column,
        )
      ) {
        continue;
      }

      andWhere[column] = Like(`%${query[column]}%`);
    }

    if (query.searchText) {
      searchOptions.where = [
        { ...andWhere, name: Like(`%${query.searchText}%`) },
        { ...andWhere, description: Like(`%${query.searchText}%`) },
        { ...andWhere, externalIssueId: Like(`%${query.searchText}%`) },
      ];
      if (!Number.isNaN(parseInt(query.searchText))) {
        searchOptions.where.push({
          ...andWhere,
          id: parseInt(query.searchText),
        });
      }
    } else {
      searchOptions.where = [andWhere];
    }

    const result = await paginate(
      this.repository.createQueryBuilder().setFindOptions(searchOptions),
      { page, limit },
    );

    return result;
  }

  async findById({ issueId }: FindByIssueIdDto) {
    const issue = await this.repository.findOneBy({ id: issueId });
    if (!issue) throw new IssueNotFoundException();

    return issue;
  }

  async findByName({ name }: { name: string }) {
    const issue = await this.repository.findOneBy({ name });

    return issue;
  }

  async findIssuesByFeedbackIds(feedbackIds: number[]) {
    const issues = await this.repository.find({
      relations: { feedbacks: true },
      where: { feedbacks: { id: In(feedbackIds) } },
      order: { id: 'ASC' },
    });

    return feedbackIds.reduce(
      (issuesByFeedbackId: Record<number, IssueEntity[]>, feedbackId) => {
        issuesByFeedbackId[feedbackId] = issues
          .filter((issue) => {
            for (const feedbackIssue of issue.feedbacks) {
              if (feedbackIssue.id === feedbackId) {
                return true;
              }
            }
          })
          .map((issue) => {
            const { feedbacks: _, ...rest } = issue;
            return { ...rest } as IssueEntity;
          });

        return issuesByFeedbackId;
      },
      {},
    );
  }

  @Transactional()
  async update(dto: UpdateIssueDto) {
    const { issueId, name } = dto;
    const issue = await this.findById({ issueId });

    if (
      await this.repository.findOne({
        where: { name, id: Not(issueId) },
        select: ['id'],
      })
    ) {
      throw new IssueInvalidNameException('Duplicated name');
    }
    await this.repository.save(Object.assign(issue, dto));
  }

  @Transactional()
  async deleteById(id: number) {
    const issue = await this.repository.findOne({
      where: { id },
      relations: { project: true },
    });

    await this.issueStatisticsService.updateCount({
      projectId: issue.project.id,
      date: issue.createdAt,
      count: -1,
    });

    await this.repository.remove(issue);
  }

  @Transactional()
  async deleteByIds(ids: number[]) {
    const issues = await this.repository.find({
      where: { id: In(ids) },
      relations: { project: true },
    });

    for (const issue of issues) {
      await this.issueStatisticsService.updateCount({
        projectId: issue.project.id,
        date: issue.createdAt,
        count: -1,
      });
    }

    await this.repository.remove(issues);
  }

  async countByProjectId({ projectId }: CountByProjectIdDto) {
    return {
      total: await this.repository.count({
        relations: { project: true },
        where: { project: { id: projectId } },
      }),
    };
  }

  async calculateFeedbackCount(projectId: number) {
    await this.repository
      .createQueryBuilder()
      .update('issues')
      .set({
        feedbackCount: () =>
          '(SELECT COUNT(*) FROM feedbacks_issues_issues WHERE issues.id = feedbacks_issues_issues.issues_id)',
      })
      .where('project_id = :projectId', { projectId })
      .execute();
  }

  async addCronJob() {
    const projects = await this.projectRepository.find();
    for (const { id, timezone } of projects) {
      const timezoneOffset = timezone.offset;

      const cronHour = (24 - Number(timezoneOffset.split(':')[0])) % 24;

      const job = new CronJob(`30 ${cronHour} * * *`, async () => {
        if (
          await this.schedulerLockService.acquireLock(
            LockTypeEnum.FEEDBACK_COUNT,
            1000 * 60 * 5,
          )
        ) {
          try {
            await this.calculateFeedbackCount(id);
          } finally {
            await this.schedulerLockService.releaseLock(
              LockTypeEnum.FEEDBACK_COUNT,
            );
          }
        } else {
          this.logger.log({
            message: 'Failed to acquire lock for feedback count calculation',
          });
        }
      });
      this.schedulerRegistry.addCronJob(`feedback-count-by-issue-${id}`, job);
      job.start();
    }
  }
}
