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
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '@/domains/admin/auth/guards';
import { FindProjectByIdResponseDto } from '../admin/project/project/dtos/responses/find-project-by-id-response.dto';
import { ProjectService } from '../admin/project/project/project.service';

@ApiTags('projects')
@Controller('/projects/:projectId')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({
    summary: 'Get Project Info',
    description: 'Retreives a project info by project id.',
  })
  @ApiParam({
    name: 'projectId',
    type: Number,
    description: 'Project id',
    example: 1,
  })
  @ApiOkResponse({
    type: FindProjectByIdResponseDto,
    description: 'Project info',
  })
  @ApiOkResponse({ type: FindProjectByIdResponseDto })
  @Get('/')
  async getProjectInfo(@Param('projectId', ParseIntPipe) projectId: number) {
    return FindProjectByIdResponseDto.transform(
      await this.projectService.findById({ projectId }),
    );
  }
}