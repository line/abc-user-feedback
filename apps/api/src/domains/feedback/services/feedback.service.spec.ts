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
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import { DataSource, Repository } from 'typeorm';

import { createFieldDto, getRandomValue } from '@/utils/test-util-fixture';
import {
  TestConfigs,
  clearEntities,
  getMockProvider,
} from '@/utils/test-utils';

import { FieldEntity } from '../entities/field.entity';
import { ElasticsearchRepository } from '../repositories';
import {
  CreateFeedbackDto,
  FieldTypeEnum,
  FindFeedbacksByChannelIdDto,
} from './dtos';
import { FeedbackService } from './feedback.service';
import { FieldService } from './field.service';

describe('Feedback Integration Test', () => {
  let feedbackService: FeedbackService;

  let dataSource: DataSource;
  let fieldRepo: Repository<FieldEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...TestConfigs, TypeOrmModule.forFeature([FieldEntity])],
      providers: [
        FeedbackService,
        getMockProvider(FieldService, MockFieldService),
        getMockProvider(ElasticsearchRepository, MockElasticsearchRepository),
      ],
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    dataSource = module.get(DataSource);

    fieldRepo = dataSource.getRepository(FieldEntity);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  let fields: FieldEntity[];
  beforeEach(async () => {
    await clearEntities([fieldRepo]);
    const length = faker.datatype.number({ min: 1, max: 3 });
    fields = await fieldRepo.save(
      []
        .concat(
          Array.from({ length }).map(() =>
            createFieldDto({ isAdmin: true, isDisabled: true }),
          ),
        )
        .concat(
          Array.from({ length }).map(() =>
            createFieldDto({ isAdmin: false, isDisabled: true }),
          ),
        )
        .concat(
          Array.from({ length }).map(() =>
            createFieldDto({ isAdmin: true, isDisabled: false }),
          ),
        )
        .concat(
          Array.from({ length }).map(() =>
            createFieldDto({ isAdmin: false, isDisabled: false }),
          ),
        ),
    );
  });

  describe('create feedback', () => {
    it('postive case', async () => {
      MockDate.set(new Date());
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.uuid();
      dto.data = fields
        .filter((v) => !v.isAdmin && !v.isDisabled)
        .reduce(
          (prev, curr) =>
            Object.assign(prev, {
              [curr.name]: getRandomValue(curr.type, curr.options),
            }),
          {},
        );

      await feedbackService.create(dto);

      expect(MockFieldService.findByChannelId).toBeCalledTimes(1);
      expect(MockFieldService.findByChannelId).toBeCalledWith({
        channelId: dto.channelId,
      });
      expect(MockElasticsearchRepository.createData).toBeCalledTimes(1);
      expect(MockElasticsearchRepository.createData).toBeCalledWith({
        index: dto.channelId,
        data: {
          ...transferDataOptionId(dto.data, fields),
          undefined: dayjs().toISOString(),
        },
      });
    });
    it('Invalid data by field name', async () => {
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.uuid();
      dto.data = fields
        .filter((v) => !v.isAdmin && !v.isDisabled)
        .reduce(
          (prev, curr) =>
            Object.assign(prev, {
              [curr.name]: getRandomValue(curr.type, curr.options),
            }),
          {},
        );
      dto.data[faker.datatype.string()] = faker.datatype.string();

      await expect(feedbackService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockElasticsearchRepository.createData).toBeCalledTimes(0);
    });
    it('Invalid data by field type', async () => {
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.uuid();
      dto.data = fields
        .filter((v) => !v.isAdmin && !v.isDisabled)
        .reduce(
          (prev, curr) =>
            Object.assign(prev, {
              [curr.name]: getWrongRandomValue(curr.type),
            }),
          {},
        );

      await expect(feedbackService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockElasticsearchRepository.createData).toBeCalledTimes(0);
    });
    it('Invalid data by field is admin', async () => {
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.uuid();
      dto.data = fields
        .filter((v) => !v.isDisabled)
        .reduce(
          (prev, curr) =>
            Object.assign(prev, {
              [curr.name]: getWrongRandomValue(curr.type),
            }),
          {},
        );
      await expect(feedbackService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockElasticsearchRepository.createData).toBeCalledTimes(0);
    });

    it('Invalid data by field is disabled', async () => {
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.uuid();
      dto.data = fields
        .filter((v) => !v.isAdmin)
        .reduce(
          (prev, curr) =>
            Object.assign(prev, {
              [curr.name]: getWrongRandomValue(curr.type),
            }),
          {},
        );

      await expect(feedbackService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockElasticsearchRepository.createData).toBeCalledTimes(0);
    });
  });

  describe('findByChannelId', () => {
    let fields: FieldEntity[];
    beforeEach(async () => {
      await clearEntities([fieldRepo]);
      const fieldCount = faker.datatype.number({ min: 1, max: 10 });
      fields = await fieldRepo.save(
        Array.from({ length: fieldCount }).map(() =>
          createFieldDto({ isAdmin: false, isDisabled: false }),
        ),
      );
    });
    it('', async () => {
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const dto = new FindFeedbacksByChannelIdDto();
      dto.channelId = faker.datatype.uuid();
      dto.limit = faker.datatype.number({ min: 1, max: 100 });
      dto.page = faker.datatype.number();
      dto.startDate = faker.datatype.datetime();
      dto.endDate = faker.datatype.datetime({ min: dto.startDate.getTime() });

      const dataCount = faker.datatype.number({ max: dto.limit });
      const dataset = Array.from({ length: dataCount }).map(() =>
        fields.reduce(
          (prev, curr) =>
            Object.assign(prev, {
              [curr.id]: getRandomValue2(curr.type, curr.options),
            }),
          {},
        ),
      );

      jest
        .spyOn(MockElasticsearchRepository, 'getData')
        .mockResolvedValue(dataset);
      jest.spyOn(MockFieldService, 'findByChannelId').mockResolvedValue(fields);

      const res = await feedbackService.findByChannelId(dto);
      expect(res).toHaveLength(dataCount);
    });
  });
  describe('upsertFeedbackItem', () => {
    let field: FieldEntity;
    beforeAll(() => {
      field = fieldRepo.create(
        createFieldDto({ isAdmin: false, isDisabled: false }),
      );
    });
    it('', async () => {
      jest.spyOn(MockFieldService, 'findById').mockResolvedValue(field);

      await feedbackService.upsertFeedbackItem({
        channelId: faker.datatype.uuid(),
        feedbackId: faker.datatype.uuid(),
        fieldId: faker.datatype.uuid(),
        value: getRandomValue(field.type, field.options),
      });
      expect(MockElasticsearchRepository.updateData).toBeCalledTimes(1);
    });
  });
});

