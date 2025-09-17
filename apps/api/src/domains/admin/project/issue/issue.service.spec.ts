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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { In, Like } from 'typeorm';

import type { TimeRange } from '@/common/dtos';
import type { SortMethodEnum } from '@/common/enums';
import {
  EventTypeEnum,
  IssueStatusEnum,
  QueryV2ConditionsEnum,
} from '@/common/enums';
import { IssueStatisticsEntity } from '@/domains/admin/statistics/issue/issue-statistics.entity';
import { IssueStatisticsService } from '@/domains/admin/statistics/issue/issue-statistics.service';
import { SchedulerLockService } from '@/domains/operation/scheduler-lock/scheduler-lock.service';
import { issueFixture } from '@/test-utils/fixtures';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { IssueServiceProviders } from '../../../../test-utils/providers/issue.service.providers';
import { CategoryEntity } from '../category/category.entity';
import { CategoryNotFoundException } from '../category/exceptions';
import { ProjectEntity } from '../project/project.entity';
import {
  CreateIssueDto,
  FindIssuesByProjectIdDto,
  FindIssuesByProjectIdDtoV2,
  UpdateIssueDto,
} from './dtos';
import { UpdateIssueCategoryDto } from './dtos/update-issue-category.dto';
import {
  IssueInvalidNameException,
  IssueNameDuplicatedException,
  IssueNotFoundException,
} from './exceptions';
import { IssueEntity } from './issue.entity';
import { IssueService } from './issue.service';

