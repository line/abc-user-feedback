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
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { createFieldDto, getRandomValue } from '@/utils/test-util-fixture';
import {
  MockOpensearchRepository,
  getMockProvider,
  mockRepository,
} from '@/utils/test-utils';

import { ChannelEntity } from '../channel/channel/channel.entity';
import { ChannelServiceProviders } from '../channel/channel/channel.service.spec';
import { RESERVED_FIELD_KEYS } from '../channel/field/field.constants';
import { FieldEntity } from '../channel/field/field.entity';
import { FieldServiceProviders } from '../channel/field/field.service.spec';
import { OptionServiceProviders } from '../channel/option/option.service.spec';
import { IssueEntity } from '../project/issue/issue.entity';
import { IssueServiceProviders } from '../project/issue/issue.service.spec';
import { CreateFeedbackDto, FindFeedbacksByChannelIdDto } from './dtos';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackMySQLService } from './feedback.mysql.service';
import { FeedbackOSService } from './feedback.os.service';
import { FeedbackService } from './feedback.service';

const FeedbackServiceProviders = [
  FeedbackService,
  FeedbackMySQLService,
  {
    provide: getRepositoryToken(FeedbackEntity),
    useValue: mockRepository(),
  },
  ClsService,
  ...FieldServiceProviders,
  ...IssueServiceProviders,
  ...OptionServiceProviders,
  ...ChannelServiceProviders,
  getMockProvider(OpensearchRepository, MockOpensearchRepository),
  FeedbackOSService,
];

const fieldsFixture = Object.values(FieldFormatEnum).flatMap((format) =>
  Object.values(FieldTypeEnum).flatMap((type) =>
    Object.values(FieldStatusEnum).flatMap((status) => ({
      id: faker.datatype.number(),
      ...createFieldDto({
        format,
        type,
        status,
      }),
    })),
  ),
) as FieldEntity[];
const feedbackFixture = fieldsFixture.reduce((prev, curr) => {
  if (curr.type === FieldTypeEnum.ADMIN) return prev;
  if (curr.status === FieldStatusEnum.INACTIVE) return prev;
  const value = getRandomValue(curr.format, curr.options);
  return {
    ...prev,
    [curr.key]: value,
  };
}, {});

