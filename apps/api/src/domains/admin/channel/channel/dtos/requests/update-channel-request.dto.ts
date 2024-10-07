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
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsNullable } from '@/domains/admin/user/decorators';
import { ImageConfigRequestDto } from './image-config-request.dto';

export class UpdateChannelRequestDto {
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
}
