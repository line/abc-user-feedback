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
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProjectService } from '../services/project.service';
import {
  CreateProjectRequestDto,
  FindProjectsRequestDto,
  UpdateProjectRequestDto,
} from './dtos/requests';
import {
  CreateProjectResponseDto,
  FindProjectByIdResponseDto,
  FindProjectsResponseDto,
  UpdateProjectResponseDto,
} from './dtos/responses';

@ApiTags('project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiCreatedResponse({ type: CreateProjectResponseDto })
  @Post()
  async create(@Body() body: CreateProjectRequestDto) {
    return CreateProjectResponseDto.transform(
      await this.projectService.create(body),
    );
  }

  @ApiOkResponse({ type: FindProjectsResponseDto })
  @Get()
  async findAll(@Query() query: FindProjectsRequestDto) {
    const { limit, page, keyword } = query;
    return FindProjectsResponseDto.transform(
      await this.projectService.findAll({ options: { limit, page }, keyword }),
    );
  }

  @ApiOkResponse({ type: FindProjectByIdResponseDto })
  @Get(':id')
  async findOne(@Param('id') projectId: string) {
    return FindProjectByIdResponseDto.transform(
      await this.projectService.findById({ projectId }),
    );
  }

  @ApiOkResponse({ type: UpdateProjectResponseDto })
  @Put(':id')
  async updateOne(
    @Param('id') projectId: string,
    @Body() body: UpdateProjectRequestDto,
  ) {
    return UpdateProjectResponseDto.transform(
      await this.projectService.update({ ...body, projectId }),
    );
  }
}
