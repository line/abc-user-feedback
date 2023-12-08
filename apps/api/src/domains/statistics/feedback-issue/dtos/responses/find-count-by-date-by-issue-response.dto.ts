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
import { Expose, plainToInstance } from 'class-transformer';

class IssueStatisticData {
  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  feedbackCount: number;
}
class IssueStatistic {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: [IssueStatisticData] })
  @Expose()
  statistics: IssueStatisticData[];
}

export class FindCountByDateByIssueResponseDto {
  @ApiProperty({ type: [IssueStatistic] })
  @Expose()
  issues: IssueStatistic[];

  public static transform(params: any): FindCountByDateByIssueResponseDto {
    return plainToInstance(FindCountByDateByIssueResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
