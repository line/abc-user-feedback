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

import { PaginationResponseDto } from '@/common/dtos';
import { PermissionEnum } from '@/domains/admin/project/role/permission.enum';

class MemberRoleDto {
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
class MemberUserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  department: string;
}

class GetAllMember {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ type: MemberUserDto })
  @Type(() => MemberUserDto)
  user: MemberUserDto;

  @Expose()
  @ApiProperty({ type: MemberRoleDto })
  @Type(() => MemberRoleDto)
  role: MemberRoleDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
export class GetAllMemberResponseDto extends PaginationResponseDto<GetAllMember> {
  @Expose()
  @ApiProperty({ type: [GetAllMember] })
  @Type(() => GetAllMember)
  items: GetAllMember[];

  public static transform(params: any) {
    return plainToInstance(GetAllMemberResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
