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

import { PaginationRequestDto, TimeRange } from '@/common/dtos';
import type { QueryV2ConditionsEnum, SortMethodEnum } from '@/common/enums';

class QueryV2 {
  @ApiProperty({
    required: false,
    type: TimeRange,
    example: { gte: '2023-01-01', lt: '2023-12-31' },
  })
  @IsOptional()
  createdAt?: TimeRange;

  @ApiProperty({
    required: false,
    type: TimeRange,
    example: { gte: '2023-01-01', lt: '2023-12-31' },
  })
  @IsOptional()
  updatedAt?: TimeRange;

  [key: string]: string | string[] | TimeRange | number | number[] | undefined;

  condition: QueryV2ConditionsEnum;
}

export class FindFeedbacksByChannelIdRequestDtoV2 extends PaginationRequestDto {
  @ApiProperty({
    required: false,
    description:
      "You can query by key-value with this object. (createdAt, updatedAt are kind of examples) If you want to search by text, you can use 'searchText' key.",
    type: [QueryV2],
  })
  @IsOptional()
  queries?: QueryV2[];

  @ApiProperty({
    required: false,
    description: "You can concatenate queries with 'AND' or 'OR' operators.",
  })
  @IsOptional()
  operator?: 'AND' | 'OR';

  @ApiProperty({
    required: false,
    description:
      "You can sort by specific feedback key with sort method values: 'ASC', 'DESC'",
    example: { createdAt: 'ASC' },
  })
  @IsOptional()
  sort?: Record<string, SortMethodEnum>;

  constructor(limit = 10, page = 1, queries?: QueryV2[]) {
    super(limit, page);
    this.queries = queries;
  }
}
