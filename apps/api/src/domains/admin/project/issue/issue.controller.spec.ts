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
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import {
  CreateIssueRequestDto,
  DeleteIssuesRequestDto,
  UpdateIssueRequestDto,
} from './dtos/requests';
import { IssueController } from './issue.controller';
import { IssueEntity } from './issue.entity';
import { IssueService } from './issue.service';

const MockIssueService = {
  create: jest.fn(),
  findById: jest.fn(),
  findIssuesByProjectId: jest.fn(),
  findIssuesByProjectIdV2: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
  deleteByIds: jest.fn(),
};

describe('IssueController', () => {
  let issueController: IssueController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [IssueController],
      providers: [
        getMockProvider(IssueService, MockIssueService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    issueController = module.get<IssueController>(IssueController);
  });

  describe('create', () => {
    it('should return a saved id', async () => {
      jest.spyOn(MockIssueService, 'create');

      const projectId = faker.number.int();
      const dto = new CreateIssueRequestDto();
      dto.name = faker.string.sample();

      await issueController.create(projectId, dto);

      expect(MockIssueService.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findById', () => {
    it('should return an issue', async () => {
      const issueId = faker.number.int();
      const issue = new IssueEntity();
      jest.spyOn(MockIssueService, 'findById').mockReturnValue(issue);

      await issueController.findById(issueId);

      expect(MockIssueService.findById).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAllByProjectId', () => {
    it('should return issues', async () => {
      const projectId = faker.number.int();
      const issues = [new IssueEntity()];
      jest
        .spyOn(MockIssueService, 'findIssuesByProjectId')
        .mockReturnValue(issues);

      await issueController.findAllByProjectId(projectId, {
        page: 1,
        limit: 10,
      });

      expect(MockIssueService.findIssuesByProjectIdV2).toHaveBeenCalledTimes(1);
    });
  });
  describe('update', () => {
    it('', async () => {
      const projectId = faker.number.int();
      const issueId = faker.number.int();
      const dto = new UpdateIssueRequestDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      jest.spyOn(MockIssueService, 'update');

      await issueController.update(projectId, issueId, dto);

      expect(MockIssueService.update).toHaveBeenCalledTimes(1);
    });
  });
  describe('delete', () => {
    it('', async () => {
      const issueId = faker.number.int();
      jest.spyOn(MockIssueService, 'deleteById');

      await issueController.delete(issueId);

      expect(MockIssueService.deleteById).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteMany', () => {
    it('', async () => {
      const projectId = faker.number.int();
      const dto = new DeleteIssuesRequestDto();
      dto.issueIds = [faker.number.int()];
      jest.spyOn(MockIssueService, 'deleteByIds');

      await issueController.deleteMany(projectId, dto);

      expect(MockIssueService.deleteByIds).toHaveBeenCalledTimes(1);
    });
  });
});
