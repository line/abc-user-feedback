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
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository, SelectQueryBuilder } from 'typeorm';
import { Like } from 'typeorm';

import type { TimeRange } from '@/common/dtos';
import { IssueStatusEnum } from '@/common/enums';
import { IssueStatisticsEntity } from '@/domains/admin/statistics/issue/issue-statistics.entity';
import { issueFixture } from '@/test-utils/fixtures';
import { createQueryBuilder, TestConfig } from '@/test-utils/util-functions';
import { IssueServiceProviders } from '../../../../test-utils/providers/issue.service.providers';
import {
  CreateIssueDto,
  FindIssuesByProjectIdDto,
  UpdateIssueDto,
} from './dtos';
import {
  IssueInvalidNameException,
  IssueNameDuplicatedException,
} from './exceptions';
import { IssueEntity } from './issue.entity';
import { IssueService } from './issue.service';

describe('IssueService test suite', () => {
  let issueService: IssueService;
  let issueRepo: Repository<IssueEntity>;
  let issueStatsRepo: Repository<IssueStatisticsEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: IssueServiceProviders,
    }).compile();

    issueService = module.get<IssueService>(IssueService);
    issueRepo = module.get(getRepositoryToken(IssueEntity));
    issueStatsRepo = module.get(getRepositoryToken(IssueStatisticsEntity));
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
      jest
        .spyOn(issueStatsRepo, 'createQueryBuilder')
        .mockImplementation(
          () =>
            createQueryBuilder as unknown as SelectQueryBuilder<IssueStatisticsEntity>,
        );

      const issue = await issueService.create(dto);

      expect(issue.name).toBe(dto.name);
      expect(issue.project.id).toBe(projectId);
      expect(issue.status).toBe(IssueStatusEnum.INIT);
      expect(issue.feedbackCount).toBe(0);
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
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);

      const issue = await issueService.update(dto);

      expect(issue.name).toBe(dto.name);
    });
    it('updating an issue fails with a duplicate name', async () => {
      const duplicateName = issueFixture.name;
      dto.name = duplicateName;

      await expect(issueService.update(dto)).rejects.toThrow(
        new IssueInvalidNameException('Duplicated name'),
      );
    });
  });
});
