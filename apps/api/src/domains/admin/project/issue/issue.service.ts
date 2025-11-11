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
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import type { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Brackets, In, Like, Not, Raw, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { TimeRange } from '@/common/dtos';
import {
  EventTypeEnum,
  QueryV2ConditionsEnum,
  SortMethodEnum,
} from '@/common/enums';
import { paginateHelper } from '@/common/helper/paginate.helper';
import type { CountByProjectIdDto } from '@/domains/admin/feedback/dtos';
import { IssueStatisticsService } from '@/domains/admin/statistics/issue/issue-statistics.service';
import { LockTypeEnum } from '@/domains/operation/scheduler-lock/lock-type.enum';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import { isInvalidSortMethod } from '../../feedback/feedback.common';
import { CategoryEntity } from '../category/category.entity';
import { CategoryNotFoundException } from '../category/exceptions';
import { ProjectEntity } from '../project/project.entity';
import type {
  FindByIssueIdDto,
  FindIssuesByProjectIdDto,
  FindIssuesByProjectIdDtoV2,
} from './dtos';
import { CreateIssueDto, UpdateIssueDto } from './dtos';
import { UpdateIssueCategoryDto } from './dtos/update-issue-category.dto';
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
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly issueStatisticsService: IssueStatisticsService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly schedulerLockService: SchedulerLockService,
    private readonly eventEmitter: EventEmitter2,
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

    this.eventEmitter.emit(EventTypeEnum.ISSUE_CREATION, {
      issueId: savedIssue.id,
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

      andWhere[column] = Like(`%${query[column] as string}%`);
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

    const result = await paginateHelper(
      this.repository.createQueryBuilder(),
      searchOptions,
      { page, limit },
    );

    return result;
  }

  async findIssuesByProjectIdV2(
    dto: FindIssuesByProjectIdDtoV2,
  ): Promise<Pagination<IssueEntity, IPaginationMeta>> {
    const {
      projectId,
      queries = [],
      defaultQueries = [],
      sort = {},
      operator = 'AND',
      page,
      limit,
    } = dto;

    const queryBuilder = this.repository
      .createQueryBuilder('issues')
      .leftJoinAndSelect('issues.category', 'category')
      .where('issues.project_id = :projectId', { projectId });

    defaultQueries.forEach((query) => {
      const { key, value, condition } = query;

      if (key === 'createdAt' && value) {
        const { gte, lt } = value as TimeRange;
        queryBuilder.andWhere('issues.created_at >= :gte', { gte });
        queryBuilder.andWhere('issues.created_at < :lt', { lt });
      } else if (key === 'status' && condition === QueryV2ConditionsEnum.IS) {
        queryBuilder.andWhere('issues.status = :status', { status: value });
      }
    });

    const categoryIdCondition = queries.find(
      (query) => query.key === 'categoryId' && typeof query.value === 'number',
    );
    if (typeof categoryIdCondition?.value === 'number') {
      if (categoryIdCondition.value === 0) {
        queryBuilder.andWhere('issues.category_id is NULL');
      } else {
        queryBuilder.andWhere('issues.category_id = :categoryId', {
          categoryId: categoryIdCondition.value,
        });
      }
    }

    const method = operator === 'AND' ? 'andWhere' : 'orWhere';

    queryBuilder.andWhere(
      new Brackets((qb) => {
        let paramIndex = 0;
        for (const query of queries) {
          const { key, value, condition } = query;
          if (key === 'createdAt' || key === 'categoryId') continue;

          const paramName = `value${paramIndex++}`;

          if (key === 'updatedAt') {
            const { gte, lt } = value as TimeRange;
            qb[method](`issues.updated_at >= :gte${paramName}`, {
              [`gte${paramName}`]: gte,
            });
            qb[method](`issues.updated_at < :lt${paramName}`, {
              [`lt${paramName}`]: lt,
            });
          } else if (
            key === 'status' &&
            condition === QueryV2ConditionsEnum.IS
          ) {
            qb[method](`issues.status = :${paramName}`, {
              [`${paramName}`]: value,
            });
          } else if (
            key === 'externalIssueId' &&
            condition === QueryV2ConditionsEnum.IS
          ) {
            qb[method](`issues.external_issue_id = :${paramName}`, {
              [paramName]: value,
            });
          } else if (['name', 'description', 'category'].includes(key)) {
            const tableName =
              key === 'category' ? 'category.name' : `issues.${key}`;
            const operator =
              condition === QueryV2ConditionsEnum.IS ? '=' : 'LIKE';
            const valueFormat =
              condition === QueryV2ConditionsEnum.IS ?
                value
              : `%${value?.toString()}%`;
            qb[method](`${tableName} ${operator} :${paramName}`, {
              [paramName]: valueFormat,
            });
          }
        }
      }),
    );

    if (Object.keys(sort).length === 0) {
      sort.id = SortMethodEnum.DESC;
    }
    Object.keys(sort).forEach((fieldName) => {
      if (isInvalidSortMethod(sort[fieldName])) {
        throw new BadRequestException('invalid sort method');
      }

      if (fieldName === 'feedbackCount') {
        queryBuilder.addOrderBy(`issues.feedback_count`, sort[fieldName]);
      } else if (fieldName === 'createdAt') {
        queryBuilder.addOrderBy(`issues.created_at`, sort[fieldName]);
      } else if (fieldName === 'updatedAt') {
        queryBuilder.addOrderBy(`issues.updated_at`, sort[fieldName]);
      } else if (fieldName === 'name') {
        queryBuilder.addOrderBy(`issues.name`, sort[fieldName]);
      }
    });

    const items = await queryBuilder
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const total = await queryBuilder.getCount();

    return {
      items,
      meta: {
        itemCount: items.length,
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById({ issueId }: FindByIssueIdDto) {
    const issue = await this.repository.find({
      where: { id: issueId },
      relations: { project: true },
    });
    if (issue.length === 0) throw new IssueNotFoundException();

    return issue[0];
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
    const { issueId, name, status } = dto;
    const issue = await this.findById({ issueId });

    if (
      await this.repository.findOne({
        where: { name, id: Not(issueId), project: { id: issue.project.id } },
        select: ['id'],
      })
    ) {
      throw new IssueInvalidNameException('Duplicated name');
    }

    const statusHasChanged = issue.status !== status;
    const previousStatus = issue.status;

    const updatedIssue = await this.repository.save(Object.assign(issue, dto));

    if (statusHasChanged)
      this.eventEmitter.emit(EventTypeEnum.ISSUE_STATUS_CHANGE, {
        issueId,
        previousStatus,
      });

    return updatedIssue;
  }

  @Transactional()
  async updateByCategoryId(dto: UpdateIssueCategoryDto) {
    const { issueId, categoryId } = dto;
    const issue = await this.repository.findOne({
      where: { id: issueId },
      relations: { category: true },
    });

    if (!issue) throw new IssueNotFoundException();

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new CategoryNotFoundException();

    issue.category = new CategoryEntity();
    issue.category.id = categoryId;

    const updatedIssue = await this.repository.save(issue);

    return updatedIssue;
  }

  @Transactional()
  async deleteByCategoryId({
    issueId,
    categoryId,
  }: {
    issueId: number;
    categoryId: number;
  }) {
    const issue = await this.repository.findOne({
      where: { id: issueId },
      relations: { category: true },
    });

    if (!issue) throw new IssueNotFoundException();

    if (issue.category?.id !== categoryId) {
      throw new BadRequestException('Category id does not match');
    }

    issue.category = null;

    const updatedIssue = await this.repository.save(issue);

    return updatedIssue;
  }

  @Transactional()
  async deleteById(id: number) {
    const issue =
      (await this.repository.findOne({
        where: { id },
        relations: { project: true },
      })) ?? new IssueEntity();

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

      const name = `feedback-count-by-issue-${id}`;
      const cronJobs = this.schedulerRegistry.getCronJobs();
      if (cronJobs.has(name)) {
        this.logger.warn(
          `Cron job with name ${name} already exists. Skipping addition.`,
        );
        return;
      }

      this.schedulerRegistry.addCronJob(name, job);
      job.start();
    }
  }
}
