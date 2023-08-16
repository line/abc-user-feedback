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

import { FeedbackService } from '@/domains/feedback/feedback.service';
import { UserDto } from '@/domains/user/dtos';
import { TestConfigs, getMockProvider } from '@/utils/test-utils';

import { IssueService } from '../issue/issue.service';
import {
  CreateProjectRequestDto,
  FindProjectsRequestDto,
} from './dtos/requests';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

const MockProjectService = {
  create: jest.fn(),
  findAll: jest.fn(),
  deleteById: jest.fn(),
};
const MockFeedbackService = {
  countByProjectId: jest.fn(),
};
const MockIssueService = {
  countByProjectId: jest.fn(),
};

describe('ProjectController', () => {
  let projectController: ProjectController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...TestConfigs],
      controllers: [ProjectController],
      providers: [
        getMockProvider(ProjectService, MockProjectService),
        getMockProvider(FeedbackService, MockFeedbackService),
        getMockProvider(IssueService, MockIssueService),
      ],
    }).compile();

    projectController = module.get(ProjectController);
  });

  describe('create', () => {
    it('should return an array of users', async () => {
      jest.spyOn(MockProjectService, 'create');
      const dto = new CreateProjectRequestDto();
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();

      await projectController.create(dto);
      expect(MockProjectService.create).toBeCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(MockProjectService, 'findAll');
      const dto = new FindProjectsRequestDto();
      dto.limit = faker.datatype.number();
      dto.page = faker.datatype.number();
      const userDto = new UserDto();

      await projectController.findAll(dto, userDto);
      expect(MockProjectService.findAll).toBeCalledTimes(1);
    });
  });
  describe('countFeedbacks', () => {
    it('should return a number of total feedbacks by project id', async () => {
      jest.spyOn(MockFeedbackService, 'countByProjectId');
      const projectId = faker.datatype.number();

      await projectController.countFeedbacks(projectId);
      expect(MockFeedbackService.countByProjectId).toBeCalledTimes(1);
    });
  });

  describe('countIssues', () => {
    it('should return a number of total issues by project id', async () => {
      jest.spyOn(MockIssueService, 'countByProjectId');
      const projectId = faker.datatype.number();

      await projectController.countIssues(projectId);
      expect(MockIssueService.countByProjectId).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('', async () => {
      jest.spyOn(MockProjectService, 'deleteById');
      const projectId = faker.datatype.number();

      await projectController.delete(projectId);
      expect(MockProjectService.deleteById).toBeCalledTimes(1);
    });
  });
});
