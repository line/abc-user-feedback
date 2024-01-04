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
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { ClsService } from 'nestjs-cls';
import type { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Brackets, QueryFailedError, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { TimeRange } from '@/common/dtos';
import { FieldFormatEnum, FieldTypeEnum, SortMethodEnum } from '@/common/enums';
import type { ClsServiceType } from '@/types/cls-service.type';
import { ChannelEntity } from '../channel/channel/channel.entity';
import type { FieldEntity } from '../channel/field/field.entity';
import { OptionEntity } from '../channel/option/option.entity';
import { IssueEntity } from '../project/issue/issue.entity';
import type {
  CountByProjectIdDto,
  DeleteByIdsDto,
  FindFeedbacksByChannelIdDto,
} from './dtos';
import {
  AddIssueDto,
  CreateFeedbackMySQLDto,
  RemoveIssueDto,
  UpdateFeedbackMySQLDto,
} from './dtos';
import type { Feedback } from './dtos/responses/find-feedbacks-by-channel-id-response.dto';
import { isInvalidSortMethod } from './feedback.common';
import { FeedbackEntity } from './feedback.entity';

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
  ) {}

  @Transactional()
  async create({ channelId, data }: CreateFeedbackMySQLDto) {
    const feedback = new FeedbackEntity();
    feedback.channel = new ChannelEntity();
    feedback.channel.id = channelId;
    feedback.rawData = data;
    return await this.feedbackRepository.save(feedback);
  }

  async findByChannelId(
    dto: FindFeedbacksByChannelIdDto,
  ): Promise<Pagination<Feedback, IPaginationMeta>> {
    const { page, limit, channelId, query = {}, sort = {}, fields } = dto;

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
        const stringFields = fields.reduce((prev, field) => {
          if (
            [FieldFormatEnum.keyword, FieldFormatEnum.text].includes(
              field.format,
            )
          ) {
            prev.push(field);
          }
          return prev;
        }, [] as FieldEntity[]);

        if (stringFields.length > 0) {
          queryBuilder.andWhere(
            new Brackets((qb) => {
              for (let i = 0; i < stringFields.length; i++) {
                const dataColumn =
                  stringFields[i].type === FieldTypeEnum.API
                    ? 'raw_data'
                    : 'additional_data';
                if (stringFields[i].format === FieldFormatEnum.keyword) {
                  if (i === 0) {
                    qb.where(
                      `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${stringFields[i].id}"') = :value`,
                      { value },
                    );
                  } else {
                    qb.orWhere(
                      `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${stringFields[i].id}"') = :value`,
                      { value },
                    );
                  }
                } else {
                  if (i === 0) {
                    qb.where(
                      `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${stringFields[i].id}"') like :likeValue`,
                      { likeValue: `%${value}%` },
                    );
                  } else {
                    qb.orWhere(
                      `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${stringFields[i].id}"') like :likeValue`,
                      { likeValue: `%${value}%` },
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
        const { id, format, type } = fields.find((v) => v.key === fieldKey);

        const dataColumn =
          type === FieldTypeEnum.API ? 'raw_data' : 'additional_data';

        if (format === FieldFormatEnum.select) {
          const options = await this.optionRepository.find({
            where: { field: { id } },
          });
          const option = options.find((option) => option.key === value);

          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${fieldKey}"') = :optionId`,
            { optionId: option.key },
          );
        } else if (format === FieldFormatEnum.multiSelect) {
          const options = await this.optionRepository.find({
            where: { field: { id } },
          });

          for (const optionKey of value as string[]) {
            const option = options.find((option) => option.key === optionKey);
            queryBuilder.andWhere(
              `JSON_CONTAINS(
                JSON_EXTRACT(feedbacks.${dataColumn}, '$."${fieldKey}"'),
                '"${option.key}"',
                '$')`,
            );
          }
        } else if (
          [FieldFormatEnum.text, FieldFormatEnum.images].includes(format)
        ) {
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${fieldKey}"') like :value`,
            { value: `%${value}%` },
          );
        } else if (format === FieldFormatEnum.date) {
          const { gte, lt } = value as TimeRange;
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${fieldKey}"') >= :gte`,
            { gte },
          );
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${fieldKey}"') < :lt`,
            { lt },
          );
        } else {
          queryBuilder.andWhere(
            `JSON_EXTRACT(feedbacks.${dataColumn}, '$."${fieldKey}"') = :value`,
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
      if (item.additionalData) {
        return {
          ...item.rawData,
          ...item.additionalData,
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      } else {
        return {
          ...item.rawData,
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      }
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

    await this.feedbackRepository
      .createQueryBuilder('feedbacks')
      .update('feedbacks')
      .set({
        additionalData: () => {
          let query = `JSON_SET(IFNULL(feedbacks.additional_data,'{}'), `;
          for (const [index, fieldKey] of Object.entries(Object.keys(data))) {
            query += `'$."${fieldKey}"', ${
              Array.isArray(data[fieldKey])
                ? data[fieldKey].length === 0
                  ? 'JSON_ARRAY()'
                  : 'JSON_ARRAY("' + data[fieldKey].join('","') + '")'
                : '"' + data[fieldKey] + '"'
            }`;

            if (parseInt(index) + 1 !== Object.entries(data).length) {
              query += ',';
            }
          }
          query += `)`;

          return query;
        },
        updatedAt: () => `'${DateTime.utc().toFormat('yyyy-MM-dd HH:mm:ss')}'`,
      })
      .where('id = :feedbackId', { feedbackId })
      .execute();
  }

  @Transactional()
  async addIssue(dto: AddIssueDto) {
    try {
      const { issueId, feedbackId, channelId } = dto;

      const feedback = await this.feedbackRepository.findOne({
        relations: { issues: true },
        where: { id: feedbackId, channel: { id: channelId } },
      });

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
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === 'ER_NO_REFERENCED_ROW_2') {
          throw new BadRequestException('unknown id');
        } else if (e.driverError.code === 'ER_DUP_ENTRY') {
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

      const feedback = await this.feedbackRepository.findOne({
        relations: { issues: true },
        where: { id: feedbackId, channel: { id: channelId } },
      });
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

  async deleteByIds({ feedbackIds }: DeleteByIdsDto) {
    const feedbacks = feedbackIds.map((id) => {
      const feedback = new FeedbackEntity();
      feedback.id = id;
      return feedback;
    });
    await this.feedbackRepository.remove(feedbacks);
  }
}
