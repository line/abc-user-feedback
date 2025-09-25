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
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsModule, ClsService } from 'nestjs-cls';
import type { Repository, SelectQueryBuilder } from 'typeorm';

import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
} from '@/common/enums';
import { createFieldDto, feedbackDataFixture } from '@/test-utils/fixtures';
import type { ChannelRepositoryStub } from '@/test-utils/stubs';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { FeedbackServiceProviders } from '../../../test-utils/providers/feedback.service.providers';
import { ChannelEntity } from '../channel/channel/channel.entity';
import { ChannelService } from '../channel/channel/channel.service';
import { RESERVED_FIELD_KEYS } from '../channel/field/field.constants';
import { FieldEntity } from '../channel/field/field.entity';
import { FieldService } from '../channel/field/field.service';
import { OptionService } from '../channel/option/option.service';
import { IssueEntity } from '../project/issue/issue.entity';
import { IssueService } from '../project/issue/issue.service';
import { ProjectService } from '../project/project/project.service';
import { FeedbackIssueStatisticsEntity } from '../statistics/feedback-issue/feedback-issue-statistics.entity';
import { FeedbackStatisticsEntity } from '../statistics/feedback/feedback-statistics.entity';
import { IssueStatisticsEntity } from '../statistics/issue/issue-statistics.entity';
import {
  AddIssueDto,
  CountByProjectIdDto,
  CreateFeedbackDto,
  DeleteByIdsDto,
  FindFeedbacksByChannelIdDto,
  GenerateExcelDto,
  RemoveIssueDto,
  UpdateFeedbackDto,
} from './dtos';
import type { FindFeedbacksByChannelIdDtoV2 } from './dtos/find-feedbacks-by-channel-id-v2.dto';
import { FeedbackMySQLService } from './feedback.mysql.service';
import { FeedbackOSService } from './feedback.os.service';
import { FeedbackService } from './feedback.service';

