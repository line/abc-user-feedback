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
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '@/domains/admin/auth/guards';
import { CategoryService } from '../admin/project/category/category.service';
import { CreateCategoryDto } from '../admin/project/category/dtos/create-category.dto';
import { CreateCategoryRequestDto } from '../admin/project/category/dtos/requests/create-category-request.dto';
import { GetAllCategoriesRequestDto } from '../admin/project/category/dtos/requests/get-all-categories-request.dto';
import { UpdateCategoryRequestDto } from '../admin/project/category/dtos/requests/update-category-request.dto';
import { CreateCategoryResponseDto } from '../admin/project/category/dtos/responses/create-category-response.dto';
import { GetAllCategoriesResponseDto } from '../admin/project/category/dtos/responses/get-all-categories-response.dto';

@ApiTags('categories')
@Controller('/projects/:projectId/categories')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create Category',
    description: 'Create a new category within a project',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiBody({
    type: Object,
    description: 'Category name to create',
    examples: {
      'Create Category': {
        summary: 'Create Category',
        value: {
          name: 'category1',
        },
      },
    },
  })
  @ApiOkResponse({
    type: CreateCategoryResponseDto,
    description: 'Created category id',
    schema: {
      example: {
        id: 1,
      },
    },
  })
  @Post()
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateCategoryRequestDto,
  ) {
    return CreateCategoryResponseDto.transform(
      await this.categoryService.create(
        CreateCategoryDto.from({ ...body, projectId }),
      ),
    );
  }

  @ApiOperation({
    summary: 'Get All Categories by name',
    description: 'Get all categories by name within a project',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiBody({
    type: Object,
    description: 'Category name',
    examples: {
      'Category name to find': {
        summary: 'Category name to find',
        value: {
          categoryName: 'category1',
        },
      },
    },
  })
  @ApiOkResponse({
    type: GetAllCategoriesResponseDto,
    description: 'Found Categories',
    schema: {
      example: {
        items: [
          {
            id: 1,
            name: 'category1',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @Get()
  async findAll(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() body: GetAllCategoriesRequestDto,
  ) {
    return GetAllCategoriesResponseDto.transform(
      await this.categoryService.findAllByProjectId({
        projectId,
        ...body,
      }),
    );
  }

  @ApiOperation({
    summary: 'Update category name',
    description: 'Update existing category name',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'Category id',
    example: 1,
  })
  @ApiBody({
    type: Object,
    description: 'Category name',
    examples: {
      'Category name to update': {
        summary: 'Category name to update',
        value: {
          name: 'category2',
        },
      },
    },
  })
  @Put(':categoryId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: UpdateCategoryRequestDto,
  ) {
    await this.categoryService.update({ ...body, categoryId, projectId });
  }

  @ApiOperation({
    summary: 'Delete category',
    description: 'Delete existing category',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'Category id',
    example: 1,
  })
  @Delete(':categoryId')
  async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.categoryService.delete({ categoryId, projectId });
  }
}
