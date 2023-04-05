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
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateRoleRequestDto, UpdateRoleRequestDto } from './dtos/requests';
import {
  GetAllRoleResponseDto,
  GetRoleByIdResponseDto,
} from './dtos/responses';
import { PermissionEnum } from './permission.enum';
import { RequirePermission } from './require-permission.decorator';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOkResponse({ type: GetAllRoleResponseDto })
  @Get()
  @RequirePermission(PermissionEnum.RoleManagement)
  async getAllRole() {
    return GetAllRoleResponseDto.transform(
      await this.roleService.findAndCount(),
    );
  }

  @Post()
  @RequirePermission(PermissionEnum.RoleManagement)
  async createRole(@Body() body: CreateRoleRequestDto) {
    await this.roleService.createRole(body);
  }

  @ApiOkResponse({ type: GetRoleByIdResponseDto })
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return GetRoleByIdResponseDto.transform(
      await this.roleService.findById(id),
    );
  }

  @ApiParam({ name: 'id', type: String })
  @HttpCode(204)
  @Put(':id')
  @RequirePermission(PermissionEnum.RoleManagement)
  async updateRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleRequestDto,
  ) {
    await this.roleService.updateRole(id, body);
  }

  @Delete(':id')
  @RequirePermission(PermissionEnum.RoleManagement)
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteById(id);
  }
}
