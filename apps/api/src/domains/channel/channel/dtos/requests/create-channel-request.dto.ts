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
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '@/common/enums';
import { IsNullable } from '@/domains/user/decorators';

class CreateChannelRequestFieldSelectOptionDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  key: string;
}

export class CreateChannelRequestFieldDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  key: string;

  @ApiProperty({ nullable: true })
  @IsNullable()
  @IsString()
  description: string | null;

  @ApiProperty({ enum: FieldFormatEnum, enumName: 'FieldFormatEnum' })
  @IsEnum(FieldFormatEnum)
  format: FieldFormatEnum;

  @ApiProperty({ enum: FieldTypeEnum, enumName: 'FieldTypeEnum' })
  @IsEnum(FieldTypeEnum)
  type: FieldTypeEnum;

  @ApiProperty({ enum: FieldStatusEnum, enumName: 'FieldStatusEnum' })
  @IsEnum(FieldStatusEnum)
  status: FieldStatusEnum;

  @ApiProperty({
    type: [CreateChannelRequestFieldSelectOptionDto],
    required: false,
  })
  @Type(() => CreateChannelRequestFieldSelectOptionDto)
  @IsOptional()
  @ValidateNested({ each: true })
  options?: CreateChannelRequestFieldSelectOptionDto[];
}

export class CreateChannelRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ nullable: true })
  @IsNullable()
  @IsString()
  description: string | null;

  @ApiProperty({ type: [CreateChannelRequestFieldDto] })
  @Type(() => CreateChannelRequestFieldDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  fields: CreateChannelRequestFieldDto[];
}
