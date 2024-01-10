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
import type { Repository } from 'typeorm';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '@/common/enums';
import {
  createFieldDto,
  feedbackFixture,
  fieldsFixture,
} from '@/test-utils/fixtures';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { FeedbackServiceProviders } from '../../../test-utils/providers/feedback.service.providers';
import { ChannelEntity } from '../channel/channel/channel.entity';
import { RESERVED_FIELD_KEYS } from '../channel/field/field.constants';
import { FieldEntity } from '../channel/field/field.entity';
import { IssueEntity } from '../project/issue/issue.entity';
import { ProjectEntity } from '../project/project/project.entity';
import { FeedbackIssueStatisticsEntity } from '../statistics/feedback-issue/feedback-issue-statistics.entity';
import { FeedbackStatisticsEntity } from '../statistics/feedback/feedback-statistics.entity';
import { IssueStatisticsEntity } from '../statistics/issue/issue-statistics.entity';
import { CreateFeedbackDto } from './dtos';
import { FeedbackService } from './feedback.service';

describe('FeedbackService Test Suite', () => {
  let feedbackService: FeedbackService;
  let clsService: ClsService;
  let fieldRepo: Repository<FieldEntity>;
  let issueRepo: Repository<IssueEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let feedbackStatsRepo: Repository<FeedbackStatisticsEntity>;
  let issueStatsRepo: Repository<IssueStatisticsEntity>;
  let feedbackIssueStatsRepo: Repository<FeedbackIssueStatisticsEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: FeedbackServiceProviders,
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    clsService = module.get<ClsService>(ClsService);
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    feedbackStatsRepo = module.get(
      getRepositoryToken(FeedbackStatisticsEntity),
    );
    issueStatsRepo = module.get(getRepositoryToken(IssueStatisticsEntity));
    feedbackIssueStatsRepo = module.get(
      getRepositoryToken(FeedbackIssueStatisticsEntity),
    );
  });

  describe('create', () => {
    it('creating a feedback succeeds with valid inputs', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
    });
    it('creating a feedback fails with an invalid channel', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      jest.spyOn(fieldRepo, 'find').mockResolvedValue([]);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('invalid channel'),
      );
    });
    it('creating a feedback fails with a reserved field key', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const reservedFieldKey = faker.helpers.arrayElement(RESERVED_FIELD_KEYS);
      dto.data[reservedFieldKey] = faker.string.sample();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException(
          'reserved field key is unavailable: ' + reservedFieldKey,
        ),
      );
    });
    it('creating a feedback fails with an invalid field key', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const invalidFieldKey = 'invalidFieldKey';
      dto.data[invalidFieldKey] = faker.string.sample();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('invalid field key: ' + invalidFieldKey),
      );
    });
    it('creating a feedback fails with an admin field', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const adminFieldKey = 'adminFieldKey';
      dto.data[adminFieldKey] = faker.string.sample();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue([
        ...fieldsFixture,
        createFieldDto({
          key: adminFieldKey,
          type: FieldTypeEnum.ADMIN,
        }) as FieldEntity,
      ]);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('this field is for admin: ' + adminFieldKey),
      );
    });
    it('creating a feedback fails with an inactive field', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const inactiveFieldKey = 'inactiveFieldKey';
      dto.data[inactiveFieldKey] = faker.string.sample();
      jest.spyOn(fieldRepo, 'find').mockResolvedValue([
        ...fieldsFixture,
        createFieldDto({
          key: inactiveFieldKey,
          type: FieldTypeEnum.API,
          status: FieldStatusEnum.INACTIVE,
        }) as FieldEntity,
      ]);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('this field is inactive: ' + inactiveFieldKey),
      );
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
        {
          format: FieldFormatEnum.image,
          invalidValues: [123, true, {}, [], new Date()],
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
          dto.channelId = faker.number.int();
          dto.data = {
            [field.key]: invalidValue,
          };
          const spy = jest
            .spyOn(fieldRepo, 'find')
            .mockResolvedValue([field] as FieldEntity[]);

          await expect(feedbackService.create(dto)).rejects.toThrow(
            new BadRequestException(
              `invalid value: (value: ${JSON.stringify(
                dto.data[field.key],
              )}, type: ${field.format}, fieldKey: ${field.key})`,
            ),
          );

          spy.mockClear();
        }
      }
    });
    it('creating a feedback succeeds with valid inputs and issue names', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const issueNames = Array.from({
        length: faker.number.int({ min: 1, max: 1 }),
      }).map(() => faker.string.sample());
      dto.data.issueNames = [...issueNames, faker.string.sample()];
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce({
        id: faker.number.int(),
        name: issueNames[0],
      } as IssueEntity);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue({
        id: dto.channelId,
        fields: [],
        project: {
          id: faker.number.int(),
        },
      } as ChannelEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        id: faker.number.int(),
        project: {
          id: faker.number.int(),
        },
      } as IssueEntity);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      clsService.set = jest.fn();

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(issueRepo.findOneBy).toBeCalledTimes(3);
      expect(channelRepo.findOne).toBeCalledTimes(1);
      expect(issueRepo.save).toBeCalledTimes(1);
    });
    it('creating a feedback succeeds with valid inputs and an existent issue name', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      const issueNames = Array.from({
        length: faker.number.int({ min: 1, max: 1 }),
      }).map(() => faker.string.sample());
      dto.data.issueNames = [...issueNames];
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce({
        id: faker.number.int(),
        name: issueNames[0],
      } as IssueEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      clsService.set = jest.fn();

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
      expect(fieldRepo.find).toBeCalledTimes(1);
      expect(issueRepo.findOneBy).toBeCalledTimes(1);
    });
    it('creating a feedback succeeds with valid inputs and a nonexistent issue name', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackFixture));
      dto.data.issueNames = [faker.string.sample()];
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue({
        id: faker.number.int(),
        timezone: {
          offset: '+09:00',
        },
      } as ProjectEntity);
      jest.spyOn(fieldRepo, 'find').mockResolvedValue(fieldsFixture);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue({
        id: dto.channelId,
        fields: [],
        project: {
          id: faker.number.int(),
        },
      } as ChannelEntity);
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        id: faker.number.int(),
        project: {
          id: faker.number.int(),
        },
      } as IssueEntity);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      clsService.set = jest.fn();

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
      expect(issueRepo.findOneBy).toBeCalledTimes(2);
      expect(channelRepo.findOne).toBeCalledTimes(1);
      expect(issueRepo.save).toBeCalledTimes(1);
    });
  });
});
