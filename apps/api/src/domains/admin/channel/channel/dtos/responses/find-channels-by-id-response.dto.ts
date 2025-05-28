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

import { PaginationResponseDto } from '@/common/dtos';
import { ImageConfigResponseDto } from './image-config-response.dto';

class FindChannelsByProjectDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  feedbackSearchMaxDays: number;

  @Expose()
  @ApiProperty()
  imageConfig: ImageConfigResponseDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}

export class FindChannelsByProjectIdResponseDto extends PaginationResponseDto<FindChannelsByProjectDto> {
  @Expose()
  @ApiProperty({ type: [FindChannelsByProjectDto] })
  @Type(() => FindChannelsByProjectDto)
  items: FindChannelsByProjectDto[];

  public static transform(params: any): FindChannelsByProjectIdResponseDto {
    return plainToInstance(FindChannelsByProjectIdResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
