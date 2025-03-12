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
import { IsOptional, IsString } from 'class-validator';

import { PaginationRequestDto, TimeRange } from '@/common/dtos';
import { QueryV2ConditionsEnum } from '@/common/enums';

class MemberSearchQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ required: false, type: TimeRange })
  @IsOptional()
  createdAt?: TimeRange;

  condition: QueryV2ConditionsEnum;
}

export class GetAllMemberRequestDto extends PaginationRequestDto {
  @ApiProperty({ required: false, type: [MemberSearchQuery] })
  @IsOptional()
  queries?: MemberSearchQuery[];

  @ApiProperty({ required: false })
  @IsOptional()
  operator?: 'AND' | 'OR';
}
