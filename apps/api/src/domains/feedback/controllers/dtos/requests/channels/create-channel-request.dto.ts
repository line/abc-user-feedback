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
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { FieldTypeEnum } from '@/domains/feedback/services/dtos/enums';

class CreateChannelRequestFieldSelectOptionDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateChannelRequestFieldDto {
  @ApiProperty({ enum: FieldTypeEnum, enumName: 'FieldTypeEnum' })
  @IsEnum(FieldTypeEnum)
  type: FieldTypeEnum;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty()
  @IsBoolean()
  isDisabled: boolean;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  order: number;

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

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty({ type: [CreateChannelRequestFieldDto] })
  @Type(() => CreateChannelRequestFieldDto)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  fields: CreateChannelRequestFieldDto[];
}
