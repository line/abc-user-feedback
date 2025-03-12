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

import { ApiKeyAuthGuard } from '../admin/auth/guards';
import { CreateIssueDto } from '../admin/project/issue/dtos';
import {
  CreateIssueRequestDto,
  DeleteIssuesRequestDto,
  FindIssuesByProjectIdRequestDto,
  UpdateIssueRequestDto,
} from '../admin/project/issue/dtos/requests';
import {
  CreateIssueResponseDto,
  FindIssueByIdResponseDto,
  FindIssuesByProjectIdResponseDto,
} from '../admin/project/issue/dtos/responses';
import { IssueService } from '../admin/project/issue/issue.service';

@ApiTags('issues')
@Controller('/projects/:projectId/issues')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @ApiOperation({
    summary: 'Create Issue',
    description: 'Creates a new issue for the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiBody({ type: CreateIssueRequestDto })
  @ApiOkResponse({ type: CreateIssueResponseDto })
  @Post()
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateIssueRequestDto,
  ) {
    return CreateIssueResponseDto.transform(
      await this.issueService.create(
        CreateIssueDto.from({ ...body, projectId }),
      ),
    );
  }

  @ApiOperation({
    summary: 'Find Issue by ID',
    description:
      'Retrieves a specific issue by its id within the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'issueId',
    type: Number,
    description: 'Issue id',
    example: 1,
  })
  @ApiOkResponse({ type: [FindIssueByIdResponseDto] })
  @Get(':issueId')
  async findById(@Param('issueId', ParseIntPipe) issueId: number) {
    return FindIssueByIdResponseDto.transform(
      await this.issueService.findById({ issueId }),
    );
  }

  @ApiOperation({
    summary: 'Search Issues by Project',
    description:
      'Searches for all issues within the specified project, with the various filters.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiOkResponse({ type: FindIssuesByProjectIdResponseDto })
  @Post('search')
  async findAllByProjectId(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: FindIssuesByProjectIdRequestDto,
  ) {
    return FindIssuesByProjectIdResponseDto.transform(
      await this.issueService.findIssuesByProjectId({
        ...body,
        projectId,
      }),
    );
  }

  @ApiOperation({
    summary: 'Update Issue',
    description:
      'Updates an existing issue with new information within the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'issueId',
    type: Number,
    description: 'Issue id',
    example: 1,
  })
  @Put(':issueId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: UpdateIssueRequestDto,
  ) {
    await this.issueService.update({ ...body, issueId, projectId });
  }

  @ApiOperation({
    summary: 'Delete Issue',
    description:
      'Deletes a specific issue by its id from the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'issueId',
    type: Number,
    description: 'Issue id',
    example: 1,
  })
  @Delete(':issueId')
  async delete(@Param('issueId', ParseIntPipe) issueId: number) {
    await this.issueService.deleteById(issueId);
  }

  @ApiOperation({
    summary: 'Delete Multiple Issues',
    description:
      'Deletes multiple issues from the specified project, based on an array of issue ids.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @Delete('')
  async deleteMany(
    @Param('projectId', ParseIntPipe) _: number,
    @Body() { issueIds }: DeleteIssuesRequestDto,
  ) {
    await this.issueService.deleteByIds(issueIds);
  }

  @ApiOperation({
    summary: 'Add Category to Issue',
    description: 'Add a new category to an issue within the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'issueId',
    type: Number,
    description: 'Issue id',
    example: 1,
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'Category id',
    example: 1,
  })
  @Put(':issueId/category/:categoryId')
  async updateByCategoryId(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.issueService.updateByCategoryId({
      issueId,
      categoryId,
    });
  }

  @ApiOperation({
    summary: 'Remove Category from Issue',
    description:
      'Remove a category from the specified issue within the specified project.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiParam({
    name: 'issueId',
    type: Number,
    description: 'Issue id',
    example: 1,
  })
  @ApiParam({
    name: 'categoryId',
    type: Number,
    description: 'Category id',
    example: 1,
  })
  @Delete(':issueId/category/:categoryId')
  async deleteByCategoryId(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.issueService.deleteByCategoryId({
      issueId,
      categoryId,
    });
  }
}
