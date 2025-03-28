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
import { IsOptional } from 'class-validator';

import { ApiKeyEntity } from '../api-key.entity';

export class CreateApiKeyDto {
  @Expose()
  projectId: number;

  @Expose()
  value: string;

  @Expose()
  @IsOptional()
  createdAt?: Date;

  @Expose()
  @IsOptional()
  deletedAt?: Date;

  public static from(params: any): CreateApiKeyDto {
    return plainToInstance(CreateApiKeyDto, params, {
      excludeExtraneousValues: true,
    });
  }

  static toApiKeyEntity(params: CreateApiKeyDto) {
    return ApiKeyEntity.from({
      projectId: params.projectId,
      value: params.value,
      createdAt: params.createdAt,
      deletedAt: params.deletedAt,
    });
  }
}
