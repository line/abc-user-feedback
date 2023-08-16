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
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { TimeRange } from '@/common/dtos';
import { createQueryBuilder, mockRepository } from '@/utils/test-utils';

// import { ProjectEntity } from '../project/project.entity';
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

export const IssueServiceProviders = [
  IssueService,
  {
    provide: getRepositoryToken(IssueEntity),
    useValue: mockRepository(),
  },
];

describe('IssueService test suite', () => {
  let issueService: IssueService;
  let issueRepo: Repository<IssueEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: IssueServiceProviders,
    }).compile();

    issueService = module.get<IssueService>(IssueService);
    issueRepo = module.get(getRepositoryToken(IssueEntity));
  });

  describe('create', () => {
    const projectId = faker.datatype.number();
    let dto: CreateIssueDto;
    beforeEach(() => {
      dto = new CreateIssueDto();
      dto.projectId = projectId;
    });

    it('creating an issue succeeds with valid inputs', async () => {
      dto.name = faker.datatype.string();
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue(null as IssueEntity);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({} as IssueEntity);

      await issueService.create(dto);

      expect(issueRepo.findOneBy).toBeCalledTimes(1);
      expect(issueRepo.save).toBeCalledTimes(1);
      expect(issueRepo.save).toBeCalledWith(CreateIssueDto.toIssueEntity(dto));
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

      expect(issueRepo.findOneBy).toBeCalledTimes(1);
      expect(issueRepo.save).not.toBeCalled();
    });
  });

  describe('findIssuesByProjectId', () => {
    const projectId = faker.datatype.number();
    let dto: FindIssuesByProjectIdDto;
    beforeEach(() => {
      dto = new FindIssuesByProjectIdDto();
      dto.projectId = projectId;
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
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
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
            }),
          },
        ],
      });
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
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            updatedAt: expect.objectContaining({
              _objectLiteralParameters: {
                ...(dto.query.updatedAt as TimeRange),
              },
            }),
          },
        ],
      });
    });
    it('finding issues succeeds with the id query', async () => {
      const id = faker.datatype.number();
      dto.query = {
        id,
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
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
    });
    it('finding issues succeeds with the column query', async () => {
      dto.query = {
        column: 'test',
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
        order: {},
        where: [
          {
            project: {
              id: dto.projectId,
            },
            column: Like(`%${dto.query.column}%`),
          },
        ],
      });
    });
    it('finding issues succeeds with the search text query (string)', async () => {
      dto.query = {
        searchText: 'test',
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
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
    });
    it('finding issues succeeds with the search text query (number)', async () => {
      dto.query = {
        searchText: '123',
      };
      jest
        .spyOn(issueRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await issueService.findIssuesByProjectId(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
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
            id: parseInt(dto.query.searchText),
          },
        ],
      });
    });
  });

  describe('update', () => {
    const issueId = faker.datatype.number();
    let dto: UpdateIssueDto;
    beforeEach(() => {
      dto = new UpdateIssueDto();
      dto.issueId = issueId;
      dto.description = faker.datatype.string();
    });

    it('updating an issue succeeds with valid inputs', async () => {
      dto.name = faker.datatype.string();
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue({} as IssueEntity);
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null as IssueEntity);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({} as IssueEntity);

      await issueService.update(dto);

      expect(issueRepo.findOneBy).toBeCalledTimes(1);
      expect(issueRepo.findOne).toBeCalledTimes(1);
      expect(issueRepo.update).toBeCalledTimes(1);
      expect(issueRepo.update).toBeCalledWith(
        { id: issueId },
        { id: issueId, name: dto.name, description: dto.description },
      );
    });
    it('updating an issue fails with a duplicate name', async () => {
      const duplicateName = 'duplicateName';
      dto.name = duplicateName;
      jest.spyOn(issueRepo, 'findOneBy').mockResolvedValue({} as IssueEntity);
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue({} as IssueEntity);
      jest.spyOn(issueRepo, 'save').mockResolvedValue({} as IssueEntity);

      await expect(issueService.update(dto)).rejects.toThrow(
        new IssueInvalidNameException('Duplicated name'),
      );

      expect(issueRepo.findOneBy).toBeCalledTimes(1);
      expect(issueRepo.findOne).toBeCalledTimes(1);
      expect(issueRepo.update).not.toBeCalled();
    });
  });
});
