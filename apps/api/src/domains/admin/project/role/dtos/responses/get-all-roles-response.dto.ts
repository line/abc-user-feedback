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
import { Expose, plainToInstance, Type } from 'class-transformer';

import { PermissionEnum } from '../../permission.enum';

export class GetAllRolesResponseRoleDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({
    type: [PermissionEnum],
    enum: PermissionEnum,
    enumName: 'PermissionEnum',
  })
  permissions: PermissionEnum[];
}

export class GetAllRolesResponseDto {
  @Expose()
  @ApiProperty({ type: [GetAllRolesResponseRoleDto] })
  @Type(() => GetAllRolesResponseRoleDto)
  roles: GetAllRolesResponseRoleDto[];

  @Expose()
  @ApiProperty()
  total: number;

  public static transform(plain: unknown): GetAllRolesResponseDto {
    return plainToInstance(GetAllRolesResponseDto, plain, {
      excludeExtraneousValues: true,
    });
  }
}