describe('IssueService test suite', () => {
  let issueService: IssueService;
  let issueRepo: Repository<IssueEntity>;
  let issueStatsRepo: Repository<IssueStatisticsEntity>;
  let categoryRepo: Repository<CategoryEntity>;
  let _projectRepo: Repository<ProjectEntity>;
  let eventEmitter: EventEmitter2;
  let _schedulerRegistry: SchedulerRegistry;
  let _schedulerLockService: SchedulerLockService;
  let issueStatisticsService: IssueStatisticsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: [
        ...IssueServiceProviders,
        {
          provide: getRepositoryToken(ProjectEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    issueService = module.get<IssueService>(IssueService);
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    issueStatsRepo = module.get(getRepositoryToken(IssueStatisticsEntity));
    categoryRepo = module.get(getRepositoryToken(CategoryEntity));
    _projectRepo = module.get(getRepositoryToken(ProjectEntity));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    _schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    _schedulerLockService =
      module.get<SchedulerLockService>(SchedulerLockService);
    issueStatisticsService = module.get<IssueStatisticsService>(
      IssueStatisticsService,
    );
  });

  describe('create', () => {
    const projectId = faker.number.int();
    let dto: CreateIssueDto;
    beforeEach(() => {
      dto = new CreateIssueDto();
      dto.projectId = projectId;
    });

    it('creating an issue succeeds with valid inputs', async () => {
      dto.name = faker.string.sample();
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        ...issueFixture,
        name: dto.name,
        project: { id: projectId },
        status: IssueStatusEnum.INIT,
        feedbackCount: 0,
      } as IssueEntity);
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
        );
      jest
        .spyOn(issueStatisticsService, 'updateCount')
        .mockResolvedValue(undefined);
      const eventEmitterSpy = jest
        .spyOn(eventEmitter, 'emit')
        .mockImplementation();

      const issue = await issueService.create(dto);

      expect(issue.name).toBe(dto.name);
      expect(issue.project.id).toBe(projectId);
      expect(issue.status).toBe(IssueStatusEnum.INIT);
      expect(issue.feedbackCount).toBe(0);
      expect(eventEmitterSpy).toHaveBeenCalledWith(
        EventTypeEnum.ISSUE_CREATION,
        {
          issueId: issue.id,
        },
      );
    });
    it('creating an issue fails with a duplicate name', async () => {
      const duplicateName = 'duplicateName';
      dto.name = duplicateName;
      jest
        .spyOn(issueRepo, 'findOneBy')
        .mockResolvedValue({ name: duplicateName } as IssueEntity);

      await expect(issueService.create(dto)).rejects.toThrow(
        IssueNameDuplicatedException,
      );
    });
  });

  describe('findIssuesByProjectId', () => {
    const projectId = faker.number.int();
    let dto: FindIssuesByProjectIdDto;
    let spy;

    beforeEach(() => {
      dto = new FindIssuesByProjectIdDto();
      dto.projectId = projectId;
    });

    afterEach(() => {
      (spy as jest.SpyInstance).mockRestore();
    });

    it('finding issues succeeds with the createdAt query', async () => {
      dto.query = {
        createdAt: {
          gte: faker.date.past().toISOString(),
          lt: faker.date.future().toISOString(),
        },
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      spy = jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const { meta } = await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledTimes(2);
      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            createdAt: expect.objectContaining({
              _objectLiteralParameters: {
                ...(dto.query.createdAt as TimeRange),
              },
            }) as TimeRange | string,
          },
        ],
      });
      expect(meta.itemCount).toBe(1);
    });
    it('finding issues succeeds with the updatedAt query', async () => {
      dto.query = {
        updatedAt: {
          gte: faker.date.past().toISOString(),
          lt: faker.date.future().toISOString(),
        },
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const { meta } = await issueService.findIssuesByProjectId(dto);

      expect(meta.itemCount).toBe(1);
    });
    it('finding issues succeeds with the id query', async () => {
      const id = faker.number.int();
      dto.query = {
        id,
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      spy = jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const { meta } = await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledTimes(2);
      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            id,
          },
        ],
      });
      expect(meta.itemCount).toBe(1);
    });
    it('finding issues succeeds with the column query', async () => {
      dto.query = {
        column: 'test',
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const { meta } = await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledTimes(2);
      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            column: Like(`%${dto.query.column as string}%`),
          },
        ],
      });
      expect(meta.itemCount).toBe(1);
    });
    it('finding issues succeeds with the search text query (string)', async () => {
      dto.query = {
        searchText: 'test',
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const { meta } = await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledTimes(2);
      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            name: Like(`%${dto.query.searchText}%`),
          },
          {
            project: {
              id: dto.projectId,
            },
            description: Like(`%${dto.query.searchText}%`),
          },
          {
            project: {
              id: dto.projectId,
            },
            externalIssueId: Like(`%${dto.query.searchText}%`),
          },
        ],
      });
      expect(meta.itemCount).toBe(1);
    });
    it('finding issues succeeds with the search text query (number)', async () => {
      dto.query = {
        searchText: '123',
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );
      jest.spyOn(createQueryBuilder, 'setFindOptions' as never);

      const { meta } = await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledTimes(2);
      expect(createQueryBuilder.setFindOptions).toHaveBeenCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            name: Like(`%${dto.query.searchText}%`),
          },
          {
            project: {
              id: dto.projectId,
            },
            description: Like(`%${dto.query.searchText}%`),
          },
          {
            project: {
              id: dto.projectId,
            },
            externalIssueId: Like(`%${dto.query.searchText}%`),
          },
          {
            project: {
              id: dto.projectId,
            },
            id: parseInt(dto.query.searchText ?? ''),
          },
        ],
      });
      expect(meta.itemCount).toBe(1);
    });
  });

  describe('update', () => {
    const issueId = faker.number.int();
    let dto: UpdateIssueDto;
    beforeEach(() => {
      dto = new UpdateIssueDto();
      dto.issueId = issueId;
      dto.description = faker.string.sample();
    });

    it('updating an issue succeeds with valid inputs', async () => {
      dto.name = faker.string.sample();
      const existingIssue = {
        ...issueFixture,
        id: issueId,
        project: { id: faker.number.int() },
      };
      jest
        .spyOn(issueService, 'findById')
        .mockResolvedValue(existingIssue as IssueEntity);
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        ...existingIssue,
        name: dto.name,
        description: dto.description,
      } as IssueEntity);
      jest.spyOn(eventEmitter, 'emit').mockImplementation();

      const issue = await issueService.update(dto);

      expect(issue.name).toBe(dto.name);
      expect(issue.description).toBe(dto.description);
    });

    it('updating an issue emits status change event when status changes', async () => {
      dto.name = faker.string.sample();
      dto.status = IssueStatusEnum.IN_PROGRESS;
      const existingIssue = {
        ...issueFixture,
        id: issueId,
        status: IssueStatusEnum.INIT,
        project: { id: faker.number.int() },
      };
      jest
        .spyOn(issueService, 'findById')
        .mockResolvedValue(existingIssue as IssueEntity);
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        ...existingIssue,
        name: dto.name,
        status: dto.status,
      } as IssueEntity);
      const eventEmitterSpy = jest
        .spyOn(eventEmitter, 'emit')
        .mockImplementation();

      await issueService.update(dto);

      expect(eventEmitterSpy).toHaveBeenCalledWith(
        EventTypeEnum.ISSUE_STATUS_CHANGE,
        {
          issueId,
          previousStatus: IssueStatusEnum.INIT,
        },
      );
    });
    it('updating an issue fails with a duplicate name', async () => {
      const duplicateName = issueFixture.name;
      dto.name = duplicateName;
      const existingIssue = {
        ...issueFixture,
        id: issueId,
        project: { id: faker.number.int() },
      };
      jest
        .spyOn(issueService, 'findById')
        .mockResolvedValue(existingIssue as IssueEntity);
      jest
        .spyOn(issueRepo, 'findOne')
        .mockResolvedValue({ id: faker.number.int() } as IssueEntity);

      await expect(issueService.update(dto)).rejects.toThrow(
        new IssueInvalidNameException('Duplicated name'),
      );
    });
  });

  describe('findIssuesByProjectIdV2', () => {
    const projectId = faker.number.int();
    let dto: FindIssuesByProjectIdDtoV2;

    beforeEach(() => {
      dto = new FindIssuesByProjectIdDtoV2();
      dto.projectId = projectId;
      dto.page = 1;
      dto.limit = 10;
    });

    it('finding issues with V2 API succeeds with basic query', async () => {
      dto.queries = [
        {
          key: 'name',
          value: 'test',
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([issueFixture]),
        getCount: jest.fn().mockResolvedValue(1),
      };

      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await issueService.findIssuesByProjectIdV2(dto);

      expect(result.meta.itemCount).toBe(1);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
    });

    it('finding issues with V2 API succeeds with category query', async () => {
      dto.queries = [
        { key: 'categoryId', value: 1, condition: QueryV2ConditionsEnum.IS },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([issueFixture]),
        getCount: jest.fn().mockResolvedValue(1),
      };

      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await issueService.findIssuesByProjectIdV2(dto);

      expect(result.meta.itemCount).toBe(1);
    });

    it('finding issues with V2 API succeeds with null category query', async () => {
      dto.queries = [
        { key: 'categoryId', value: 0, condition: QueryV2ConditionsEnum.IS },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([issueFixture]),
        getCount: jest.fn().mockResolvedValue(1),
      };

      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await issueService.findIssuesByProjectIdV2(dto);

      expect(result.meta.itemCount).toBe(1);
    });

    it('finding issues with V2 API succeeds with OR operator', async () => {
      dto.operator = 'OR';
      dto.queries = [
        {
          key: 'name',
          value: 'test1',
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
        {
          key: 'name',
          value: 'test2',
          condition: QueryV2ConditionsEnum.CONTAINS,
        },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([issueFixture]),
        getCount: jest.fn().mockResolvedValue(1),
      };

      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await issueService.findIssuesByProjectIdV2(dto);

      expect(result.meta.itemCount).toBe(1);
    });

    it('finding issues with V2 API throws error for invalid sort method', async () => {
      dto.sort = { name: 'INVALID_SORT' as SortMethodEnum };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueEntity>,
        );

      await expect(issueService.findIssuesByProjectIdV2(dto)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    const issueId = faker.number.int();

    it('finding issue by id succeeds when issue exists', async () => {
      const mockIssue = { ...issueFixture, id: issueId };
      jest
        .spyOn(issueRepo, 'find')
        .mockResolvedValue([mockIssue] as IssueEntity[]);

      const result = await issueService.findById({ issueId });

      expect(result).toEqual(mockIssue);
      expect(issueRepo.find).toHaveBeenCalledWith({
        where: { id: issueId },
        relations: { project: true },
      });
    });

    it('finding issue by id throws exception when issue not found', async () => {
      jest.spyOn(issueRepo, 'find').mockResolvedValue([]);

      await expect(issueService.findById({ issueId })).rejects.toThrow(
        IssueNotFoundException,
      );
    });
  });

  describe('findByName', () => {
    const issueName = faker.string.sample();

    it('finding issue by name succeeds when issue exists', async () => {
      const mockIssue = { ...issueFixture, name: issueName };
      jest
        .spyOn(issueRepo, 'findOneBy')
        .mockResolvedValue(mockIssue as IssueEntity);

      const result = await issueService.findByName({ name: issueName });

      expect(result).toEqual(mockIssue);
      expect(issueRepo.findOneBy).toHaveBeenCalledWith({ name: issueName });
    });

    it('finding issue by name returns null when issue not found', async () => {
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null);

      const result = await issueService.findByName({ name: issueName });

      expect(result).toBeNull();
    });
  });

  describe('findIssuesByFeedbackIds', () => {
    const feedbackIds = [faker.number.int(), faker.number.int()];

    it('finding issues by feedback ids succeeds', async () => {
      const mockIssues = [
        { ...issueFixture, id: 1, feedbacks: [{ id: feedbackIds[0] }] },
        { ...issueFixture, id: 2, feedbacks: [{ id: feedbackIds[1] }] },
      ];
      jest
        .spyOn(issueRepo, 'find')
        .mockResolvedValue(mockIssues as IssueEntity[]);

      const result = await issueService.findIssuesByFeedbackIds(feedbackIds);

      expect(result[feedbackIds[0]]).toHaveLength(1);
      expect(result[feedbackIds[1]]).toHaveLength(1);
      expect(issueRepo.find).toHaveBeenCalledWith({
        relations: { feedbacks: true },
        where: { feedbacks: { id: In(feedbackIds) } },
        order: { id: 'ASC' },
      });
    });

    it('finding issues by feedback ids returns empty arrays for non-existent feedbacks', async () => {
      jest.spyOn(issueRepo, 'find').mockResolvedValue([]);

      const result = await issueService.findIssuesByFeedbackIds(feedbackIds);

      expect(result[feedbackIds[0]]).toEqual([]);
      expect(result[feedbackIds[1]]).toEqual([]);
    });
  });

  describe('updateByCategoryId', () => {
    const issueId = faker.number.int();
    const categoryId = faker.number.int();
    let dto: UpdateIssueCategoryDto;

    beforeEach(() => {
      dto = new UpdateIssueCategoryDto();
      dto.issueId = issueId;
      dto.categoryId = categoryId;
    });

    it('updating issue category succeeds with valid inputs', async () => {
      const mockIssue = { ...issueFixture, id: issueId };
      const mockCategory = { id: categoryId };

      jest
        .spyOn(issueRepo, 'findOne')
        .mockResolvedValue(mockIssue as IssueEntity);
      jest
        .spyOn(categoryRepo, 'findOne')
        .mockResolvedValue(mockCategory as CategoryEntity);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        ...mockIssue,
        category: { id: categoryId },
      } as IssueEntity);

      const result = await issueService.updateByCategoryId(dto);

      expect(result.category.id).toBe(categoryId);
    });

    it('updating issue category throws exception when issue not found', async () => {
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);

      await expect(issueService.updateByCategoryId(dto)).rejects.toThrow(
        IssueNotFoundException,
      );
    });

    it('updating issue category throws exception when category not found', async () => {
      const mockIssue = { ...issueFixture, id: issueId };
      jest
        .spyOn(issueRepo, 'findOne')
        .mockResolvedValue(mockIssue as IssueEntity);
      jest.spyOn(categoryRepo, 'findOne').mockResolvedValue(null);

      await expect(issueService.updateByCategoryId(dto)).rejects.toThrow(
        CategoryNotFoundException,
      );
    });
  });

  describe('deleteByCategoryId', () => {
    const issueId = faker.number.int();
    const categoryId = faker.number.int();

    it('deleting issue category succeeds with valid inputs', async () => {
      const mockIssue = {
        ...issueFixture,
        id: issueId,
        category: { id: categoryId },
      };

      jest
        .spyOn(issueRepo, 'findOne')
        .mockResolvedValue(mockIssue as IssueEntity);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({
        ...mockIssue,
        category: null,
      } as IssueEntity);

      const result = await issueService.deleteByCategoryId({
        issueId,
        categoryId,
      });

      expect(result.category).toBeNull();
    });

    it('deleting issue category throws exception when issue not found', async () => {
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);

      await expect(
        issueService.deleteByCategoryId({ issueId, categoryId }),
      ).rejects.toThrow(IssueNotFoundException);
    });

    it('deleting issue category throws exception when category id does not match', async () => {
      const mockIssue = {
        ...issueFixture,
        id: issueId,
        category: { id: faker.number.int() },
      };
      jest
        .spyOn(issueRepo, 'findOne')
        .mockResolvedValue(mockIssue as IssueEntity);

      await expect(
        issueService.deleteByCategoryId({ issueId, categoryId }),
      ).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    const issueId = faker.number.int();

    it('deleting issue by id succeeds', async () => {
      const mockIssue = {
        ...issueFixture,
        id: issueId,
        project: { id: faker.number.int() },
      };
      jest
        .spyOn(issueRepo, 'findOne')
        .mockResolvedValue(mockIssue as IssueEntity);
      jest
        .spyOn(issueStatisticsService, 'updateCount')
        .mockResolvedValue(undefined);
      jest
        .spyOn(issueRepo, 'remove')
        .mockResolvedValue(mockIssue as IssueEntity);

      await issueService.deleteById(issueId);

      expect(issueStatisticsService.updateCount).toHaveBeenCalledWith({
        projectId: mockIssue.project.id,
        date: mockIssue.createdAt,
        count: -1,
      });
      expect(issueRepo.remove).toHaveBeenCalledWith(mockIssue);
    });

    it('deleting issue by id throws error when issue not found due to missing project info', async () => {
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);

      // IssueService에서 new IssueEntity()를 생성하므로 project가 undefined가 되어 오류 발생
      await expect(issueService.deleteById(issueId)).rejects.toThrow();
    });
  });

  describe('deleteByIds', () => {
    const issueIds = [faker.number.int(), faker.number.int()];

    it('deleting issues by ids succeeds', async () => {
      const mockIssues = [
        {
          ...issueFixture,
          id: issueIds[0],
          project: { id: faker.number.int() },
        },
        {
          ...issueFixture,
          id: issueIds[1],
          project: { id: faker.number.int() },
        },
      ];
      jest
        .spyOn(issueRepo, 'find')
        .mockResolvedValue(mockIssues as IssueEntity[]);
      jest
        .spyOn(issueStatisticsService, 'updateCount')
        .mockResolvedValue(undefined);
      jest
        .spyOn(issueRepo, 'remove')
        .mockResolvedValue(mockIssues as IssueEntity[]);

      await issueService.deleteByIds(issueIds);

      expect(issueStatisticsService.updateCount).toHaveBeenCalledTimes(2);
      expect(issueRepo.remove).toHaveBeenCalledWith(mockIssues);
    });

    it('deleting issues by ids succeeds with empty array', async () => {
      jest.spyOn(issueRepo, 'find').mockResolvedValue([]);
      jest.spyOn(issueRepo, 'remove').mockResolvedValue([]);

      await issueService.deleteByIds(issueIds);

      expect(issueRepo.remove).toHaveBeenCalledWith([]);
    });
  });

  describe('countByProjectId', () => {
    const projectId = faker.number.int();

    it('counting issues by project id succeeds', async () => {
      const mockCount = faker.number.int();
      jest.spyOn(issueRepo, 'count').mockResolvedValue(mockCount);

      const result = await issueService.countByProjectId({ projectId });

      expect(result.total).toBe(mockCount);
      expect(issueRepo.count).toHaveBeenCalledWith({
        relations: { project: true },
        where: { project: { id: projectId } },
      });
    });
  });

  describe('calculateFeedbackCount', () => {
    const projectId = faker.number.int();

    it('calculating feedback count succeeds', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await issueService.calculateFeedbackCount(projectId);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith('issues');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'project_id = :projectId',
        { projectId },
      );
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('Transactional behavior', () => {
    describe('create method', () => {
      const projectId = faker.number.int();
      let dto: CreateIssueDto;

      beforeEach(() => {
        dto = new CreateIssueDto();
        dto.projectId = projectId;
        dto.name = faker.string.sample();
      });

      it('create method handles transaction rollback when statistics update fails', async () => {
        jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null);
        jest.spyOn(issueRepo, 'save').mockResolvedValue({
          ...issueFixture,
          name: dto.name,
          project: { id: projectId },
        } as IssueEntity);
        jest
          .spyOn(issueStatsRepo, 'createQueryBuilder')
          .mockImplementation(
            () =>
              createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
          );
        jest
          .spyOn(issueStatisticsService, 'updateCount')
          .mockRejectedValue(new Error('Statistics update failed'));

        await expect(issueService.create(dto)).rejects.toThrow(
          'Statistics update failed',
        );
      });
    });

    describe('update method', () => {
      const issueId = faker.number.int();
      let dto: UpdateIssueDto;

      beforeEach(() => {
        dto = new UpdateIssueDto();
        dto.issueId = issueId;
        dto.name = faker.string.sample();
        dto.description = faker.string.sample();
      });

      it('update method handles transaction rollback when save fails', async () => {
        const existingIssue = {
          ...issueFixture,
          id: issueId,
          project: { id: faker.number.int() },
        };
        jest
          .spyOn(issueService, 'findById')
          .mockResolvedValue(existingIssue as IssueEntity);
        jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);
        jest
          .spyOn(issueRepo, 'save')
          .mockRejectedValue(new Error('Database save failed'));

        await expect(issueService.update(dto)).rejects.toThrow(
          'Database save failed',
        );
      });
    });

    describe('updateByCategoryId method', () => {
      const issueId = faker.number.int();
      const categoryId = faker.number.int();
      let dto: UpdateIssueCategoryDto;

      beforeEach(() => {
        dto = new UpdateIssueCategoryDto();
        dto.issueId = issueId;
        dto.categoryId = categoryId;
      });

      it('updateByCategoryId method handles transaction rollback when save fails', async () => {
        const mockIssue = { ...issueFixture, id: issueId };
        const mockCategory = { id: categoryId };

        jest
          .spyOn(issueRepo, 'findOne')
          .mockResolvedValue(mockIssue as IssueEntity);
        jest
          .spyOn(categoryRepo, 'findOne')
          .mockResolvedValue(mockCategory as CategoryEntity);
        jest
          .spyOn(issueRepo, 'save')
          .mockRejectedValue(new Error('Database save failed'));

        await expect(issueService.updateByCategoryId(dto)).rejects.toThrow(
          'Database save failed',
        );
      });
    });

    describe('deleteById method', () => {
      const issueId = faker.number.int();

      it('deleteById method handles transaction rollback when statistics update fails', async () => {
        const mockIssue = {
          ...issueFixture,
          id: issueId,
          project: { id: faker.number.int() },
        };
        jest
          .spyOn(issueRepo, 'findOne')
          .mockResolvedValue(mockIssue as IssueEntity);
        jest
          .spyOn(issueStatisticsService, 'updateCount')
          .mockRejectedValue(new Error('Statistics update failed'));

        await expect(issueService.deleteById(issueId)).rejects.toThrow(
          'Statistics update failed',
        );
      });

      it('deleteById method handles transaction rollback when remove fails', async () => {
        const mockIssue = {
          ...issueFixture,
          id: issueId,
          project: { id: faker.number.int() },
        };
        jest
          .spyOn(issueRepo, 'findOne')
          .mockResolvedValue(mockIssue as IssueEntity);
        jest
          .spyOn(issueStatisticsService, 'updateCount')
          .mockResolvedValue(undefined);
        jest
          .spyOn(issueRepo, 'remove')
          .mockRejectedValue(new Error('Database remove failed'));

        await expect(issueService.deleteById(issueId)).rejects.toThrow(
          'Database remove failed',
        );
      });
    });

    describe('deleteByIds method', () => {
      const issueIds = [faker.number.int(), faker.number.int()];

      it('deleteByIds method handles transaction rollback when statistics update fails', async () => {
        const mockIssues = [
          {
            ...issueFixture,
            id: issueIds[0],
            project: { id: faker.number.int() },
          },
          {
            ...issueFixture,
            id: issueIds[1],
            project: { id: faker.number.int() },
          },
        ];
        jest
          .spyOn(issueRepo, 'find')
          .mockResolvedValue(mockIssues as IssueEntity[]);
        jest
          .spyOn(issueStatisticsService, 'updateCount')
          .mockRejectedValue(new Error('Statistics update failed'));

        await expect(issueService.deleteByIds(issueIds)).rejects.toThrow(
          'Statistics update failed',
        );
      });

      it('deleteByIds method handles transaction rollback when remove fails', async () => {
        const mockIssues = [
          {
            ...issueFixture,
            id: issueIds[0],
            project: { id: faker.number.int() },
          },
          {
            ...issueFixture,
            id: issueIds[1],
            project: { id: faker.number.int() },
          },
        ];
        jest
          .spyOn(issueRepo, 'find')
          .mockResolvedValue(mockIssues as IssueEntity[]);
        jest
          .spyOn(issueStatisticsService, 'updateCount')
          .mockResolvedValue(undefined);
        jest
          .spyOn(issueRepo, 'remove')
          .mockRejectedValue(new Error('Database remove failed'));

        await expect(issueService.deleteByIds(issueIds)).rejects.toThrow(
          'Database remove failed',
        );
      });
    });
  });
});
