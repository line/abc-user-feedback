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
import { IsOptional } from 'class-validator';

import type { TimeRange } from '@/common/dtos';
import { PaginationRequestDto } from '@/common/dtos';
import type { SortMethodEnum } from '@/common/enums';

class QueryV2 {}

export class FindIssuesByProjectIdRequestDtoV2 extends PaginationRequestDto {
  @ApiProperty({
    required: false,
    description:
      "You can query by key-value with this object. If you want to search by text, you can use 'searchText' key.",
    example: { name: 'issue name' },
  })
  @IsOptional()
  query?: {
    searchText?: string;
    [key: string]:
      | string
      | string[]
      | TimeRange
      | number
      | number[]
      | undefined;
  };

  @ApiProperty({
    required: false,
    description:
      "You can sort by specific feedback key with sort method values: 'ASC', 'DESC'",
    example: { createdAt: 'ASC' },
  })
  @IsOptional()
  sort?: Record<string, SortMethodEnum>;

  constructor(limit = 10, page = 1) {
    super(limit, page);
  }
}
