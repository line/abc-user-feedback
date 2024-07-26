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
import type { SortMethodEnum } from '@/common/enums';

class Query {
  @ApiProperty({
    required: false,
    description: 'Search text for feedback data',
    example: 'payment',
  })
  @IsOptional()
  searchText?: string;

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

  [key: string]: string | string[] | TimeRange | number | number[];
}

export class FindFeedbacksByChannelIdRequestDto extends PaginationRequestDto {
  @ApiProperty({
    required: false,
    description:
      "You can query by key-value with this object. (createdAt, updatedAt are kind of examples) If you want to search by text, you can use 'searchText' key.",
  })
  @IsOptional()
  query?: Query;

  @ApiProperty({
    required: false,
    description:
      "You can sort by specific feedback key with sort method values: 'ASC', 'DESC'",
    example: { createdAt: 'ASC' },
  })
  @IsOptional()
  sort?: Record<string, SortMethodEnum>;

  constructor(limit = 10, page = 1, query: Query) {
    super(limit, page);
    this.query = query;
  }
}
