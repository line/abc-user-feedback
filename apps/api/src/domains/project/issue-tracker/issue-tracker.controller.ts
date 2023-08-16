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
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import {
  CreateIssueTrackerRequestDto,
  UpdateIssueTrackerRequestDto,
} from './dtos/requests';
import {
  CreateIssueTrackerResponseDto,
  FindIssueTrackersResponseDto,
  UpdateIssueTrackerResponseDto,
} from './dtos/responses';
import { IssueTrackerService } from './issue-tracker.service';

@ApiTags('issue-tracker')
@Controller('/projects/:projectId/issue-tracker')
export class IssueTrackerController {
  constructor(private readonly issueTrackerService: IssueTrackerService) {}

  @RequirePermission(PermissionEnum.project_tracker_update)
  @ApiCreatedResponse({ type: CreateIssueTrackerResponseDto })
  @Post()
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateIssueTrackerRequestDto,
  ) {
    return CreateIssueTrackerResponseDto.transform(
      await this.issueTrackerService.create({ projectId, ...body }),
    );
  }

  @RequirePermission(PermissionEnum.project_tracker_read)
  @ApiOkResponse({ type: FindIssueTrackersResponseDto })
  @Get()
  async findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    return FindIssueTrackersResponseDto.transform(
      await this.issueTrackerService.findByProjectId(projectId),
    );
  }

  @RequirePermission(PermissionEnum.project_tracker_update)
  @ApiOkResponse({ type: UpdateIssueTrackerResponseDto })
  @Put()
  async updateOne(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: UpdateIssueTrackerRequestDto,
  ) {
    return UpdateIssueTrackerResponseDto.transform(
      await this.issueTrackerService.update({ projectId, ...body }),
    );
  }
}
