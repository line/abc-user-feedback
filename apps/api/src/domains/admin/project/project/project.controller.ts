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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/domains/admin/auth/guards';
import { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import { CurrentUser } from '@/domains/admin/user/decorators';
import { UserDto } from '@/domains/admin/user/dtos';
import { SuperUser } from '@/domains/admin/user/super-user.decorator';
import { IssueService } from '../issue/issue.service';
import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import {
  CreateProjectRequestDto,
  FindProjectsRequestDto,
  UpdateProjectRequestDto,
} from './dtos/requests';
import {
  CountFeedbacksByIdResponseDto,
  CountIssuesByIdResponseDto,
  CreateProjectResponseDto,
  FindProjectByIdResponseDto,
  FindProjectsResponseDto,
  UpdateProjectResponseDto,
} from './dtos/responses';
import { ProjectService } from './project.service';

@ApiTags('project')
@Controller('/admin/projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly feedbackService: FeedbackService,
    private readonly issueService: IssueService,
  ) {}

  @SuperUser()
  @ApiCreatedResponse({ type: CreateProjectResponseDto })
  @Post()
  async create(@Body() body: CreateProjectRequestDto) {
    return CreateProjectResponseDto.transform(
      await this.projectService.create(body),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: FindProjectsResponseDto })
  @Get()
  async findAll(
    @Query() query: FindProjectsRequestDto,
    @CurrentUser() user: UserDto,
  ) {
    const { limit, page, searchText } = query;
    return FindProjectsResponseDto.transform(
      await this.projectService.findAll({
        user,
        options: { limit, page },
        searchText,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/name-check')
  async checkName(@Query('name') name: string) {
    return this.projectService.checkName(name);
  }

  @RequirePermission(PermissionEnum.project_read)
  @ApiOkResponse({ type: FindProjectByIdResponseDto })
  @Get('/:projectId')
  async findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    return FindProjectByIdResponseDto.transform(
      await this.projectService.findById({ projectId }),
    );
  }

  @ApiOkResponse({ type: CountFeedbacksByIdResponseDto })
  @Get('/:projectId/feedback-count')
  async countFeedbacks(@Param('projectId', ParseIntPipe) projectId: number) {
    return CountFeedbacksByIdResponseDto.transform(
      await this.feedbackService.countByProjectId({ projectId }),
    );
  }

  @ApiOkResponse({ type: CountIssuesByIdResponseDto })
  @Get(':projectId/issue-count')
  async countIssues(@Param('projectId', ParseIntPipe) projectId: number) {
    return CountIssuesByIdResponseDto.transform(
      await this.issueService.countByProjectId({ projectId }),
    );
  }

  @RequirePermission(PermissionEnum.project_update)
  @ApiOkResponse({ type: UpdateProjectResponseDto })
  @Put('/:projectId')
  async updateOne(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: UpdateProjectRequestDto,
  ) {
    return UpdateProjectResponseDto.transform(
      await this.projectService.update({ ...body, projectId }),
    );
  }

  @RequirePermission(PermissionEnum.project_delete)
  @Delete('/:projectId')
  async delete(@Param('projectId', ParseIntPipe) projectId: number) {
    await this.projectService.deleteById(projectId);
  }
}
