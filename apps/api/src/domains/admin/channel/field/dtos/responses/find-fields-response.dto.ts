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
import { Expose, plainToInstance, Type } from 'class-transformer';

import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
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
  @ApiProperty({ enum: FieldPropertyEnum })
  property: FieldFormatEnum;

  @Expose()
  @ApiProperty({ enum: FieldStatusEnum })
  status: FieldFormatEnum;

  @Expose()
  @ApiProperty()
  order: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  key: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
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

  @Expose()
  @ApiProperty({ type: Number, nullable: true })
  aiFieldTemplateId: number | null;

  @Expose()
  @ApiProperty({ type: Array<string>, nullable: true })
  aiFieldTargetKeys: string[] | null;

  @Expose()
  @ApiProperty({ type: Boolean })
  aiFieldAutoProcessing: boolean | null;

  public static transform(params: any): FindFieldsResponseDto {
    return plainToInstance(FindFieldsResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}

export class GetFieldsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fieldName' })
  name: string;

  @ApiProperty({ example: 'fieldKey' })
  key: string;

  @ApiProperty({ enum: FieldFormatEnum })
  format: FieldFormatEnum;

  @ApiProperty({ enum: FieldStatusEnum })
  status: FieldStatusEnum;
}
