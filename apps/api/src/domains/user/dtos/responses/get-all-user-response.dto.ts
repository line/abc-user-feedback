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
import { Expose, Transform, Type, plainToInstance } from 'class-transformer';

import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

export class GetAllUserResponse {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => obj.role?.name)
  roleName?: string;
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
