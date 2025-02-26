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

import { IssueStatusEnum } from '@/common/enums';

class FindIssueByIdResponseCategoryDto {
  @Expose()
  @ApiProperty({ description: 'Category Id', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Category Name', example: 1 })
  name: string;
}

export class FindIssueByIdResponseDto {
  @Expose()
  @ApiProperty({ description: 'Issue id', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Issue Name', example: 1 })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Issue description',
    example: 'This is a payment issue',
  })
  description: string;

  @Expose()
  @ApiProperty({
    enum: IssueStatusEnum,
    description: 'Issue status',
    example: IssueStatusEnum.IN_PROGRESS,
  })
  status: IssueStatusEnum;

  @Expose()
  @ApiProperty({ description: 'External Issue Id', example: '123' })
  externalIssueId: string;

  @Expose()
  @ApiProperty({ description: 'Category' })
  @Type(() => FindIssueByIdResponseCategoryDto)
  category?: FindIssueByIdResponseCategoryDto;

  @Expose()
  @ApiProperty({ description: 'Feedback count of the issue', example: 100 })
  feedbackCount: number;

  @Expose()
  @ApiProperty({
    description: 'Created datetime of the issue',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Updated datetime of the issue',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  public static transform(params: any): FindIssueByIdResponseDto {
    return plainToInstance(FindIssueByIdResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
