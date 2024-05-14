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
import type { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';

import type { TimeRange } from '@/common/dtos';
import { FieldFormatEnum, SortMethodEnum } from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import type { FieldEntity } from '../channel/field/field.entity';
import type {
  CreateFeedbackOSDto,
  DeleteByIdsDto,
  FindFeedbacksByChannelIdDto,
  ScrollFeedbacksDto,
  UpdateFeedbackESDto,
} from './dtos';
import type { OsQueryDto } from './dtos/os-query.dto';
import type { Feedback } from './dtos/responses/find-feedbacks-by-channel-id-response.dto';
import { isInvalidSortMethod } from './feedback.common';
import { FeedbackEntity } from './feedback.entity';

@Injectable()
export class FeedbackOSService {
  private logger = new Logger(FeedbackOSService.name);
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    private readonly osRepository: OpensearchRepository,
  ) {}

  private async issueIdsToFeedbackIds(issueIds: number[]) {
    const feedbacks = await this.feedbackRepository.find({
      relations: {
        issues: true,
      },
      where: {
        issues: { id: In(issueIds) },
      },
    });

    return feedbacks.map((feedback) => feedback.id);
  }

  private isUnsortableFormat(format: FieldFormatEnum) {
    return ![FieldFormatEnum.date, FieldFormatEnum.number].includes(format);
  }

  private getMultiFieldQuery(
    query: any,
    fields: FieldEntity[],
    fieldFormats: FieldFormatEnum[],
  ) {
    return {
      bool: {
        should: fields.reduce((prev, field) => {
          if (fieldFormats.includes(field.format)) {
            prev.push({
              match_phrase: {
                [field.id]: query,
              },
            });
          }
          return prev;
        }, []),
      },
    };
  }

  private osQueryBulider(
    query: FindFeedbacksByChannelIdDto['query'],
    sort: FindFeedbacksByChannelIdDto['sort'] = {},
    fields: FieldEntity[],
  ): { query: OsQueryDto; sort: string[] } {
    const fieldsByKey = fields.reduce(
      (fields: Record<string, FieldEntity>, field) => {
        fields[field.key] = field;
        return fields;
      },
      {},
    );

    return {
      query:
        query ?
          Object.keys(query).reduce(
            (osQuery, fieldKey) => {
              if (fieldKey === 'ids') {
                osQuery.bool.must.push({
                  ids: {
                    values: query[fieldKey].map((id) => id.toString()),
                  },
                });

                return osQuery;
              }

              if (fieldKey === 'searchText') {
                if (typeof query[fieldKey] === 'string') {
                  osQuery.bool.must.push(
                    this.getMultiFieldQuery(query[fieldKey], fields, [
                      FieldFormatEnum.text,
                      FieldFormatEnum.keyword,
                    ]),
                  );
                } else if (typeof query[fieldKey] === 'number') {
                  osQuery.bool.must.push({
                    bool: {
                      should: [
                        this.getMultiFieldQuery(query[fieldKey], fields, [
                          FieldFormatEnum.number,
                        ]),
                        this.getMultiFieldQuery(
                          query[fieldKey].toString(),
                          fields,
                          [FieldFormatEnum.text, FieldFormatEnum.keyword],
                        ),
                      ],
                    },
                  });
                }

                return osQuery;
              }

              if (
                !Object.prototype.hasOwnProperty.call(fieldsByKey, fieldKey)
              ) {
                throw new BadRequestException('bad key in query');
              }

              const { format, key, options } = fieldsByKey[fieldKey];

              if (format === FieldFormatEnum.select) {
                osQuery.bool.must.push({
                  match_phrase: {
                    [key]: options.find(
                      (option) => option.key === query[fieldKey],
                    ).key,
                  },
                });
              } else if (format === FieldFormatEnum.multiSelect) {
                for (const value of query[fieldKey] as string[]) {
                  osQuery.bool.must.push({
                    match_phrase: {
                      [key]: options.find((option) => option.key === value).key,
                    },
                  });
                }
              } else if (format === FieldFormatEnum.date) {
                osQuery.bool.must.push({
                  range: {
                    [key]: query[fieldKey] as TimeRange,
                  },
                });
              } else if (
                [FieldFormatEnum.text, FieldFormatEnum.images].includes(format)
              ) {
                osQuery.bool.must.push({
                  match_phrase: {
                    [key]: query[fieldKey] as string,
                  },
                });
              } else {
                osQuery.bool.must.push({
                  term: {
                    [key]: query[fieldKey] as string,
                  },
                });
              }

              return osQuery;
            },
            { bool: { must: [] } },
          )
        : { bool: { must: [] } },
      sort:
        Object.keys(sort).length !== 0 ?
          Object.keys(sort).map((fieldKey) => {
            if (!Object.prototype.hasOwnProperty.call(fieldsByKey, fieldKey)) {
              throw new BadRequestException('bad key in sort');
            }
            const { key, format } = fieldsByKey[fieldKey];
            if (this.isUnsortableFormat(format)) {
              throw new BadRequestException('unsortable format', format);
            }
            if (isInvalidSortMethod(sort[fieldKey])) {
              throw new BadRequestException('invalid sort method');
            }

            const sortMethod =
              sort[fieldKey] === SortMethodEnum.ASC ? 'asc' : 'desc';
            return key + ':' + sortMethod;
          })
        : ['id:desc'],
    };
  }

  async create({ channelId, feedback }: CreateFeedbackOSDto) {
    const osFeedbackData = {
      ...feedback.data,
      id: feedback.id,
      createdAt: feedback.createdAt,
      updatedAt: DateTime.utc().toISO(),
    };

    return await this.osRepository.createData({
      id: feedback.id.toString(),
      index: channelId.toString(),
      data: osFeedbackData,
    });
  }

  async findByChannelId(
    dto: FindFeedbacksByChannelIdDto,
  ): Promise<Pagination<Feedback, IPaginationMeta>> {
    const { channelId, limit, page, query, sort, fields } = dto;

    if (query && query.issueIds) {
      const feedbackIds = await this.issueIdsToFeedbackIds(
        query.issueIds as number[],
      );

      delete query['issueIds'];
      if (query.ids) {
        query.ids = [...query.ids, ...feedbackIds];
      } else {
        query.ids = feedbackIds;
      }
    }

    const osQuery = this.osQueryBulider(query, sort, fields);
    this.logger.log(osQuery);

    const { items, total } = await this.osRepository.getData({
      index: channelId.toString(),
      limit,
      page,
      ...osQuery,
    });

    const totalItems = await this.osRepository.getTotal(
      channelId.toString(),
      osQuery.query,
    );

    return {
      items,
      meta: {
        itemCount: items.length,
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async scroll(dto: ScrollFeedbacksDto) {
    const {
      channelId,
      size,
      query,
      sort,
      fields,
      scrollId: currentScrollId,
    } = dto;

    if (query && query.issueIds) {
      const feedbackIds = await this.issueIdsToFeedbackIds(
        query.issueIds as number[],
      );

      delete query['issueIds'];
      if (query.ids) query.ids = [...query.ids, ...feedbackIds];
      else query.ids = feedbackIds;
    }

    const osQuery = this.osQueryBulider(query, sort, fields);
    this.logger.log(osQuery);
    return await this.osRepository.scroll({
      index: channelId.toString(),
      size,
      scrollId: currentScrollId,
      ...osQuery,
    });
  }

  async upsertFeedbackItem(dto: UpdateFeedbackESDto) {
    const { feedbackId, data, channelId } = dto;
    data.updatedAt = DateTime.utc().toISO();
    await this.osRepository.updateData({
      id: feedbackId.toString(),
      index: channelId.toString(),
      data,
    });
  }

  async deleteByIds({ channelId, feedbackIds }: DeleteByIdsDto) {
    await this.osRepository.deleteBulkData({
      index: channelId.toString(),
      ids: feedbackIds,
    });
  }

  async findById({ channelId, feedbackId }: { channelId: number; feedbackId }) {
    return await this.osRepository.getData({
      index: channelId.toString(),
      query: {
        bool: {
          must: [
            {
              ids: {
                values: [feedbackId.toString()],
              },
            },
          ],
        },
      },
      sort: ['id:desc'],
      page: 1,
      limit: 1,
    });
  }
}
