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
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { ClsService } from 'nestjs-cls';
import type { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Brackets, In, QueryFailedError, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { TimeRange } from '@/common/dtos';
import {
  FieldFormatEnum,
  QueryV2ConditionsEnum,
  SortMethodEnum,
} from '@/common/enums';
import type { ClsServiceType } from '@/types/cls-service.type';
import { ChannelEntity } from '../channel/channel/channel.entity';
import { FieldEntity } from '../channel/field/field.entity';
import { OptionEntity } from '../channel/option/option.entity';
import { IssueEntity } from '../project/issue/issue.entity';
import { FeedbackIssueStatisticsService } from '../statistics/feedback-issue/feedback-issue-statistics.service';
import { FeedbackStatisticsService } from '../statistics/feedback/feedback-statistics.service';
import type { CountByProjectIdDto, FindFeedbacksByChannelIdDto } from './dtos';
import {
  AddIssueDto,
  CreateFeedbackMySQLDto,
  DeleteByIdsDto,
  RemoveIssueDto,
  UpdateFeedbackMySQLDto,
} from './dtos';
import { FindFeedbacksByChannelIdDtoV2 } from './dtos/find-feedbacks-by-channel-id-v2.dto';
import { Feedback } from './dtos/responses/find-feedbacks-by-channel-id-response.dto';
import { isInvalidSortMethod } from './feedback.common';
import { FeedbackEntity } from './feedback.entity';

interface QueryFailedDriverError {
  code: string;
}

@Injectable()
export class FeedbackMySQLService {
  private logger = new Logger(FeedbackMySQLService.name);
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
    private readonly cls: ClsService<ClsServiceType>,
    private readonly feedbackStatisticsService: FeedbackStatisticsService,
    private readonly feedbackIssueStatisticsService: FeedbackIssueStatisticsService,
  ) {}

  @Transactional()
  async create({ channelId, data }: CreateFeedbackMySQLDto) {
    const feedback = new FeedbackEntity();
    feedback.channel = new ChannelEntity();
    feedback.channel.id = channelId;
    if (data.createdAt) {
      feedback.createdAt = data.createdAt as Date;
      delete data.createdAt;
    }
    feedback.data = data;

    await this.feedbackStatisticsService.updateCount({
      channelId,
      date: DateTime.utc().toJSDate(),
      count: 1,
    });

    return await this.feedbackRepository.save(feedback);
  }

  async findByChannelId(
    dto: FindFeedbacksByChannelIdDto,
  ): Promise<Pagination<Feedback, IPaginationMeta>> {
    const {
      page,
      limit,
      channelId,
      query = {},
      sort = {},
      fields = [new FieldEntity()],
    } = dto;

    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedbacks')
      .leftJoin(
        'feedbacks_issues_issues',
        'feedbacks_issues_issues',
        'feedbacks_issues_issues.feedbacks_id = feedbacks.id',
      )
      .select('feedbacks')
      .where('feedbacks.channel_id = :channelId', { channelId });

    for (const [fieldKey, value] of Object.entries(query)) {
      if (fieldKey === 'ids') {
        queryBuilder.andWhere('feedbacks.id IN(:value)', { value });
      } else if (fieldKey === 'searchText') {
        const searchableFields = fields.reduce((prev, field) => {
          if (
            [
              FieldFormatEnum.keyword,
              FieldFormatEnum.text,
              FieldFormatEnum.aiField,
              FieldFormatEnum.number,
              FieldFormatEnum.select,
              FieldFormatEnum.multiSelect,
              FieldFormatEnum.date,
            ].includes(field.format)
          ) {
            prev.push(field);
          }
          return prev;
        }, [] as FieldEntity[]);

        if (searchableFields.length > 0) {
          queryBuilder.andWhere(
            new Brackets((qb) => {
              for (let i = 0; i < searchableFields.length; i++) {
                const field = searchableFields[i];
                const jsonExtractExpression = `JSON_EXTRACT(feedbacks.data, '$."${field.key}"')`;

                if (field.format === FieldFormatEnum.aiField) {
                  const jsonExtractExpression = `JSON_EXTRACT(JSON_UNQUOTE(JSON_EXTRACT(feedbacks.data, '$.${field.key}')), '$.message')`;
                  if (i === 0) {
                    qb.where(`${jsonExtractExpression} like :likeValue`, {
                      likeValue: `%${value as string | number}%`,
                    });
                  } else {
                    qb.orWhere(`${jsonExtractExpression} like :likeValue`, {
                      likeValue: `%${value as string | number}%`,
                    });
                  }
                } else if (
                  field.format === FieldFormatEnum.keyword ||
                  field.format === FieldFormatEnum.select ||
                  field.format === FieldFormatEnum.date ||
                  field.format === FieldFormatEnum.number
                ) {
                  if (i === 0) {
                    qb.where(`${jsonExtractExpression} = :value`, { value });
                  } else {
                    qb.orWhere(`${jsonExtractExpression} = :value`, { value });
                  }
                } else if (field.format === FieldFormatEnum.text) {
                  if (i === 0) {
                    qb.where(`${jsonExtractExpression} like :likeValue`, {
                      likeValue: `%${value as string | number}%`,
                    });
                  } else {
                    qb.orWhere(`${jsonExtractExpression} like :likeValue`, {
                      likeValue: `%${value as string | number}%`,
                    });
                  }
                } else if (field.format === FieldFormatEnum.multiSelect) {
                  const jsonValue = JSON.stringify([value]);
                  if (i === 0) {
                    qb.where(
                      `JSON_CONTAINS(${jsonExtractExpression}, :jsonValue)`,
                      { jsonValue },
                    );
                  } else {
                    qb.orWhere(
                      `JSON_CONTAINS(${jsonExtractExpression}, :jsonValue)`,
                      { jsonValue },
                    );
                  }
                }
              }
            }),
          );
        }
      } else if (fieldKey === 'issueIds') {
        queryBuilder.andWhere(
          'feedbacks_issues_issues.issues_id IN(:issueIds)',
          {
            issueIds: value,
          },
        );
      } else if (fieldKey === 'createdAt') {
        const { gte, lt } = value as TimeRange;
        queryBuilder.andWhere('feedbacks.created_at >= :gte', { gte });
        queryBuilder.andWhere('feedbacks.created_at < :lt', { lt });
      } else if (fieldKey === 'updatedAt') {
        const { gte, lt } = value as TimeRange;
        queryBuilder.andWhere('feedbacks.updated_at >= :gte', { gte });
        queryBuilder.andWhere('feedbacks.updated_at < :lt', { lt });
      } else {
        const { id, format }: { id: number; format: FieldFormatEnum } =
          fields.find((v) => v.key === fieldKey) ?? {
            id: 0,
            format: FieldFormatEnum.date,
          };

        if (format === FieldFormatEnum.select) {
          const options = await this.optionRepository.find({
            where: { field: { id } },
          });
          const option =
            options.find((option) => option.key === value) ??
            new OptionEntity();

          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') = :optionId`,
            { optionId: option.key },
          );
        } else if (format === FieldFormatEnum.multiSelect) {
          const options = await this.optionRepository.find({
            where: { field: { id } },
          });

          for (const optionKey of value as string[]) {
            const option =
              options.find((option) => option.key === optionKey) ??
              new OptionEntity();
            queryBuilder.andWhere(
              `JSON_CONTAINS(
                JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"'),
                '"${option.key}"',
                '$')`,
            );
          }
        } else if (format === FieldFormatEnum.aiField) {
          const jsonExtractExpression = `JSON_EXTRACT(JSON_UNQUOTE(JSON_EXTRACT(feedbacks.data, '$.${fieldKey}')), '$.message')`;
          queryBuilder.andWhere(`${jsonExtractExpression} like :value`, {
            value: `%${value as string}%`,
          });
        } else if (
          [FieldFormatEnum.text, FieldFormatEnum.images].includes(format)
        ) {
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') like :value`,
            { value: `%${value as string | number}%` },
          );
        } else if (format === FieldFormatEnum.date) {
          const { gte, lt } = value as TimeRange;
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') >= :gte`,
            { gte },
          );
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') < :lt`,
            { lt },
          );
        } else {
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') = :value`,
            {
              value,
            },
          );
        }
      }
    }

    queryBuilder.groupBy('feedbacks.id');

    if (Object.keys(sort).length === 0) {
      sort.id = SortMethodEnum.DESC;
    }
    Object.keys(sort).map((fieldName) => {
      if (isInvalidSortMethod(sort[fieldName])) {
        throw new BadRequestException('invalid sort method');
      }

      if (fieldName === 'id') {
        queryBuilder.addOrderBy('id', sort[fieldName]);
      } else if (fieldName === 'createdAt') {
        queryBuilder.addOrderBy('created_at', sort[fieldName]);
      } else if (fieldName === 'updatedAt') {
        queryBuilder.addOrderBy('updated_at', sort[fieldName]);
      } else {
        queryBuilder.addOrderBy(fieldName, sort[fieldName]);
      }
    });

    const items = await queryBuilder
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const total = await queryBuilder.getCount();

    const feedbacks = items.map((item) => {
      return {
        ...item.data,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return {
      items: feedbacks,
      meta: {
        itemCount: feedbacks.length,
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByChannelIdV2(
    dto: FindFeedbacksByChannelIdDtoV2,
  ): Promise<Pagination<Feedback, IPaginationMeta>> {
    const {
      page,
      limit,
      channelId,
      queries = [],
      defaultQueries = [],
      sort = {},
      operator,
      fields = [new FieldEntity()],
    } = dto;

    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedbacks')
      .leftJoin(
        'feedbacks_issues_issues',
        'feedbacks_issues_issues',
        'feedbacks_issues_issues.feedbacks_id = feedbacks.id',
      )
      .select('feedbacks')
      .where('feedbacks.channel_id = :channelId', { channelId });

    defaultQueries.forEach((query) => {
      const { key, value } = query;

      if (key === 'createdAt' && value) {
        const { gte, lt } = value as TimeRange;
        if (query.condition === QueryV2ConditionsEnum.BETWEEN) {
          queryBuilder.andWhere('feedbacks.created_at >= :gte', { gte });
          queryBuilder.andWhere('feedbacks.created_at < :lt', { lt });
        }
      }
    });

    const method = operator === 'AND' ? 'andWhere' : 'orWhere';

    const options = await this.optionRepository.find();

    queryBuilder.andWhere(
      new Brackets((qb) => {
        let paramIndex = 0;
        for (const query of queries) {
          const fieldKey = query.key;
          const value = query.value;

          if (fieldKey === 'createdAt') continue;

          const paramName = `value${paramIndex++}`;

          if (fieldKey === 'id') {
            qb[method](`feedbacks.id = :${paramName}`, {
              [paramName]: value,
            });
          } else if (fieldKey === 'ids') {
            qb[method](`feedbacks.id IN(:${paramName})`, {
              [paramName]: value,
            });
          } else if (fieldKey === 'issueIds') {
            const condition = query.condition;
            const issueIds = value as string[];

            if (condition === QueryV2ConditionsEnum.IS) {
              qb[method](
                `feedbacks.id IN (
                  SELECT feedbacks_id
                  FROM feedbacks_issues_issues
                  GROUP BY feedbacks_id
                  HAVING COUNT(DISTINCT issues_id) = :arrayLength${paramName}
                  AND COUNT(DISTINCT CASE WHEN issues_id IN (:...issueIds${paramName}) THEN issues_id END) = :arrayLength${paramName}
                )`,
                {
                  [`arrayLength${paramName}`]: issueIds.length,
                  [`issueIds${paramName}`]: issueIds,
                },
              );
            } else if (condition === QueryV2ConditionsEnum.CONTAINS) {
              qb[method](
                `feedbacks.id IN (
                  SELECT feedbacks_id
                  FROM feedbacks_issues_issues
                  WHERE issues_id IN (:...issueIds${paramName})
                  GROUP BY feedbacks_id
                  HAVING COUNT(DISTINCT issues_id) = :arrayLength${paramName}
                )`,
                {
                  [`arrayLength${paramName}`]: issueIds.length,
                  [`issueIds${paramName}`]: issueIds,
                },
              );
            }
          } else if (fieldKey === 'updatedAt') {
            const { gte, lt } = value as TimeRange;
            qb[method](`feedbacks.updated_at >= :gte${paramName}`, {
              [paramName]: gte,
            });
            qb[method](`feedbacks.updated_at < :lt${paramName}`, {
              [paramName]: lt,
            });
          } else {
            const { format }: { format: FieldFormatEnum } = fields.find(
              (v) => v.key === fieldKey,
            ) ?? { format: FieldFormatEnum.date };

            if (format === FieldFormatEnum.select) {
              const option =
                options.find((option) => option.key === value) ??
                new OptionEntity();

              qb[method](
                `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') = :optionId`,
                { optionId: option.key },
              );
            } else if (format === FieldFormatEnum.multiSelect) {
              const condition = query.condition;
              const values = value as string[];

              if (condition === QueryV2ConditionsEnum.IS) {
                qb[method](
                  `JSON_LENGTH(JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"')) = :arrayLength${paramName} AND JSON_CONTAINS(
                    (SELECT JSON_ARRAYAGG(jt.value) FROM JSON_TABLE(
                      JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"'),
                      '$[*]' COLUMNS(value VARCHAR(255) PATH '$')
                    ) AS jt),
                    JSON_ARRAY(${values.map((optionKey) => `'${optionKey}'`).join(', ')}),
                    '$'
                  )`,
                  { [`arrayLength${paramName}`]: values.length },
                );
              } else if (condition === QueryV2ConditionsEnum.CONTAINS) {
                if (values.length > 0) {
                  qb[method](
                    `JSON_LENGTH(JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"')) >= :arrayLength${paramName} AND JSON_CONTAINS(
                      (SELECT JSON_ARRAYAGG(jt.value) FROM JSON_TABLE(
                        JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"'),
                        '$[*]' COLUMNS(value VARCHAR(255) PATH '$')
                      ) AS jt),
                      JSON_ARRAY(${values.map((optionKey) => `'${optionKey}'`).join(', ')}),
                      '$'
                    )`,
                    { [`arrayLength${paramName}`]: values.length },
                  );
                } else {
                  qb[method]('1 = 0');
                }
              }
            } else if (format === FieldFormatEnum.aiField) {
              const jsonExtractExpression = `JSON_EXTRACT(JSON_UNQUOTE(JSON_EXTRACT(feedbacks.data, '$.${fieldKey}')), '$.message')`;
              qb[method](`${jsonExtractExpression} like :${paramName}`, {
                [paramName]: `%${value as string}%`,
              });
            } else if (format === FieldFormatEnum.text) {
              qb[method](
                `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') like :${paramName}`,
                { [paramName]: `%${value as string | number}%` },
              );
            } else if (format === FieldFormatEnum.date) {
              const { gte, lt } = value as TimeRange;
              qb[method](
                `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') >= :gte${paramName}`,
                { [paramName]: gte },
              );
              qb[method](
                `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') < :lt${paramName}`,
                { [paramName]: lt },
              );
            } else {
              qb[method](
                `JSON_EXTRACT(feedbacks.data, '$."${fieldKey}"') = :${paramName}`,
                {
                  [paramName]: value,
                },
              );
            }
          }
        }
      }),
    );

    queryBuilder.groupBy('feedbacks.id');

    if (Object.keys(sort).length === 0) {
      sort.id = SortMethodEnum.DESC;
    }
    Object.keys(sort).map((fieldName) => {
      if (isInvalidSortMethod(sort[fieldName])) {
        throw new BadRequestException('invalid sort method');
      }

      if (fieldName === 'id') {
        queryBuilder.addOrderBy('id', sort[fieldName]);
      } else if (fieldName === 'createdAt') {
        queryBuilder.addOrderBy('created_at', sort[fieldName]);
      } else if (fieldName === 'updatedAt') {
        queryBuilder.addOrderBy('updated_at', sort[fieldName]);
      } else {
        queryBuilder.addOrderBy(fieldName, sort[fieldName]);
      }
    });

    const items = await queryBuilder
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    const total = await queryBuilder.getCount();

    const feedbacks = items.map((item) => {
      return {
        ...item.data,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return {
      items: feedbacks,
      meta: {
        itemCount: feedbacks.length,
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Transactional()
  async updateFeedback(dto: UpdateFeedbackMySQLDto) {
    const { feedbackId, data } = dto;

    let query = `JSON_SET(IFNULL(feedbacks.data,'{}'), `;
    const parameters: Record<string, any> = {};

    if (Object.keys(data).length === 0) {
      query = 'data';
    } else {
      Object.entries(data).forEach(([fieldKey, value], index) => {
        query += `'$.${fieldKey}', `;
        if (Array.isArray(value)) {
          const arrayParams = value
            .map((v, i) => {
              const paramName = `value${index}_${i}`;
              parameters[paramName] = v as string | number;
              return `:${paramName}`;
            })
            .join(', ');
          query += `JSON_ARRAY(${arrayParams})`;
        } else {
          const paramName = `value${index}`;
          parameters[paramName] = value as string | number;
          query += `:${paramName}`;
        }

        if (index + 1 !== Object.entries(data).length) {
          query += ', ';
        }
      });

      query += ')';
    }

    await this.feedbackRepository
      .createQueryBuilder('feedbacks')
      .update('feedbacks')
      .set({
        data: () => query,
        updatedAt: () => `'${DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss')}'`,
      })
      .where('id = :feedbackId', { feedbackId })
      .setParameters(parameters)
      .execute();
  }

  @Transactional()
  async addIssue(dto: AddIssueDto) {
    try {
      const { issueId, feedbackId, channelId } = dto;

      const feedback =
        (await this.feedbackRepository.findOne({
          relations: { issues: true },
          where: { id: feedbackId, channel: { id: channelId } },
        })) ?? new FeedbackEntity();

      const issue = new IssueEntity();
      issue.id = issueId;

      feedback.issues.push(issue);

      this.cls.set('addIssueInFeedback', { feedbackId, issueId });

      await this.feedbackRepository.save({
        ...feedback,
        updatedAt: DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss'),
      });

      await this.issueRepository.update(dto.issueId, {
        feedbackCount: () => 'feedback_count + 1',
        updatedAt: () => `'${DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss')}'`,
      });

      await this.feedbackIssueStatisticsService.updateFeedbackCount({
        issueId: dto.issueId,
        date: feedback.createdAt,
        feedbackCount: 1,
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (
          (e.driverError as QueryFailedDriverError).code ===
          'ER_NO_REFERENCED_ROW_2'
        ) {
          throw new BadRequestException('unknown id');
        } else if (
          (e.driverError as QueryFailedDriverError).code === 'ER_DUP_ENTRY'
        ) {
          throw new BadRequestException('already issueed');
        } else {
          this.logger.error(e);
          throw new BadRequestException('query Error');
        }
      } else {
        throw e;
      }
    }
  }

  @Transactional()
  async removeIssue(dto: RemoveIssueDto) {
    try {
      const { channelId, issueId, feedbackId } = dto;

      const feedback =
        (await this.feedbackRepository.findOne({
          relations: { issues: true },
          where: { id: feedbackId, channel: { id: channelId } },
        })) ?? new FeedbackEntity();
      feedback.issues = feedback.issues.filter((issue) => issue.id !== issueId);
      this.cls.set('removeIssueInFeedback', { feedbackId, issueId });

      await this.feedbackRepository.save({
        ...feedback,
        updatedAt: DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss'),
      });

      await this.issueRepository.update(dto.issueId, {
        feedbackCount: () => 'feedback_count - 1',
        updatedAt: () => `'${DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss')}'`,
      });

      await this.feedbackIssueStatisticsService.updateFeedbackCount({
        issueId,
        date: feedback.createdAt,
        feedbackCount: -1,
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        this.logger.error(e);
        throw new BadRequestException('query Error');
      }
      throw e;
    }
  }

  async countByProjectId({ projectId }: CountByProjectIdDto) {
    return await this.feedbackRepository.count({
      relations: ['channel', 'channel.project'],
      where: { channel: { project: { id: projectId } } },
    });
  }

  @Transactional()
  async deleteByIds({ channelId, feedbackIds }: DeleteByIdsDto) {
    const feedbacks = await this.feedbackRepository.find({
      where: { id: In(feedbackIds) },
      relations: { issues: true },
    });

    for (const feedback of feedbacks) {
      for (const issue of feedback.issues) {
        await this.issueRepository.update(issue.id, {
          feedbackCount: () => 'feedback_count - 1',
          updatedAt: () =>
            `'${DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss')}'`,
        });
      }

      await this.feedbackStatisticsService.updateCount({
        channelId,
        date: feedback.createdAt,
        count: -1,
      });
    }

    await this.feedbackRepository.remove(feedbacks);
  }

  async findById({ feedbackId }: { feedbackId: number }) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId },
      relations: ['issues'],
    });
    if (!feedback) {
      throw new BadRequestException('unknown id');
    }
    return {
      ...feedback.data,
      id: feedback.id,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      issues: feedback.issues,
    };
  }
}
