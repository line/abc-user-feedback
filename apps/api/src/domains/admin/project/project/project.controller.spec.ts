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

import { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import { UserDto } from '@/domains/admin/user/dtos';
import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { IssueService } from '../issue/issue.service';
import {
  CreateProjectRequestDto,
  FindProjectsRequestDto,
  UpdateProjectRequestDto,
} from './dtos/requests';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

const MockProjectService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
  checkName: jest.fn(),
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
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        getMockProvider(ProjectService, MockProjectService),
        getMockProvider(FeedbackService, MockFeedbackService),
        getMockProvider(IssueService, MockIssueService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    projectController = module.get(ProjectController);
  });

  describe('create', () => {
    it('should create a new project successfully', async () => {
      const mockProject = {
        id: faker.number.int(),
        name: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        createdAt: faker.date.past(),
      };

      MockProjectService.create.mockResolvedValue(mockProject);

      const dto = new CreateProjectRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.description = faker.string.alphanumeric(20);
      dto.timezone = {
        countryCode: faker.location.countryCode(),
        name: faker.location.timeZone(),
        offset: '+09:00',
      };

      const result = await projectController.create(dto);

      expect(MockProjectService.create).toHaveBeenCalledTimes(1);
      expect(MockProjectService.create).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });

    it('should handle project creation with optional fields', async () => {
      const mockProject = {
        id: faker.number.int(),
        name: faker.string.alphanumeric(10),
        description: null,
        createdAt: faker.date.past(),
      };

      MockProjectService.create.mockResolvedValue(mockProject);

      const dto = new CreateProjectRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.description = null;
      dto.timezone = {
        countryCode: faker.location.countryCode(),
        name: faker.location.timeZone(),
        offset: '+09:00',
      };
      dto.roles = [];
      dto.members = [];
      dto.apiKeys = [];

      const result = await projectController.create(dto);

      expect(MockProjectService.create).toHaveBeenCalledTimes(1);
      expect(MockProjectService.create).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });
  });
  describe('findAll', () => {
    it('should return paginated projects list', async () => {
      const mockProjects = {
        items: [
          {
            id: faker.number.int(),
            name: faker.string.alphanumeric(10),
            description: faker.string.alphanumeric(20),
            createdAt: faker.date.past(),
          },
        ],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      MockProjectService.findAll.mockResolvedValue(mockProjects);

      const dto = new FindProjectsRequestDto();
      dto.limit = 10;
      dto.page = 1;
      dto.searchText = faker.string.alphanumeric(5);

      const userDto = new UserDto();
      userDto.id = faker.number.int();
      userDto.type = 'SUPER' as any;

      const result = await projectController.findAll(dto, userDto);

      expect(MockProjectService.findAll).toHaveBeenCalledTimes(1);
      expect(MockProjectService.findAll).toHaveBeenCalledWith({
        user: userDto,
        options: { limit: dto.limit, page: dto.page },
        searchText: dto.searchText,
      });
      expect(result).toBeDefined();
    });

    it('should handle findAll without searchText', async () => {
      const mockProjects = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      };

      MockProjectService.findAll.mockResolvedValue(mockProjects);

      const dto = new FindProjectsRequestDto();
      dto.limit = 10;
      dto.page = 1;

      const userDto = new UserDto();
      userDto.id = faker.number.int();
      userDto.type = 'SUPER' as any;

      const result = await projectController.findAll(dto, userDto);

      expect(MockProjectService.findAll).toHaveBeenCalledTimes(1);
      expect(MockProjectService.findAll).toHaveBeenCalledWith({
        user: userDto,
        options: { limit: dto.limit, page: dto.page },
        searchText: undefined,
      });
      expect(result).toBeDefined();
    });
  });
  describe('checkName', () => {
    it('should check if project name exists', async () => {
      const projectName = faker.string.alphanumeric(10);
      const mockResult = true;

      MockProjectService.checkName.mockResolvedValue(mockResult);

      const result = await projectController.checkName(projectName);

      expect(MockProjectService.checkName).toHaveBeenCalledTimes(1);
      expect(MockProjectService.checkName).toHaveBeenCalledWith(projectName);
      expect(result).toBe(mockResult);
    });

    it('should return false when project name does not exist', async () => {
      const projectName = faker.string.alphanumeric(10);
      const mockResult = false;

      MockProjectService.checkName.mockResolvedValue(mockResult);

      const result = await projectController.checkName(projectName);

      expect(MockProjectService.checkName).toHaveBeenCalledTimes(1);
      expect(MockProjectService.checkName).toHaveBeenCalledWith(projectName);
      expect(result).toBe(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const projectId = faker.number.int();
      const mockProject = {
        id: projectId,
        name: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        createdAt: faker.date.past(),
      };

      MockProjectService.findById.mockResolvedValue(mockProject);

      const result = await projectController.findOne(projectId);

      expect(MockProjectService.findById).toHaveBeenCalledTimes(1);
      expect(MockProjectService.findById).toHaveBeenCalledWith({ projectId });
      expect(result).toBeDefined();
    });
  });

  describe('countFeedbacks', () => {
    it('should return a number of total feedbacks by project id', async () => {
      const projectId = faker.number.int();
      const mockCount = faker.number.int({ min: 0, max: 100 });

      MockFeedbackService.countByProjectId.mockResolvedValue(mockCount);

      const result = await projectController.countFeedbacks(projectId);

      expect(MockFeedbackService.countByProjectId).toHaveBeenCalledTimes(1);
      expect(MockFeedbackService.countByProjectId).toHaveBeenCalledWith({
        projectId,
      });
      expect(result).toBeDefined();
    });
  });

  describe('countIssues', () => {
    it('should return a number of total issues by project id', async () => {
      const projectId = faker.number.int();
      const mockCount = faker.number.int({ min: 0, max: 100 });

      MockIssueService.countByProjectId.mockResolvedValue(mockCount);

      const result = await projectController.countIssues(projectId);

      expect(MockIssueService.countByProjectId).toHaveBeenCalledTimes(1);
      expect(MockIssueService.countByProjectId).toHaveBeenCalledWith({
        projectId,
      });
      expect(result).toBeDefined();
    });
  });

  describe('updateOne', () => {
    it('should update a project successfully', async () => {
      const projectId = faker.number.int();
      const mockUpdatedProject = {
        id: projectId,
        name: faker.string.alphanumeric(10),
        description: faker.string.alphanumeric(20),
        updatedAt: faker.date.recent(),
      };

      MockProjectService.update.mockResolvedValue(mockUpdatedProject);

      const dto = new UpdateProjectRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.description = faker.string.alphanumeric(20);
      dto.timezone = {
        countryCode: faker.location.countryCode(),
        name: faker.location.timeZone(),
        offset: '+09:00',
      };

      const result = await projectController.updateOne(projectId, dto);

      expect(MockProjectService.update).toHaveBeenCalledTimes(1);
      expect(MockProjectService.update).toHaveBeenCalledWith({
        ...dto,
        projectId,
      });
      expect(result).toBeDefined();
    });

    it('should handle project update with minimal data', async () => {
      const projectId = faker.number.int();
      const mockUpdatedProject = {
        id: projectId,
        name: faker.string.alphanumeric(10),
        description: null,
        updatedAt: faker.date.recent(),
      };

      MockProjectService.update.mockResolvedValue(mockUpdatedProject);

      const dto = new UpdateProjectRequestDto();
      dto.name = faker.string.alphanumeric(10);
      dto.description = null;
      dto.timezone = {
        countryCode: faker.location.countryCode(),
        name: faker.location.timeZone(),
        offset: '+09:00',
      };

      const result = await projectController.updateOne(projectId, dto);

      expect(MockProjectService.update).toHaveBeenCalledTimes(1);
      expect(MockProjectService.update).toHaveBeenCalledWith({
        ...dto,
        projectId,
      });
      expect(result).toBeDefined();
    });
  });

  describe('Error Cases', () => {
    describe('create', () => {
      it('should handle service errors during project creation', async () => {
        const error = new Error('Project creation failed');
        MockProjectService.create.mockRejectedValue(error);

        const dto = new CreateProjectRequestDto();
        dto.name = faker.string.alphanumeric(10);
        dto.description = faker.string.alphanumeric(20);
        dto.timezone = {
          countryCode: faker.location.countryCode(),
          name: faker.location.timeZone(),
          offset: '+09:00',
        };

        await expect(projectController.create(dto)).rejects.toThrow(error);
        expect(MockProjectService.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('findOne', () => {
      it('should handle project not found error', async () => {
        const projectId = faker.number.int();
        const error = new Error('Project not found');
        MockProjectService.findById.mockRejectedValue(error);

        await expect(projectController.findOne(projectId)).rejects.toThrow(
          error,
        );
        expect(MockProjectService.findById).toHaveBeenCalledTimes(1);
      });
    });

    describe('updateOne', () => {
      it('should handle service errors during project update', async () => {
        const projectId = faker.number.int();
        const error = new Error('Project update failed');
        MockProjectService.update.mockRejectedValue(error);

        const dto = new UpdateProjectRequestDto();
        dto.name = faker.string.alphanumeric(10);
        dto.description = faker.string.alphanumeric(20);
        dto.timezone = {
          countryCode: faker.location.countryCode(),
          name: faker.location.timeZone(),
          offset: '+09:00',
        };

        await expect(
          projectController.updateOne(projectId, dto),
        ).rejects.toThrow(error);
        expect(MockProjectService.update).toHaveBeenCalledTimes(1);
      });
    });

    describe('delete', () => {
      it('should handle service errors during project deletion', async () => {
        const projectId = faker.number.int();
        const error = new Error('Project deletion failed');
        MockProjectService.deleteById.mockRejectedValue(error);

        await expect(projectController.delete(projectId)).rejects.toThrow(
          error,
        );
        expect(MockProjectService.deleteById).toHaveBeenCalledTimes(1);
      });
    });

    describe('countFeedbacks', () => {
      it('should handle service errors when counting feedbacks', async () => {
        const projectId = faker.number.int();
        const error = new Error('Failed to count feedbacks');
        MockFeedbackService.countByProjectId.mockRejectedValue(error);

        await expect(
          projectController.countFeedbacks(projectId),
        ).rejects.toThrow(error);
        expect(MockFeedbackService.countByProjectId).toHaveBeenCalledTimes(1);
      });
    });

    describe('countIssues', () => {
      it('should handle service errors when counting issues', async () => {
        const projectId = faker.number.int();
        const error = new Error('Failed to count issues');
        MockIssueService.countByProjectId.mockRejectedValue(error);

        await expect(projectController.countIssues(projectId)).rejects.toThrow(
          error,
        );
        expect(MockIssueService.countByProjectId).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Edge Cases', () => {
    describe('findAll', () => {
      it('should handle empty search results', async () => {
        const mockEmptyResult = {
          items: [],
          meta: {
            itemCount: 0,
            totalItems: 0,
            itemsPerPage: 10,
            totalPages: 0,
            currentPage: 1,
          },
        };

        MockProjectService.findAll.mockResolvedValue(mockEmptyResult);

        const dto = new FindProjectsRequestDto();
        dto.limit = 10;
        dto.page = 1;
        dto.searchText = 'nonexistent';

        const userDto = new UserDto();
        userDto.id = faker.number.int();
        userDto.type = 'SUPER' as any;

        const result = await projectController.findAll(dto, userDto);

        expect(MockProjectService.findAll).toHaveBeenCalledTimes(1);
        expect(result).toBeDefined();
      });

      it('should handle large page numbers', async () => {
        const mockResult = {
          items: [],
          meta: {
            itemCount: 0,
            totalItems: 0,
            itemsPerPage: 10,
            totalPages: 0,
            currentPage: 999,
          },
        };

        MockProjectService.findAll.mockResolvedValue(mockResult);

        const dto = new FindProjectsRequestDto();
        dto.limit = 10;
        dto.page = 999;

        const userDto = new UserDto();
        userDto.id = faker.number.int();
        userDto.type = 'SUPER' as any;

        const result = await projectController.findAll(dto, userDto);

        expect(MockProjectService.findAll).toHaveBeenCalledTimes(1);
        expect(result).toBeDefined();
      });
    });

    describe('checkName', () => {
      it('should handle empty string project name', async () => {
        const projectName = '';
        const mockResult = false;

        MockProjectService.checkName.mockResolvedValue(mockResult);

        const result = await projectController.checkName(projectName);

        expect(MockProjectService.checkName).toHaveBeenCalledTimes(1);
        expect(MockProjectService.checkName).toHaveBeenCalledWith(projectName);
        expect(result).toBe(mockResult);
      });

      it('should handle very long project name', async () => {
        const projectName = 'a'.repeat(100);
        const mockResult = false;

        MockProjectService.checkName.mockResolvedValue(mockResult);

        const result = await projectController.checkName(projectName);

        expect(MockProjectService.checkName).toHaveBeenCalledTimes(1);
        expect(MockProjectService.checkName).toHaveBeenCalledWith(projectName);
        expect(result).toBe(mockResult);
      });
    });
  });
});
