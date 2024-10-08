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
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { IssueStatusEnum } from '@/common/enums';
import { IsNullable } from '@/domains/admin/user/decorators';
import { CreateIssueRequestDto } from './create-issue-request.dto';

export class UpdateIssueRequestDto extends CreateIssueRequestDto {
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Issue description',
    example: 'This is a payment issue',
  })
  @IsString()
  @IsNullable()
  @MaxLength(50)
  description: string | null;

  @ApiProperty({
    required: false,
    enum: IssueStatusEnum,
    description: 'Issue status',
    example: IssueStatusEnum.IN_PROGRESS,
  })
  @IsEnum(IssueStatusEnum)
  @IsOptional()
  status?: IssueStatusEnum;

  @ApiProperty({
    required: false,
    description: 'External Issue Id',
    example: '123',
  })
  @IsString()
  @IsOptional()
  externalIssueId?: string;
}
