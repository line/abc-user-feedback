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
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import type { Repository } from 'typeorm';

import { SortMethodEnum } from '@/common/enums';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import type {
  CreateCategoryDto,
  FindAllCategoriesByProjectIdDto,
  FindByCategoryIdDto,
  UpdateCategoryDto,
} from './dtos';
import {
  CategoryNameDuplicatedException,
  CategoryNameInvalidException,
  CategoryNotFoundException,
} from './exceptions';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<Repository<CategoryEntity>>;

  const mockCategory = {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.word.words(2),
    project: {
      id: faker.number.int({ min: 1, max: 1000 }),
    },
    issues: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    beforeInsertHook: jest.fn(),
    beforeUpdateHook: jest.fn(),
  } as unknown as CategoryEntity;

  beforeEach(async () => {
    const mockQueryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getCount: jest.fn(),
    };

    const module = await Test.createTestingModule({
      imports: [ClsModule],
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get(getRepositoryToken(CategoryEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const createDto: CreateCategoryDto = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        name: faker.word.words(2),
      };

      repository.findOneBy.mockResolvedValue(null);
      repository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: createDto.name,
        project: { id: createDto.projectId },
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should throw CategoryNameDuplicatedException when category name already exists', async () => {
      const createDto: CreateCategoryDto = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        name: faker.word.words(2),
      };

      repository.findOneBy.mockResolvedValue(mockCategory);

      await expect(service.create(createDto)).rejects.toThrow(
        CategoryNameDuplicatedException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAllByProjectId', () => {
    it('should find all categories by project ID', async () => {
      const findAllDto: FindAllCategoriesByProjectIdDto = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        page: 1,
        limit: 10,
      };

      const mockCategories = [mockCategory];
      const totalCount = 1;

      const mockQueryBuilder =
        repository.createQueryBuilder as unknown as jest.MockedFunction<
          () => {
            leftJoin: jest.Mock;
            where: jest.Mock;
            andWhere: jest.Mock;
            addOrderBy: jest.Mock;
            offset: jest.Mock;
            limit: jest.Mock;
            getMany: jest.Mock;
            getCount: jest.Mock;
          }
        >;
      mockQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCategories),
        getCount: jest.fn().mockResolvedValue(totalCount),
      });

      const result = await service.findAllByProjectId(findAllDto);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('category');
      expect(result.items).toEqual(mockCategories);
      expect(result.meta.totalItems).toBe(totalCount);
    });

    it('should filter by category name', async () => {
      const findAllDto: FindAllCategoriesByProjectIdDto = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        categoryName: 'test',
        page: 1,
        limit: 10,
      };

      const mockCategories = [mockCategory];
      const totalCount = 1;

      const mockQueryBuilder =
        repository.createQueryBuilder as unknown as jest.MockedFunction<
          () => {
            leftJoin: jest.Mock;
            where: jest.Mock;
            andWhere: jest.Mock;
            addOrderBy: jest.Mock;
            offset: jest.Mock;
            limit: jest.Mock;
            getMany: jest.Mock;
            getCount: jest.Mock;
          }
        >;
      mockQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCategories),
        getCount: jest.fn().mockResolvedValue(totalCount),
      });

      const result = await service.findAllByProjectId(findAllDto);

      expect(result.items).toEqual(mockCategories);
    });

    it('should sort by name', async () => {
      const findAllDto: FindAllCategoriesByProjectIdDto = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        page: 1,
        limit: 10,
        sort: { name: SortMethodEnum.ASC },
      };

      const mockCategories = [mockCategory];
      const totalCount = 1;

      const mockQueryBuilder =
        repository.createQueryBuilder as unknown as jest.MockedFunction<
          () => {
            leftJoin: jest.Mock;
            where: jest.Mock;
            andWhere: jest.Mock;
            addOrderBy: jest.Mock;
            offset: jest.Mock;
            limit: jest.Mock;
            getMany: jest.Mock;
            getCount: jest.Mock;
          }
        >;
      mockQueryBuilder.mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCategories),
        getCount: jest.fn().mockResolvedValue(totalCount),
      });

      const result = await service.findAllByProjectId(findAllDto);

      expect(result.items).toEqual(mockCategories);
    });

    it('should throw BadRequestException for invalid sort method', async () => {
      const findAllDto: FindAllCategoriesByProjectIdDto = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        page: 1,
        limit: 10,
        sort: { name: 'INVALID' as any },
      };

      await expect(service.findAllByProjectId(findAllDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findById', () => {
    it('should find category by ID', async () => {
      const findDto: FindByCategoryIdDto = {
        categoryId: faker.number.int({ min: 1, max: 1000 }),
      };

      repository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findById(findDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: findDto.categoryId },
        relations: { project: true },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw CategoryNotFoundException when category not found', async () => {
      const findDto: FindByCategoryIdDto = {
        categoryId: faker.number.int({ min: 1, max: 1000 }),
      };

      repository.findOne.mockResolvedValue(null);

      await expect(service.findById(findDto)).rejects.toThrow(
        CategoryNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      const updateDto: UpdateCategoryDto = {
        categoryId: faker.number.int({ min: 1, max: 1000 }),
        name: faker.word.words(2),
        projectId: faker.number.int({ min: 1, max: 1000 }),
      };

      const existingCategory = {
        ...mockCategory,
        project: { id: updateDto.projectId },
        beforeInsertHook: jest.fn(),
        beforeUpdateHook: jest.fn(),
      } as unknown as CategoryEntity;
      repository.findOne.mockResolvedValueOnce(existingCategory); // findById call
      repository.findOne.mockResolvedValueOnce(null); // duplicate check
      repository.save.mockResolvedValue({
        ...existingCategory,
        ...updateDto,
        beforeInsertHook: jest.fn(),
        beforeUpdateHook: jest.fn(),
      } as unknown as CategoryEntity);

      const result = await service.update(updateDto);

      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(repository.save).toHaveBeenCalledWith(
        Object.assign(existingCategory, updateDto),
      );
      expect(result).toEqual({
        ...existingCategory,
        ...updateDto,
        beforeInsertHook: expect.any(Function),
        beforeUpdateHook: expect.any(Function),
      });
    });

    it('should throw CategoryNameInvalidException when category name already exists', async () => {
      const updateDto: UpdateCategoryDto = {
        categoryId: faker.number.int({ min: 1, max: 1000 }),
        name: faker.word.words(2),
        projectId: faker.number.int({ min: 1, max: 1000 }),
      };

      const existingCategory = {
        ...mockCategory,
        project: { id: updateDto.projectId },
        beforeInsertHook: jest.fn(),
        beforeUpdateHook: jest.fn(),
      } as unknown as CategoryEntity;
      repository.findOne.mockResolvedValueOnce(existingCategory); // findById call
      repository.findOne.mockResolvedValueOnce(mockCategory); // duplicate check

      await expect(service.update(updateDto)).rejects.toThrow(
        CategoryNameInvalidException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete category successfully', async () => {
      const deleteParams = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        categoryId: faker.number.int({ min: 1, max: 1000 }),
      };

      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.delete(deleteParams);

      expect(repository.delete).toHaveBeenCalledWith({
        id: deleteParams.categoryId,
        project: { id: deleteParams.projectId },
      });
    });

    it('should throw CategoryNotFoundException when category to delete not found', async () => {
      const deleteParams = {
        projectId: faker.number.int({ min: 1, max: 1000 }),
        categoryId: faker.number.int({ min: 1, max: 1000 }),
      };

      repository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(deleteParams)).rejects.toThrow(
        CategoryNotFoundException,
      );
    });
  });
});
