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
import { Expose, plainToInstance } from 'class-transformer';
import { IsNumber, IsString, MaxLength } from 'class-validator';

import { CategoryEntity } from '@/domains/admin/project/category/category.entity';

export class CreateCategoryDto {
  @Expose()
  @IsNumber()
  projectId: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  name: string;

  public static from(params: any): CreateCategoryDto {
    return plainToInstance(CreateCategoryDto, params, {
      excludeExtraneousValues: true,
    });
  }

  static toCategoryEntity(params: CreateCategoryDto) {
    const { projectId, name } = params;
    return CategoryEntity.from({
      projectId,
      name,
    });
  }
}
