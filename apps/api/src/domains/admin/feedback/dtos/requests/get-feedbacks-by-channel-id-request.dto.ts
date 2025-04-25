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
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { toNumber } from '@/common/helper/cast.helper';

export class GetFeedbacksByChannelIdRequestDto {
  @ApiProperty({ required: true, description: 'Keyword to search feedbacks' })
  @IsOptional()
  @IsString()
  searchText: string;

  @ApiProperty({
    required: true,
    description: 'Issue name to search related feedbacks within channel',
  })
  @IsOptional()
  @IsString()
  issueName: string;

  @Transform(({ value }: { value: string }) =>
    toNumber(value, { default: 10, min: 1 }),
  )
  @ApiProperty({ required: false, minimum: 1, default: 10, example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 10;

  @Transform(({ value }: { value: string }) =>
    toNumber(value, { default: 1, min: 1 }),
  )
  @ApiProperty({ required: false, minimum: 1, default: 1, example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1;
}