describe('FeedbackService Test Suite', () => {
  let feedbackService: FeedbackService;
  let clsService: ClsService;
  let fieldRepo: Repository<FieldEntity>;
  let issueRepo: Repository<IssueEntity>;
  let channelRepo: ChannelRepositoryStub;
  let feedbackStatsRepo: Repository<FeedbackStatisticsEntity>;
  let issueStatsRepo: Repository<IssueStatisticsEntity>;
  let feedbackIssueStatsRepo: Repository<FeedbackIssueStatisticsEntity>;
  let feedbackMySQLService: FeedbackMySQLService;
  let feedbackOSService: FeedbackOSService;
  let fieldService: FieldService;
  let issueService: IssueService;
  let _optionService: OptionService;
  let channelService: ChannelService;
  let projectService: ProjectService;
  let configService: ConfigService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      imports: [TestConfig, ClsModule.forFeature()],
      providers: FeedbackServiceProviders,
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    clsService = module.get<ClsService>(ClsService);
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    feedbackStatsRepo = module.get(
      getRepositoryToken(FeedbackStatisticsEntity),
    );
    issueStatsRepo = module.get(getRepositoryToken(IssueStatisticsEntity));
    feedbackIssueStatsRepo = module.get(
      getRepositoryToken(FeedbackIssueStatisticsEntity),
    );
    feedbackMySQLService =
      module.get<FeedbackMySQLService>(FeedbackMySQLService);
    feedbackOSService = module.get<FeedbackOSService>(FeedbackOSService);
    fieldService = module.get<FieldService>(FieldService);
    issueService = module.get<IssueService>(IssueService);
    _optionService = module.get<OptionService>(OptionService);
    channelService = module.get<ChannelService>(ChannelService);
    projectService = module.get<ProjectService>(ProjectService);
    configService = module.get<ConfigService>(ConfigService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('create', () => {
    beforeEach(() => {
      // Clear mocks for each test to ensure isolation
      jest.clearAllMocks();

      channelRepo.setImageConfig({
        domainWhiteList: ['example.com'],
      });
    });
    it('creating a feedback succeeds with valid inputs', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 }); // Limit range for stability
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;

      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
    });
    it('creating a feedback fails with an invalid channel', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;

      jest.spyOn(fieldRepo, 'find').mockResolvedValue([]);

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('invalid channel'),
      );
    });
    it('creating a feedback fails with a reserved field key', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;
      const reservedFieldKey = faker.helpers.arrayElement(
        RESERVED_FIELD_KEYS.filter((key) => key !== 'createdAt'),
      );
      dto.data[reservedFieldKey] = faker.string.sample();

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException(
          'reserved field key is unavailable: ' + reservedFieldKey,
        ),
      );
    });
    it('creating a feedback fails with an invalid field key', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int();
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;
      const invalidFieldKey = 'invalidFieldKey';
      dto.data[invalidFieldKey] = faker.string.sample();

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('invalid field key: ' + invalidFieldKey),
      );
    });
    it('creating a feedback fails with an invalid value for a field format', async () => {
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
          format: FieldFormatEnum.images,
          invalidValues: ['not images', 123, true, {}, new Date()],
        },
      ];
      for (const { format, invalidValues } of formats) {
        for (const invalidValue of invalidValues) {
          // Clear mocks for each test iteration
          jest.clearAllMocks();

          const field = createFieldDto({
            format,
            property: FieldPropertyEnum.EDITABLE,
            status: FieldStatusEnum.ACTIVE,
          });
          const dto = new CreateFeedbackDto();
          dto.channelId = faker.number.int({ min: 1, max: 1000 });
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

          spy.mockRestore(); // Use mockRestore instead of mockClear
        }
      }
    });
    it('creating a feedback succeeds with valid inputs and issue names', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;

      // Use stable test data
      const issueNames = ['test-issue-1', 'test-issue-2'];
      dto.data.issueNames = [...issueNames, 'additional-issue'];

      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
        );
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<FeedbackIssueStatisticsEntity>,
        );
      clsService.set = jest.fn();

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
    });
    it('creating a feedback succeeds with valid inputs and an existent issue name', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;

      // Use stable test data
      dto.data.issueNames = ['existing-issue-1', 'existing-issue-2'];

      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<FeedbackIssueStatisticsEntity>,
        );
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
        );
      clsService.set = jest.fn();

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
    });
    it('creating a feedback succeeds with valid inputs and a nonexistent issue name', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;

      // Use stable test data
      dto.data.issueNames = ['nonexistent-issue'];

      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(feedbackStatsRepo, 'findOne')
        .mockResolvedValue({ count: 1 } as FeedbackStatisticsEntity);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
        );
      jest
        .spyOn(feedbackIssueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<FeedbackIssueStatisticsEntity>,
        );
      clsService.set = jest.fn();

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
    });
    it('creating a feedback fails with invalid image domain', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });

      // Use stable test data
      const fieldKey = 'test-image-field';
      const field = createFieldDto({
        key: fieldKey,
        format: FieldFormatEnum.images,
        property: FieldPropertyEnum.EDITABLE,
        status: FieldStatusEnum.ACTIVE,
      });
      dto.data = { [fieldKey]: ['https://invalid-domain.com/image.jpg'] };

      jest.spyOn(fieldRepo, 'find').mockResolvedValue([field] as FieldEntity[]);
      channelRepo.setImageConfig({
        domainWhiteList: ['example.com'],
      });

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException(
          `invalid domain in image link: invalid-domain.com (fieldKey: ${fieldKey})`,
        ),
      );
    });
    it('creating a feedback fails with non-array issueNames', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });
      dto.data = JSON.parse(JSON.stringify(feedbackDataFixture)) as object;

      // Use stable test data
      dto.data.issueNames = 'not-an-array' as unknown as string[];

      await expect(feedbackService.create(dto)).rejects.toThrow(
        new BadRequestException('issueNames must be array'),
      );
    });
    it('creating a feedback succeeds with OpenSearch enabled', async () => {
      const dto = new CreateFeedbackDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });

      // Use stable test data
      const fieldKey = 'test-field';
      const field = createFieldDto({
        key: fieldKey,
        format: FieldFormatEnum.text,
      });
      dto.data = { [fieldKey]: 'test-value' };

      jest.spyOn(fieldRepo, 'find').mockResolvedValue([field] as FieldEntity[]);
      jest.spyOn(feedbackMySQLService, 'create').mockResolvedValue({
        id: faker.number.int({ min: 1, max: 1000 }),
      } as any);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return true;
        return false;
      });
      jest
        .spyOn(feedbackOSService, 'create')
        .mockResolvedValue({ id: faker.number.int({ min: 1, max: 1000 }) });
      jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

      const feedback = await feedbackService.create(dto);

      expect(feedback.id).toBeDefined();
      expect(eventEmitter.emit).toHaveBeenCalled();
    });
  });

  describe('findByChannelId', () => {
    it('should find feedbacks by channel id successfully', async () => {
      const channelId = faker.number.int({ min: 1, max: 1000 });
      const dto = new FindFeedbacksByChannelIdDto();
      dto.channelId = channelId;
      dto.query = {};

      const fields = [createFieldDto()];
      const mockFeedbacks = {
        items: [{ id: faker.number.int({ min: 1, max: 1000 }), data: {} }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);
      jest.spyOn(channelService, 'findById').mockResolvedValue({
        feedbackSearchMaxDays: 30,
        project: { id: faker.number.int({ min: 1, max: 1000 }) },
      } as unknown as any);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest
        .spyOn(feedbackMySQLService, 'findByChannelId')
        .mockResolvedValue(mockFeedbacks);
      jest.spyOn(issueService, 'findIssuesByFeedbackIds').mockResolvedValue({});

      const result = await feedbackService.findByChannelId(dto);

      expect(result).toEqual(mockFeedbacks);
      expect(fieldService.findByChannelId).toHaveBeenCalledWith({ channelId });
    });
    it('should throw error for invalid channel', async () => {
      const dto = new FindFeedbacksByChannelIdDto();
      dto.channelId = faker.number.int({ min: 1, max: 1000 });

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue([] as FieldEntity[]);

      await expect(feedbackService.findByChannelId(dto)).rejects.toThrow(
        new BadRequestException('invalid channel'),
      );
    });
    it('should handle fieldKey query parameter', async () => {
      const channelId = faker.number.int({ min: 1, max: 1000 });
      const fieldKey = 'test-field-key';
      const dto = new FindFeedbacksByChannelIdDto();
      dto.channelId = channelId;
      dto.query = { fieldKey };

      const fields = [createFieldDto({ key: fieldKey })];
      const mockFeedbacks = {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      };

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);
      jest.spyOn(channelService, 'findById').mockResolvedValue({
        feedbackSearchMaxDays: 30,
        project: { id: faker.number.int({ min: 1, max: 1000 }) },
      } as unknown as any);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest
        .spyOn(feedbackMySQLService, 'findByChannelId')
        .mockResolvedValue(mockFeedbacks);
      jest.spyOn(issueService, 'findIssuesByFeedbackIds').mockResolvedValue({});

      await feedbackService.findByChannelId(dto);

      expect(fieldService.findByChannelId).toHaveBeenCalledWith({ channelId });
    });
    it('should handle issueName query parameter', async () => {
      const channelId = faker.number.int({ min: 1, max: 1000 });
      const issueName = 'test-issue-name';
      const issueId = faker.number.int({ min: 1, max: 1000 });
      const dto = new FindFeedbacksByChannelIdDto();
      dto.channelId = channelId;
      dto.query = { issueName };

      const fields = [createFieldDto()];
      const mockIssue = { id: issueId, name: issueName } as unknown as any;
      const mockFeedbacks = {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      };

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);
      jest.spyOn(issueService, 'findByName').mockResolvedValue(mockIssue);
      jest.spyOn(channelService, 'findById').mockResolvedValue({
        feedbackSearchMaxDays: 30,
        project: { id: faker.number.int({ min: 1, max: 1000 }) },
      } as unknown as any);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest
        .spyOn(feedbackMySQLService, 'findByChannelId')
        .mockResolvedValue(mockFeedbacks);
      jest.spyOn(issueService, 'findIssuesByFeedbackIds').mockResolvedValue({});

      await feedbackService.findByChannelId(dto);

      expect(issueService.findByName).toHaveBeenCalledWith({ name: issueName });
    });
  });

  describe('findByChannelIdV2', () => {
    it('should find feedbacks by channel id v2 successfully', async () => {
      const channelId = faker.number.int({ min: 1, max: 1000 });
      const dto = {
        channelId,
        queries: [],
        defaultQueries: [],
        operator: 'AND' as const,
        sort: {},
        page: 1,
        limit: 10,
      } as FindFeedbacksByChannelIdDtoV2;

      const fields = [createFieldDto()];
      const mockFeedbacks = {
        items: [{ id: faker.number.int({ min: 1, max: 1000 }), data: {} }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);
      jest.spyOn(channelService, 'findById').mockResolvedValue({
        feedbackSearchMaxDays: 30,
        project: { id: faker.number.int({ min: 1, max: 1000 }) },
      } as unknown as any);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest
        .spyOn(feedbackMySQLService, 'findByChannelIdV2')
        .mockResolvedValue(mockFeedbacks);
      jest.spyOn(issueService, 'findIssuesByFeedbackIds').mockResolvedValue({});

      const result = await feedbackService.findByChannelIdV2(dto);

      expect(result).toEqual(mockFeedbacks);
    });
    it('should throw error for invalid channel in v2', async () => {
      const dto = {
        channelId: faker.number.int(),
        queries: [],
        defaultQueries: [],
        operator: 'AND' as const,
        sort: {},
        page: 1,
        limit: 10,
      } as FindFeedbacksByChannelIdDtoV2;

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue([] as FieldEntity[]);

      await expect(feedbackService.findByChannelIdV2(dto)).rejects.toThrow(
        new BadRequestException('invalid channel'),
      );
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback successfully', async () => {
      const fieldKey = faker.string.sample();
      const fieldValue = faker.string.sample();
      const dto = new UpdateFeedbackDto();
      dto.feedbackId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.data = { [fieldKey]: fieldValue };

      const field = createFieldDto({
        key: fieldKey,
        format: FieldFormatEnum.text,
        property: FieldPropertyEnum.EDITABLE,
        status: FieldStatusEnum.ACTIVE,
      });
      const fields = [field];

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);
      jest
        .spyOn(feedbackMySQLService, 'updateFeedback')
        .mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });

      await feedbackService.updateFeedback(dto);

      expect(fieldService.findByChannelId).toHaveBeenCalledWith({
        channelId: dto.channelId,
      });
      expect(feedbackMySQLService.updateFeedback).toHaveBeenCalledWith({
        feedbackId: dto.feedbackId,
        data: dto.data,
      });
    });
    it('should throw error for invalid field name', async () => {
      const dto = new UpdateFeedbackDto();
      dto.feedbackId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.data = { invalidField: faker.string.sample() };

      const fields = [createFieldDto()];

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);

      await expect(feedbackService.updateFeedback(dto)).rejects.toThrow(
        new BadRequestException('invalid field name'),
      );
    });
    it('should throw error for read-only field', async () => {
      const fieldKey = faker.string.sample();
      const dto = new UpdateFeedbackDto();
      dto.feedbackId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.data = { [fieldKey]: faker.string.sample() };

      const field = createFieldDto({
        key: fieldKey,
        property: FieldPropertyEnum.READ_ONLY,
        status: FieldStatusEnum.ACTIVE,
      });
      const fields = [field];

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);

      await expect(feedbackService.updateFeedback(dto)).rejects.toThrow(
        new BadRequestException('this field is read-only'),
      );
    });
    it('should throw error for inactive field', async () => {
      const fieldKey = faker.string.sample();
      const dto = new UpdateFeedbackDto();
      dto.feedbackId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.data = { [fieldKey]: faker.string.sample() };

      const field = createFieldDto({
        key: fieldKey,
        property: FieldPropertyEnum.EDITABLE,
        status: FieldStatusEnum.INACTIVE,
      });
      const fields = [field];

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);

      await expect(feedbackService.updateFeedback(dto)).rejects.toThrow(
        new BadRequestException('this field is disabled'),
      );
    });
  });

  describe('addIssue', () => {
    it('should add issue to feedback successfully', async () => {
      const dto = new AddIssueDto();
      dto.feedbackId = faker.number.int();
      dto.issueId = faker.number.int();
      dto.channelId = faker.number.int();

      jest.spyOn(feedbackMySQLService, 'addIssue').mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

      await feedbackService.addIssue(dto);

      expect(feedbackMySQLService.addIssue).toHaveBeenCalledWith(dto);
      expect(eventEmitter.emit).toHaveBeenCalled();
    });
    it('should add issue with OpenSearch enabled', async () => {
      const dto = new AddIssueDto();
      dto.feedbackId = faker.number.int();
      dto.issueId = faker.number.int();
      dto.channelId = faker.number.int();

      jest.spyOn(feedbackMySQLService, 'addIssue').mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return true;
        return false;
      });
      jest
        .spyOn(feedbackOSService, 'upsertFeedbackItem')
        .mockResolvedValue(undefined);
      jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

      await feedbackService.addIssue(dto);

      expect(feedbackMySQLService.addIssue).toHaveBeenCalledWith(dto);
      expect(eventEmitter.emit).toHaveBeenCalled();
    });
  });

  describe('removeIssue', () => {
    it('should remove issue from feedback successfully', async () => {
      const dto = new RemoveIssueDto();
      dto.feedbackId = faker.number.int();
      dto.issueId = faker.number.int();
      dto.channelId = faker.number.int();

      jest
        .spyOn(feedbackMySQLService, 'removeIssue')
        .mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });

      await feedbackService.removeIssue(dto);

      expect(feedbackMySQLService.removeIssue).toHaveBeenCalledWith(dto);
    });
    it('should remove issue with OpenSearch enabled', async () => {
      const dto = new RemoveIssueDto();
      dto.feedbackId = faker.number.int();
      dto.issueId = faker.number.int();
      dto.channelId = faker.number.int();

      jest
        .spyOn(feedbackMySQLService, 'removeIssue')
        .mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return true;
        return false;
      });
      jest
        .spyOn(feedbackOSService, 'upsertFeedbackItem')
        .mockResolvedValue(undefined);

      await feedbackService.removeIssue(dto);

      expect(feedbackMySQLService.removeIssue).toHaveBeenCalledWith(dto);
    });
  });

  describe('countByProjectId', () => {
    it('should count feedbacks by project id', async () => {
      const dto = new CountByProjectIdDto();
      dto.projectId = faker.number.int();
      const expectedCount = faker.number.int();

      jest
        .spyOn(feedbackMySQLService, 'countByProjectId')
        .mockResolvedValue(expectedCount);

      const result = await feedbackService.countByProjectId(dto);

      expect(result).toEqual({ total: expectedCount });
      expect(feedbackMySQLService.countByProjectId).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteByIds', () => {
    it('should delete feedbacks by ids successfully', async () => {
      const dto = new DeleteByIdsDto();
      dto.channelId = faker.number.int();
      dto.feedbackIds = [faker.number.int(), faker.number.int()];

      jest
        .spyOn(feedbackMySQLService, 'deleteByIds')
        .mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });

      await feedbackService.deleteByIds(dto);

      expect(feedbackMySQLService.deleteByIds).toHaveBeenCalledWith(dto);
    });
    it('should delete feedbacks with OpenSearch enabled', async () => {
      const dto = new DeleteByIdsDto();
      dto.channelId = faker.number.int();
      dto.feedbackIds = [faker.number.int(), faker.number.int()];

      jest
        .spyOn(feedbackMySQLService, 'deleteByIds')
        .mockResolvedValue(undefined);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return true;
        return false;
      });
      jest.spyOn(feedbackOSService, 'deleteByIds').mockResolvedValue(undefined);

      await feedbackService.deleteByIds(dto);

      expect(feedbackMySQLService.deleteByIds).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should find feedback by id with MySQL', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const mockFeedback = {
        id: feedbackId,
        data: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        issues: [],
      };

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest
        .spyOn(feedbackMySQLService, 'findById')
        .mockResolvedValue(mockFeedback);

      const result = await feedbackService.findById({ channelId, feedbackId });

      expect(result).toEqual(mockFeedback);
      expect(feedbackMySQLService.findById).toHaveBeenCalledWith({
        feedbackId,
      });
    });
    it('should find feedback by id with OpenSearch', async () => {
      const channelId = faker.number.int();
      const feedbackId = faker.number.int();
      const mockFeedback = {
        id: feedbackId,
        data: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        issues: [],
      };

      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return true;
        return false;
      });
      jest.spyOn(feedbackOSService, 'findById').mockResolvedValue({
        items: [mockFeedback],
        total: 1,
      });
      jest.spyOn(issueService, 'findIssuesByFeedbackIds').mockResolvedValue({});

      const result = await feedbackService.findById({ channelId, feedbackId });

      expect(result.id).toBe(feedbackId);
    });
  });

  describe('generateFile', () => {
    it('should generate XLSX file successfully', async () => {
      const dto = new GenerateExcelDto();
      dto.projectId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.type = 'xlsx';
      dto.queries = [];
      dto.defaultQueries = [];
      dto.operator = 'AND';
      dto.sort = {};
      dto.fieldIds = [faker.number.int()];

      const fields = [createFieldDto()];
      const mockProject = { timezone: { name: 'UTC' } } as unknown as any;

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue(fields as FieldEntity[]);
      jest
        .spyOn(fieldService, 'findByIds')
        .mockResolvedValue(fields as FieldEntity[]);
      jest.spyOn(channelService, 'findById').mockResolvedValue({
        feedbackSearchMaxDays: 30,
        project: { id: faker.number.int() },
      } as unknown as any);
      jest.spyOn(projectService, 'findById').mockResolvedValue(mockProject);
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'opensearch.use') return false;
        return false;
      });
      jest.spyOn(feedbackMySQLService, 'findByChannelIdV2').mockResolvedValue({
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      });
      jest.spyOn(issueService, 'findIssuesByFeedbackIds').mockResolvedValue({});

      const result = await feedbackService.generateFile(dto);

      expect(result.streamableFile).toBeDefined();
      expect(result.feedbackIds).toBeDefined();
    });
    it('should throw error for invalid channel in generateFile', async () => {
      const dto = new GenerateExcelDto();
      dto.projectId = faker.number.int();
      dto.channelId = faker.number.int();
      dto.type = 'xlsx';

      jest
        .spyOn(fieldService, 'findByChannelId')
        .mockResolvedValue([] as FieldEntity[]);

      await expect(feedbackService.generateFile(dto)).rejects.toThrow(
        new BadRequestException('invalid channel'),
      );
    });
  });
});
