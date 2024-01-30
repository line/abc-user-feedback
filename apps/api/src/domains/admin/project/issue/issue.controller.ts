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
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import { CreateIssueDto } from './dtos';
import {
  CreateIssueRequestDto,
  DeleteIssuesRequestDto,
  FindIssuesByProjectIdRequestDto,
  UpdateIssueRequestDto,
} from './dtos/requests';
import {
  CreateIssueResponseDto,
  FindIssueByIdResponseDto,
  FindIssuesByProjectIdResponseDto,
} from './dtos/responses';
import { IssueService } from './issue.service';

@ApiTags('issues')
@Controller('/admin/projects/:projectId/issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.issue_create)
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

  @ApiParam({ name: 'projectId', type: Number })
  @ApiOkResponse({ type: [FindIssueByIdResponseDto] })
  @Get(':issueId')
  async findById(@Param('issueId', ParseIntPipe) issueId: number) {
    return FindIssueByIdResponseDto.transform(
      await this.issueService.findById({ issueId }),
    );
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.issue_read)
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

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.issue_update)
  @Put(':issueId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() body: UpdateIssueRequestDto,
  ) {
    await this.issueService.update({ ...body, issueId, projectId });
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.issue_delete)
  @Delete(':issueId')
  async delete(@Param('issueId', ParseIntPipe) issueId: number) {
    await this.issueService.deleteById(issueId);
  }

  @RequirePermission(PermissionEnum.issue_delete)
  @Delete('')
  async deleteMany(
    @Param('projectId', ParseIntPipe) _: number,
    @Body() { issueIds }: DeleteIssuesRequestDto,
  ) {
    await this.issueService.deleteByIds(issueIds);
  }
}
