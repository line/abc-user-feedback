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
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

import { toNumber } from '@/common/helper/cast.helper';

export class PaginationRequestDto {
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @ApiProperty({ required: false, minimum: 1, default: 10, example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @ApiProperty({ required: false, minimum: 1, default: 1, example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  constructor(limit = 10, page = 1) {
    this.limit = limit;
    this.page = page;
  }
}