const MockFieldService = {
  findByChannelId: jest.fn(),
  findById: jest.fn(),
};
const MockElasticsearchRepository = {
  createData: jest.fn(),
  getData: jest.fn(),
  updateData: jest.fn(),
};

const getRandomValue2 = (
  type: FieldTypeEnum,
  options?: { id: string; name: string }[],
) => {
  switch (type) {
    case FieldTypeEnum.boolean:
      return faker.datatype.boolean();
    case FieldTypeEnum.date:
      return faker.datatype.datetime();
    case FieldTypeEnum.number:
      return faker.datatype.number();
    case FieldTypeEnum.select:
      return options.length === 0
        ? undefined
        : options[faker.datatype.number({ min: 0, max: options.length - 1 })]
            .id;
    case FieldTypeEnum.text:
      return faker.datatype.string();
    case FieldTypeEnum.keyword:
      return faker.datatype.string();
    default:
      throw new Error('Invalid field type ');
  }
};

const getWrongRandomValue = (type: FieldTypeEnum) => {
  switch (type) {
    case FieldTypeEnum.boolean:
    case FieldTypeEnum.date:
    case FieldTypeEnum.number:
      return faker.datatype.string();
    case FieldTypeEnum.select:
    case FieldTypeEnum.text:
      return faker.datatype.boolean();
    case FieldTypeEnum.keyword:
      return faker.datatype.string();
    default:
      throw new Error('Invalid field type ');
  }
};

const transferDataOptionId = (
  data: Record<string, any>,
  fields: FieldEntity[],
) => {
  const result: Record<string, any> = {};
  for (const fieldName of Object.keys(data)) {
    const value = data[fieldName];
    const field = fields.find((v) => v.name === fieldName);

    result[field.id] =
      field.type === FieldTypeEnum.select
        ? field.options.find((v) => v.name === value)?.id
        : value;
  }
  return result;
};
