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
import { FindProjectByIdResponseDto } from './find-project-by-id-response.dto';

export class FindProjectsResponseDto extends PaginationResponseDto<FindProjectByIdResponseDto> {
  @Expose()
  @ApiProperty({ type: [FindProjectByIdResponseDto] })
  @Type(() => FindProjectByIdResponseDto)
  items: FindProjectByIdResponseDto[];

  public static transform(params: any) {
    return plainToInstance(FindProjectsResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
