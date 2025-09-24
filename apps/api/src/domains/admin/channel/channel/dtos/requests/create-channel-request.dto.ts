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
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
} from '@/common/enums';
import { IsNullable } from '@/domains/admin/user/decorators';
import { ImageConfigRequestDto } from './image-config-request.dto';

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

  @ApiProperty({ nullable: true, type: String })
  @IsNullable()
  @IsString()
  description: string | null;

  @ApiProperty({ enum: FieldFormatEnum, enumName: 'FieldFormatEnum' })
  @IsEnum(FieldFormatEnum)
  format: FieldFormatEnum;

  @ApiProperty({ enum: FieldPropertyEnum, enumName: 'FieldPropertyEnum' })
  @IsEnum(FieldPropertyEnum)
  property: FieldPropertyEnum;

  @ApiProperty({ enum: FieldStatusEnum, enumName: 'FieldStatusEnum' })
  @IsEnum(FieldStatusEnum)
  status: FieldStatusEnum;

  @ApiProperty({ nullable: true, type: Number })
  @IsOptional()
  @IsNumber()
  order?: number | null;

  @ApiProperty({ nullable: true, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  aiFieldTemplateId?: number | null;

  @ApiProperty({ nullable: true, type: [String], required: false })
  @IsOptional()
  aiFieldTargetKeys?: string[] | null;

  @ApiProperty({ nullable: true, type: Boolean, required: false })
  @IsOptional()
  aiFieldAutoProcessing?: boolean | null;

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
  @MinLength(1)
  @MaxLength(20)
  name: string;

  @ApiProperty({ nullable: true, type: String })
  @IsNullable()
  @IsString()
  @MaxLength(50)
  description: string | null;

  @ApiProperty({ required: false, nullable: true, type: ImageConfigRequestDto })
  @IsOptional()
  @IsNullable()
  @IsObject()
  imageConfig: ImageConfigRequestDto | null;

  @ApiProperty()
  @IsNumber()
  feedbackSearchMaxDays: number;

  @ApiProperty({ type: [CreateChannelRequestFieldDto] })
  @Type(() => CreateChannelRequestFieldDto)
  @ValidateNested({ each: true })
  fields: CreateChannelRequestFieldDto[];
}
