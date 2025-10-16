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
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { SortMethodEnum } from '@/common/enums';
import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dtos/requests';
import { GetAllCategoriesRequestDto } from './dtos/requests/get-all-categories-request.dto';
import { UpdateCategoryRequestDto } from './dtos/requests/update-category-request.dto';
import { CreateCategoryResponseDto } from './dtos/responses';
import { GetAllCategoriesResponseDto } from './dtos/responses/get-all-categories-response.dto';

const MockCategoryService = {
  create: jest.fn(),
  findAllByProjectId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CategoryController', () => {
  let categoryController: CategoryController;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        getMockProvider(CategoryService, MockCategoryService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
  });

  describe('create', () => {
    it('should create category successfully', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();
      const body = new CreateCategoryRequestDto();
      body.name = faker.string.sample();

      const mockCategory = {
        id: categoryId,
        name: body.name,
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(MockCategoryService, 'create').mockResolvedValue(mockCategory);

      const result = await categoryController.create(projectId, body);

      expect(MockCategoryService.create).toHaveBeenCalledWith({
        projectId,
        name: body.name,
      });
      expect(result).toBeInstanceOf(CreateCategoryResponseDto);
      expect(result.id).toBe(categoryId);
    });

    it('should handle service errors in create', async () => {
      const projectId = faker.number.int();
      const body = new CreateCategoryRequestDto();
      body.name = faker.string.sample();

      jest
        .spyOn(MockCategoryService, 'create')
        .mockRejectedValue(
          new BadRequestException('Category name already exists'),
        );

      await expect(categoryController.create(projectId, body)).rejects.toThrow(
        'Category name already exists',
      );

      expect(MockCategoryService.create).toHaveBeenCalledWith({
        projectId,
        name: body.name,
      });
    });
  });

  describe('findAll', () => {
    it('should find all categories successfully', async () => {
      const projectId = faker.number.int();
      const body = new GetAllCategoriesRequestDto();
      body.page = faker.number.int({ min: 1, max: 10 });
      body.limit = faker.number.int({ min: 1, max: 100 });
      body.categoryName = faker.string.sample();
      body.sort = { name: SortMethodEnum.ASC };

      const mockResult = {
        items: [
          {
            id: faker.number.int(),
            name: faker.string.sample(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: body.limit,
          totalPages: 1,
          currentPage: body.page,
        },
      };

      jest
        .spyOn(MockCategoryService, 'findAllByProjectId')
        .mockResolvedValue(mockResult);

      const result = await categoryController.findAll(projectId, body);

      expect(MockCategoryService.findAllByProjectId).toHaveBeenCalledWith({
        projectId,
        page: body.page,
        limit: body.limit,
        categoryName: body.categoryName,
        sort: body.sort,
      });
      expect(result).toBeInstanceOf(GetAllCategoriesResponseDto);
      expect(result.items).toHaveLength(1);
    });

    it('should find all categories with default pagination', async () => {
      const projectId = faker.number.int();
      const body = new GetAllCategoriesRequestDto();
      body.page = 1;
      body.limit = 10;

      const mockResult = {
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
        .spyOn(MockCategoryService, 'findAllByProjectId')
        .mockResolvedValue(mockResult);

      const result = await categoryController.findAll(projectId, body);

      expect(MockCategoryService.findAllByProjectId).toHaveBeenCalledWith({
        projectId,
        page: 1,
        limit: 10,
        categoryName: undefined,
        sort: undefined,
      });
      expect(result).toBeInstanceOf(GetAllCategoriesResponseDto);
      expect(result.items).toHaveLength(0);
    });

    it('should handle service errors in findAll', async () => {
      const projectId = faker.number.int();
      const body = new GetAllCategoriesRequestDto();
      body.page = 1;
      body.limit = 10;

      jest
        .spyOn(MockCategoryService, 'findAllByProjectId')
        .mockRejectedValue(new BadRequestException('Invalid sort method'));

      await expect(categoryController.findAll(projectId, body)).rejects.toThrow(
        'Invalid sort method',
      );

      expect(MockCategoryService.findAllByProjectId).toHaveBeenCalledWith({
        projectId,
        page: 1,
        limit: 10,
        categoryName: undefined,
        sort: undefined,
      });
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();
      const body = new UpdateCategoryRequestDto();
      body.name = faker.string.sample();

      jest.spyOn(MockCategoryService, 'update').mockResolvedValue(undefined);

      await categoryController.update(projectId, categoryId, body);

      expect(MockCategoryService.update).toHaveBeenCalledWith({
        categoryId,
        projectId,
        name: body.name,
      });
    });

    it('should handle service errors in update', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();
      const body = new UpdateCategoryRequestDto();
      body.name = faker.string.sample();

      jest
        .spyOn(MockCategoryService, 'update')
        .mockRejectedValue(new BadRequestException('Category not found'));

      await expect(
        categoryController.update(projectId, categoryId, body),
      ).rejects.toThrow('Category not found');

      expect(MockCategoryService.update).toHaveBeenCalledWith({
        categoryId,
        projectId,
        name: body.name,
      });
    });
  });

  describe('delete', () => {
    it('should delete category successfully', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();

      jest.spyOn(MockCategoryService, 'delete').mockResolvedValue(undefined);

      await categoryController.delete(projectId, categoryId);

      expect(MockCategoryService.delete).toHaveBeenCalledWith({
        categoryId,
        projectId,
      });
    });

    it('should handle service errors in delete', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();

      jest
        .spyOn(MockCategoryService, 'delete')
        .mockRejectedValue(new BadRequestException('Category not found'));

      await expect(
        categoryController.delete(projectId, categoryId),
      ).rejects.toThrow('Category not found');

      expect(MockCategoryService.delete).toHaveBeenCalledWith({
        categoryId,
        projectId,
      });
    });
  });

  describe('Error Cases', () => {
    it('should handle validation errors in create', async () => {
      const projectId = faker.number.int();
      const body = new CreateCategoryRequestDto();
      body.name = ''; // Invalid empty name

      jest
        .spyOn(MockCategoryService, 'create')
        .mockRejectedValue(new BadRequestException('Name is required'));

      await expect(categoryController.create(projectId, body)).rejects.toThrow(
        'Name is required',
      );
    });

    it('should handle validation errors in update', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();
      const body = new UpdateCategoryRequestDto();
      body.name = 'a'.repeat(256); // Invalid too long name

      jest
        .spyOn(MockCategoryService, 'update')
        .mockRejectedValue(new BadRequestException('Name is too long'));

      await expect(
        categoryController.update(projectId, categoryId, body),
      ).rejects.toThrow('Name is too long');
    });

    it('should handle database errors in findAll', async () => {
      const projectId = faker.number.int();
      const body = new GetAllCategoriesRequestDto();
      body.page = 1;
      body.limit = 10;

      jest
        .spyOn(MockCategoryService, 'findAllByProjectId')
        .mockRejectedValue(
          new BadRequestException('Database connection error'),
        );

      await expect(categoryController.findAll(projectId, body)).rejects.toThrow(
        'Database connection error',
      );
    });

    it('should handle concurrent modification errors in update', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();
      const body = new UpdateCategoryRequestDto();
      body.name = faker.string.sample();

      jest
        .spyOn(MockCategoryService, 'update')
        .mockRejectedValue(
          new BadRequestException('Category was modified by another user'),
        );

      await expect(
        categoryController.update(projectId, categoryId, body),
      ).rejects.toThrow('Category was modified by another user');
    });

    it('should handle foreign key constraint errors in delete', async () => {
      const projectId = faker.number.int();
      const categoryId = faker.number.int();

      jest
        .spyOn(MockCategoryService, 'delete')
        .mockRejectedValue(
          new BadRequestException(
            'Cannot delete category with associated issues',
          ),
        );

      await expect(
        categoryController.delete(projectId, categoryId),
      ).rejects.toThrow('Cannot delete category with associated issues');
    });
  });
});
