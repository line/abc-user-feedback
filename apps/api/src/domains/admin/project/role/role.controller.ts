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
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateRoleRequestDto, UpdateRoleRequestDto } from './dtos/requests';
import { GetAllRoleResponseDto } from './dtos/responses';
import { PermissionEnum } from './permission.enum';
import { RequirePermission } from './require-permission.decorator';
import { RoleService } from './role.service';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('/admin/projects/:projectId/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermission(PermissionEnum.project_role_read)
  @ApiOkResponse({ type: GetAllRoleResponseDto })
  @Get('/')
  async getAllRolesByProjectId(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return GetAllRoleResponseDto.transform(
      await this.roleService.findByProjectId(projectId),
    );
  }

  @RequirePermission(PermissionEnum.project_role_create)
  @Post('/')
  async createRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateRoleRequestDto,
  ) {
    await this.roleService.create({ ...body, projectId });
  }

  @RequirePermission(PermissionEnum.project_role_update)
  @HttpCode(204)
  @Put('/:roleId')
  async updateRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: UpdateRoleRequestDto,
  ) {
    await this.roleService.update(roleId, projectId, body);
  }

  @ApiParam({ name: 'projectId', type: Number })
  @RequirePermission(PermissionEnum.project_role_delete)
  @Delete('/:roleId')
  async deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
    await this.roleService.deleteById(roleId);
  }
}
