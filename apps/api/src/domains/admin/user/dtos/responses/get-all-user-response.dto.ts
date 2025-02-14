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

import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { SignUpMethodEnum, UserTypeEnum } from '../../entities/enums';

class ProjectDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;
}
class RoleDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  @Type(() => ProjectDto)
  project: ProjectDto;
}
class MemberDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  @Type(() => RoleDto)
  role: RoleDto;
}
class GetAllUserResponse {
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
  @ApiProperty({ nullable: true, type: String })
  department: string | null;

  @Expose()
  @ApiProperty({ enum: UserTypeEnum })
  type: UserTypeEnum;

  @Expose()
  @ApiProperty({ type: [MemberDto] })
  @Type(() => MemberDto)
  members: MemberDto[];

  @Expose()
  @ApiProperty()
  createdAt: Date;
  @ApiProperty({ enum: SignUpMethodEnum })
  @Expose()
  signUpMethod: SignUpMethodEnum;
}

export class GetAllUserResponseDto extends PaginationResponseDto<GetAllUserResponse> {
  @Expose()
  @ApiProperty({ type: [GetAllUserResponse] })
  @Type(() => GetAllUserResponse)
  items: GetAllUserResponse[];

  public static transform(params: any) {
    return plainToInstance(GetAllUserResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
