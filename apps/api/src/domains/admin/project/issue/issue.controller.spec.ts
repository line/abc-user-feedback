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
  updateByCategoryId: jest.fn(),
  deleteByCategoryId: jest.fn(),
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
    it('should create an issue and return transformed response', async () => {
      const mockIssue = new IssueEntity();
      mockIssue.id = faker.number.int();
      jest.spyOn(MockIssueService, 'create').mockResolvedValue(mockIssue);

      const projectId = faker.number.int();
      const dto = new CreateIssueRequestDto();
      dto.name = faker.string.sample();

      const result = await issueController.create(projectId, dto);

      expect(MockIssueService.create).toHaveBeenCalledTimes(1);
      expect(MockIssueService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          name: dto.name,
        }),
      );
      expect(result).toBeDefined();
    });
  });
  describe('findById', () => {
    it('should return a transformed issue', async () => {
      const issueId = faker.number.int();
      const issue = new IssueEntity();
      issue.id = issueId;
      issue.name = faker.string.sample();
      jest.spyOn(MockIssueService, 'findById').mockResolvedValue(issue);

      const result = await issueController.findById(issueId);

      expect(MockIssueService.findById).toHaveBeenCalledTimes(1);
      expect(MockIssueService.findById).toHaveBeenCalledWith({ issueId });
      expect(result).toBeDefined();
    });
  });
  describe('findAllByProjectId', () => {
    it('should return transformed issues by project id', async () => {
      const projectId = faker.number.int();
      const mockResult = {
        issues: [new IssueEntity()],
        total: 1,
        page: 1,
        limit: 10,
      };
      jest
        .spyOn(MockIssueService, 'findIssuesByProjectIdV2')
        .mockResolvedValue(mockResult);

      const searchDto = {
        page: 1,
        limit: 10,
      };

      const result = await issueController.findAllByProjectId(
        projectId,
        searchDto,
      );

      expect(MockIssueService.findIssuesByProjectIdV2).toHaveBeenCalledTimes(1);
      expect(MockIssueService.findIssuesByProjectIdV2).toHaveBeenCalledWith({
        ...searchDto,
        projectId,
      });
      expect(result).toBeDefined();
    });
  });
  describe('update', () => {
    it('should update an issue', async () => {
      const projectId = faker.number.int();
      const issueId = faker.number.int();
      const dto = new UpdateIssueRequestDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      jest.spyOn(MockIssueService, 'update').mockResolvedValue(undefined);

      await issueController.update(projectId, issueId, dto);

      expect(MockIssueService.update).toHaveBeenCalledTimes(1);
      expect(MockIssueService.update).toHaveBeenCalledWith({
        ...dto,
        issueId,
        projectId,
      });
    });
  });
  describe('delete', () => {
    it('should delete an issue by id', async () => {
      const issueId = faker.number.int();
      jest.spyOn(MockIssueService, 'deleteById').mockResolvedValue(undefined);

      await issueController.delete(issueId);

      expect(MockIssueService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockIssueService.deleteById).toHaveBeenCalledWith(issueId);
    });
  });
  describe('deleteMany', () => {
    it('should delete multiple issues by ids', async () => {
      const projectId = faker.number.int();
      const dto = new DeleteIssuesRequestDto();
      dto.issueIds = [faker.number.int(), faker.number.int()];
      jest.spyOn(MockIssueService, 'deleteByIds').mockResolvedValue(undefined);

      await issueController.deleteMany(projectId, dto);

      expect(MockIssueService.deleteByIds).toHaveBeenCalledTimes(1);
      expect(MockIssueService.deleteByIds).toHaveBeenCalledWith(dto.issueIds);
    });
  });

  describe('updateByCategoryId', () => {
    it('should update issue category', async () => {
      const issueId = faker.number.int();
      const categoryId = faker.number.int();
      jest
        .spyOn(MockIssueService, 'updateByCategoryId')
        .mockResolvedValue(undefined);

      await issueController.updateByCategoryId(issueId, categoryId);

      expect(MockIssueService.updateByCategoryId).toHaveBeenCalledTimes(1);
      expect(MockIssueService.updateByCategoryId).toHaveBeenCalledWith({
        issueId,
        categoryId,
      });
    });
  });

  describe('deleteByCategoryId', () => {
    it('should delete issue category', async () => {
      const issueId = faker.number.int();
      const categoryId = faker.number.int();
      jest
        .spyOn(MockIssueService, 'deleteByCategoryId')
        .mockResolvedValue(undefined);

      await issueController.deleteByCategoryId(issueId, categoryId);

      expect(MockIssueService.deleteByCategoryId).toHaveBeenCalledTimes(1);
      expect(MockIssueService.deleteByCategoryId).toHaveBeenCalledWith({
        issueId,
        categoryId,
      });
    });
  });
});
