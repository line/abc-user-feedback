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

import { PaginationResponseDto } from '@/common/dtos';
import type { IssueEntity } from '@/domains/project/issue/issue.entity';

export class Feedback {
  [key: string]: any;
  issues?: IssueEntity[];
}

export class FindFeedbacksByChannelIdResponseDto extends PaginationResponseDto<Feedback> {
  @Expose()
  @ApiProperty({
    type: [Feedback],
    example: [
      {
        id: 1,
        name: 'feedback',
        issues: [
          {
            id: 1,
            name: 'issue',
          },
        ],
      },
    ],
  })
  @Type(() => Feedback)
  items: Feedback[];

  public static transform(params: any): FindFeedbacksByChannelIdResponseDto {
    return plainToInstance(FindFeedbacksByChannelIdResponseDto, params, {
      excludeExtraneousValues: false,
    });
  }
}
