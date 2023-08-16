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
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PermissionEnum } from '@/domains/project/role/permission.enum';

class RoleProjectDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  deletedAt: string | null;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;
}

class RoleItemDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  deletedAt: string | null;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: [PermissionEnum], enum: PermissionEnum })
  @Expose()
  permissions: PermissionEnum[];

  @ApiProperty({ type: RoleProjectDto })
  @Expose()
  @Type(() => RoleProjectDto)
  project: RoleProjectDto;
}

export class GetRolesByIdResponseDto {
  @ApiProperty({ type: [RoleItemDto] })
  @Expose()
  @Type(() => RoleItemDto)
  roles: RoleItemDto[];
}