describe('FeedbackService Test Suite', () => {
  let feedbackService: FeedbackService;
  let clsService: ClsService;
  let feedbackRepo: Repository<FeedbackEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let issueRepo: Repository<IssueEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let osRepo: OpensearchRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: FeedbackServiceProviders,
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    clsService = module.get<ClsService>(ClsService);
    feedbackRepo = module.get(getRepositoryToken(FeedbackEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    osRepo = module.get(OpensearchRepository);
  });

  describe('create', () => {
    it('creating a feedback succeeds with valid inputs', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
        rawData: dto.data,
      } as FeedbackEntity);

      await feedbackService.create(dto);

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(feedbackRepo.save).toBeCalledTimes(1);
      expect(feedbackRepo.save).toBeCalledWith({
        channel: {
          id: dto.channelId,
        },
        rawData: dto.data,
      });
      expect(MockOpensearchRepository.createData).toBeCalledTimes(1);
    });
    it('creating a feedback fails with an invalid channel', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      jest.spyOn(fieldRepo, 'find').mockResolvedValue([]);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
        rawData: dto.data,
      } as FeedbackEntity);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('invalid channel'),
      );

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(feedbackRepo.save).not.toBeCalled();
      expect(MockOpensearchRepository.createData).not.toBeCalled();
    });
    it('creating a feedback fails with a reserved field key', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const reservedFieldKey = faker.helpers.arrayElement(RESERVED_FIELD_KEYS);
      dto.data[reservedFieldKey] = faker.datatype.string();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
        rawData: dto.data,
      } as FeedbackEntity);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException(
          'reserved field key is unavailable: ' + reservedFieldKey,
        ),
      );

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(feedbackRepo.save).not.toBeCalled();
      expect(MockOpensearchRepository.createData).not.toBeCalled();
    });
    it('creating a feedback fails with an invalid field key', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const invalidFieldKey = 'invalidFieldKey';
      dto.data[invalidFieldKey] = faker.datatype.string();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
        rawData: dto.data,
      } as FeedbackEntity);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('invalid field key: ' + invalidFieldKey),
      );

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(feedbackRepo.save).not.toBeCalled();
      expect(MockOpensearchRepository.createData).not.toBeCalled();
    });
    it('creating a feedback fails with an admin field', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const adminFieldKey = 'adminFieldKey';
      dto.data[adminFieldKey] = faker.datatype.string();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue([
        ...fieldsFixture,
        createFieldDto({
          key: adminFieldKey,
          type: FieldTypeEnum.ADMIN,
        }) as FieldEntity,
      ]);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
        rawData: dto.data,
      } as FeedbackEntity);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('this field is for admin: ' + adminFieldKey),
      );

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(feedbackRepo.save).not.toBeCalled();
      expect(MockOpensearchRepository.createData).not.toBeCalled();
    });
    it('creating a feedback fails with an inactive field', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const inactiveFieldKey = 'inactiveFieldKey';
      dto.data[inactiveFieldKey] = faker.datatype.string();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue([
        ...fieldsFixture,
        createFieldDto({
          key: inactiveFieldKey,
          type: FieldTypeEnum.API,
          status: FieldStatusEnum.INACTIVE,
        }) as FieldEntity,
      ]);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
        rawData: dto.data,
      } as FeedbackEntity);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('this field is inactive: ' + inactiveFieldKey),
      );

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(feedbackRepo.save).not.toBeCalled();
      expect(MockOpensearchRepository.createData).not.toBeCalled();
    });
    it('creating a feedback fails with an invalid value for field type', async () => {
      const formats = [
        {
          format: FieldFormatEnum.text,
          invalidValues: [123, true, {}, [], new Date()],
        },
        {
          format: FieldFormatEnum.keyword,
          invalidValues: [123, true, {}, [], new Date()],
        },
        {
          format: FieldFormatEnum.number,
          invalidValues: ['not a number', true, {}, [], new Date()],
        },
        {
          format: FieldFormatEnum.boolean,
          invalidValues: ['not a boolean', 123, {}, [], new Date()],
        },
        {
          format: FieldFormatEnum.select,
          invalidValues: [['option1', 'option2'], 123, true, {}, new Date()],
        },
        {
          format: FieldFormatEnum.multiSelect,
          invalidValues: ['option1', 123, true, {}, new Date(), [{}]],
        },
        {
          format: FieldFormatEnum.date,
          invalidValues: ['not a date', 123, true, {}, []],
        },
      ];
      for (const { format, invalidValues } of formats) {
        for (const invalidValue of invalidValues) {
          const field = createFieldDto({
            format,
            type: FieldTypeEnum.API,
            status: FieldStatusEnum.ACTIVE,
          });
          const dto = new CreateFeedbackDto();
          dto.channelId = faker.datatype.number();
          dto.data = {
            [field.key]: invalidValue,
          };
          const spy = jest
            .spyOn(fieldRepo, 'find')
            .mockResolvedValue([field] as FieldEntity[]);
          jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
            id: faker.datatype.number(),
            rawData: dto.data,
          } as FeedbackEntity);

          await expect(feedbackService.create(dto)).rejects.toThrow(
            new BadRequestException(
              `invalid value: (value: ${JSON.stringify(
                dto.data[field.key],
              )}, type: ${field.format}, fieldKey: ${field.key})`,
            ),
          );

          expect(fieldRepo.find).toBeCalledTimes(1);
          expect(feedbackRepo.save).not.toBeCalled();
          expect(MockOpensearchRepository.createData).not.toBeCalled();
          spy.mockClear();
        }
      }
    });
    it('creating a feedback succeeds with valid inputs and issue names', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const issueNames = Array.from({
        length: faker.datatype.number({ min: 1, max: 1 }),
      }).map(() => faker.datatype.string());
      dto.data.issueNames = [...issueNames, faker.datatype.string()];
      const feedbackId = faker.datatype.number();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: feedbackId,
        rawData: dto.data,
      } as FeedbackEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce({
        id: faker.datatype.number(),
        name: issueNames[0],
      } as IssueEntity);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue({
        id: dto.channelId,
        fields: [],
        project: {
          id: faker.datatype.number(),
        },
      } as ChannelEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
      } as IssueEntity);
      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue({
        id: feedbackId,
        issues: [],
      } as FeedbackEntity);
      clsService.set = jest.fn();

      await feedbackService.create(dto);

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(issueRepo.findOneBy).toBeCalledTimes(3);
      expect(channelRepo.findOne).toBeCalledTimes(1);
      expect(feedbackRepo.save).toBeCalledTimes(3);
      expect(issueRepo.save).toBeCalledTimes(1);
      expect(MockOpensearchRepository.createData).toBeCalledTimes(1);
    });
    it('creating a feedback succeeds with valid inputs and an existent issue name', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const issueNames = Array.from({
        length: faker.datatype.number({ min: 1, max: 1 }),
      }).map(() => faker.datatype.string());
      dto.data.issueNames = [...issueNames];
      const feedbackId = faker.datatype.number();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: feedbackId,
        rawData: dto.data,
      } as FeedbackEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce({
        id: faker.datatype.number(),
        name: issueNames[0],
      } as IssueEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue({
        id: feedbackId,
        issues: [],
      } as FeedbackEntity);
      clsService.set = jest.fn();

      await feedbackService.create(dto);

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(issueRepo.findOneBy).toBeCalledTimes(1);
      expect(feedbackRepo.save).toBeCalledTimes(2);
      expect(MockOpensearchRepository.createData).toBeCalledTimes(1);
    });
    it('creating a feedback succeeds with valid inputs and a nonexistent issue name', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.datatype.number();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      dto.data.issueNames = [faker.datatype.string()];
      const feedbackId = faker.datatype.number();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(feedbackRepo, 'save').mockResolvedValue({
        id: feedbackId,
        rawData: dto.data,
      } as FeedbackEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue({
        id: dto.channelId,
        fields: [],
        project: {
          id: faker.datatype.number(),
        },
      } as ChannelEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        id: faker.datatype.number(),
      } as IssueEntity);
      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue({
        id: feedbackId,
        issues: [],
      } as FeedbackEntity);
      clsService.set = jest.fn();

      await feedbackService.create(dto);

      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(issueRepo.findOneBy).toBeCalledTimes(2);
      expect(channelRepo.findOne).toBeCalledTimes(1);
      expect(feedbackRepo.save).toBeCalledTimes(2);
      expect(issueRepo.save).toBeCalledTimes(1);
      expect(MockOpensearchRepository.createData).toBeCalledTimes(1);
    });
  });

  describe('findByChannelId', () => {
    describe('with os use', () => {
      it('finding feedbacks succeeds with valid inputs', async () => {
        const channelId = faker.datatype.number();
        const dto = new FindFeedbacksByChannelIdDto();
        dto.channelId = channelId;
        dto.limit = 10;
        dto.page = 1;
        jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
        jest.spyOn(osRepo, 'getData').mockResolvedValue({
          items: [],
          total: 0,
        });
        jest.spyOn(osRepo, 'getTotal').mockResolvedValue(0);

        await feedbackService.findByChannelId(dto);

        expect(fieldRepo.find).toBeCalledTimes(1);
        expect(osRepo.getData).toBeCalledTimes(1);
        expect(osRepo.getTotal).toBeCalledTimes(1);
      });
    });
  });
});
