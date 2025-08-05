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
import { Expose, plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';

class IssueRecommendResult {
  @ApiProperty({ nullable: false, type: String })
  @Expose()
  issueName: string;
}

export class GetAIIssueRecommendResponseDto {
  @ApiProperty({ nullable: false, type: Boolean })
  @Expose()
  success: boolean;

  @ApiProperty({ nullable: false, type: String })
  @IsOptional()
  @Expose()
  message: string;

  @ApiProperty({ nullable: false, type: [IssueRecommendResult] })
  @Expose()
  result: [IssueRecommendResult];

  public static transform(params: any): GetAIIssueRecommendResponseDto {
    return plainToInstance(GetAIIssueRecommendResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
