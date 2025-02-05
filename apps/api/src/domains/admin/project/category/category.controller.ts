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
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dtos/requests';
import { GetAllCategoriesRequestDto } from './dtos/requests/get-all-categories-request.dto';
import {
  CreateCategoryResponseDto,
  GetAllCategoriesResponseDto,
} from './dtos/responses';

@ApiTags('categories')
@Controller('/admin/projects/:projectId/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiParam({ name: 'projectId', type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreateCategoryResponseDto })
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

  @ApiParam({ name: 'projectId', type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: GetAllCategoriesResponseDto })
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

  @ApiParam({ name: 'projectId', type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':categoryId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: UpdateCategoryRequestDto,
  ) {
    await this.categoryService.update({ ...body, categoryId, projectId });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':categoryId')
  async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.categoryService.delete({ categoryId, projectId });
  }
}
