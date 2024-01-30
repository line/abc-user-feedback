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
import { Expose, plainToInstance, Type } from 'class-transformer';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '@/common/enums';

export class FindFieldsResponseSelectOptionDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  key: string;
}

export class FindFieldsResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ enum: FieldFormatEnum })
  format: FieldFormatEnum;

  @Expose()
  @ApiProperty({ enum: FieldTypeEnum })
  type: FieldFormatEnum;

  @Expose()
  @ApiProperty({ enum: FieldStatusEnum })
  status: FieldFormatEnum;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  key: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string | null;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: [FindFieldsResponseSelectOptionDto] })
  @Type(() => FindFieldsResponseSelectOptionDto)
  options: FindFieldsResponseSelectOptionDto[];

  public static transform(params: any): FindFieldsResponseDto {
    return plainToInstance(FindFieldsResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
