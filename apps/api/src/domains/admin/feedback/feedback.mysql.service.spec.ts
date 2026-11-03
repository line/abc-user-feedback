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
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { Brackets } from 'typeorm';

import {
  FieldFormatEnum,
  QueryV2ConditionsEnum,
  SortMethodEnum,
} from '@/common/enums';
import { createFieldDto } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { FeedbackServiceProviders } from '../../../test-utils/providers/feedback.service.providers';
import type { FieldEntity } from '../channel/field/field.entity';
import { OptionEntity } from '../channel/option/option.entity';
import type { FindFeedbacksByChannelIdDtoV2 } from './dtos/find-feedbacks-by-channel-id-v2.dto';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackMySQLService } from './feedback.mysql.service';

type Where = [condition: unknown, params?: Record<string, unknown>];

const createRecordingQueryBuilder = () => {
  const wheres: Where[] = [];
  const orderBys: unknown[][] = [];
  const qb: Record<string, jest.Mock> = {};
  const record =
    (name: string) =>
    (condition: unknown, params?: Record<string, unknown>) => {
      if (condition instanceof Brackets) {
        condition.whereFactory(qb as unknown as SelectQueryBuilder<object>);
      } else if (name !== 'leftJoin') {
        wheres.push([condition, params]);
      }
      return qb;
    };
  for (const name of ['leftJoin', 'where', 'andWhere', 'orWhere']) {
    qb[name] = jest.fn(record(name));
  }
  for (const name of ['select', 'groupBy', 'offset', 'limit']) {
    qb[name] = jest.fn(() => qb);
  }
  qb.addOrderBy = jest.fn((...args: unknown[]) => {
    orderBys.push(args);
    return qb;
  });
  qb.getMany = jest.fn().mockResolvedValue([]);
  qb.getCount = jest.fn().mockResolvedValue(0);
  return { qb, wheres, orderBys };
};

describe('FeedbackMySQLService query building', () => {
  let feedbackMySQLService: FeedbackMySQLService;
  let feedbackRepo: Repository<FeedbackEntity>;
  let optionRepo: Repository<OptionEntity>;

  const field = {
    ...createFieldDto(),
    key: 'tags',
    format: FieldFormatEnum.multiSelect,
  } as unknown as FieldEntity;

  const dto = (
    overrides: Partial<FindFeedbacksByChannelIdDtoV2>,
  ): FindFeedbacksByChannelIdDtoV2 =>
    ({
      channelId: 1,
      page: 1,
      limit: 10,
      operator: 'AND',
      queries: [],
      defaultQueries: [],
      sort: {},
      fields: [field],
      ...overrides,
    }) as FindFeedbacksByChannelIdDtoV2;

  beforeEach(async () => {
    jest.spyOn(ConfigService.prototype, 'get').mockImplementation(() => false);
    const module = await Test.createTestingModule({
      imports: [TestConfig, ClsModule.forFeature()],
      providers: FeedbackServiceProviders,
    }).compile();

    feedbackMySQLService = module.get(FeedbackMySQLService);
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
    optionRepo = module.get(getRepositoryToken(OptionEntity));
    jest.spyOn(optionRepo, 'find').mockResolvedValue([]);
  });

  it.each([QueryV2ConditionsEnum.IS, QueryV2ConditionsEnum.CONTAINS])(
    'binds multi-select values as a parameter (%s)',
    async (condition) => {
      const { qb, wheres } = createRecordingQueryBuilder();
      jest
        .spyOn(feedbackRepo, 'createQueryBuilder')
        .mockReturnValue(qb as unknown as SelectQueryBuilder<FeedbackEntity>);
      const values = ["a') OR 1=1 -- ", 'b'];

      await feedbackMySQLService.findByChannelIdV2(
        dto({ queries: [{ key: 'tags', value: values, condition }] }),
      );

      const multiSelect = wheres.find(
        ([sql]) => typeof sql === 'string' && sql.includes('JSON_CONTAINS'),
      );
      if (!multiSelect) throw new Error('multi-select condition not built');
      const [sql, params] = multiSelect;
      expect(sql).not.toContain('OR 1=1');
      expect(Object.values(params ?? {})).toContain(JSON.stringify(values));
    },
  );

  it('rejects sort keys that are not known columns', async () => {
    const { qb } = createRecordingQueryBuilder();
    jest
      .spyOn(feedbackRepo, 'createQueryBuilder')
      .mockReturnValue(qb as unknown as SelectQueryBuilder<FeedbackEntity>);

    await expect(
      feedbackMySQLService.findByChannelIdV2(
        dto({ sort: { '(SELECT SLEEP(5))': SortMethodEnum.ASC } }),
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('still sorts by createdAt', async () => {
    const { qb, orderBys } = createRecordingQueryBuilder();
    jest
      .spyOn(feedbackRepo, 'createQueryBuilder')
      .mockReturnValue(qb as unknown as SelectQueryBuilder<FeedbackEntity>);

    await feedbackMySQLService.findByChannelIdV2(
      dto({ sort: { createdAt: SortMethodEnum.DESC } }),
    );

    expect(orderBys).toEqual([['created_at', SortMethodEnum.DESC]]);
  });
});
