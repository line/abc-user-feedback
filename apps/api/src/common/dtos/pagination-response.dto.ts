/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import type { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

class PaginationMetaDto implements IPaginationMeta {
  @ApiProperty({ example: 10 })
  @Expose()
  itemCount: number;

  @ApiProperty({ example: 100 })
  @Expose()
  totalItems?: number;

  @ApiProperty({ example: 10 })
  @Expose()
  itemsPerPage: number;

  @ApiProperty({ example: 10 })
  @Expose()
  totalPages?: number;

  @ApiProperty({ example: 1 })
  @Expose()
  currentPage: number;
}

export abstract class PaginationResponseDto<T> implements Pagination<T> {
  @ApiProperty()
  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  abstract items: T[];
}
