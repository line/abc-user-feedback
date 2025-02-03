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
<<<<<<<< HEAD:apps/api/src/domains/admin/project/category/dtos/responses/create-category-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

export class CreateCategoryResponseDto {
  @Expose()
  @ApiProperty({ description: 'Category id', example: 1 })
  id: number;

  public static transform(params: any): CreateCategoryResponseDto {
    return plainToInstance(CreateCategoryResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
========
export type TableFilterFieldFotmat =
  | 'text'
  | 'keyword'
  | 'number'
  | 'date'
  | 'select'
  | 'multiSelect'
  | 'issue';

export type TableFilterCondition = 'CONTAINS' | 'IS' | 'BETWEEN';
export type TableFilterOperator = 'AND' | 'OR';

export interface TableFilterField {
  key: string;
  name: string;
  format: TableFilterFieldFotmat;
  options?: { key: string; name: string }[];
}
export interface TableFilter {
  value?: string;
  key: string;
  name: string;
  format: TableFilterFieldFotmat;
  condition: TableFilterCondition;
}
>>>>>>>> c43b0c82 (Merge 'dev'):apps/web/src/shared/ui/table-filter-popover/table-filter-popover.type.ts
