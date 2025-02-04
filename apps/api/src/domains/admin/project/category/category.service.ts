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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { paginateHelper } from '@/common/helper/paginate.helper';
import { CategoryEntity } from './category.entity';
import {
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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  @Transactional()
  async create(dto: CreateCategoryDto) {
    const category = CreateCategoryDto.toCategoryEntity(dto);

    const duplicateCategory = await this.repository.findOneBy({
      name: category.name,
      project: {
        id: category.project.id,
      },
    });

    if (duplicateCategory) throw new CategoryNameDuplicatedException();

    const savedCategory = await this.repository.save(category);

    return savedCategory;
  }

  async findAllByProjectId(
    dto: FindAllCategoriesByProjectIdDto,
  ): Promise<Pagination<CategoryEntity, IPaginationMeta>> {
    return await paginateHelper(
      this.repository.createQueryBuilder(),
      {
        where: { project: { id: dto.projectId } },
      },
      {
        page: dto.page,
        limit: dto.limit,
      },
    );
  }

  async findById({ categoryId }: FindByCategoryIdDto) {
    const category = await this.repository.findOne({
      where: { id: categoryId },
      relations: { project: true },
    });
    if (!category) throw new CategoryNotFoundException();

    return category;
  }

  @Transactional()
  async update(dto: UpdateCategoryDto) {
    const { name, categoryId } = dto;
    const category = await this.findById({ categoryId });

    if (
      await this.repository.findOne({
        where: {
          name,
          id: Not(categoryId),
          project: { id: category.project.id },
        },
        select: ['id'],
      })
    ) {
      throw new CategoryNameInvalidException('Invalid name');
    }

    const updatedCategory = await this.repository.save(
      Object.assign(category, dto),
    );

    return updatedCategory;
  }
}
