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
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { CreateIssueTrackerRequestDto } from '@/domains/project/issue-tracker/dtos/requests';
import { CreateRoleRequestDto } from '@/domains/project/role/dtos/requests';
import { IsNullable } from '@/domains/user/decorators';

class CreateMemberByNameDto {
  @ApiProperty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}

class CreateApiKeyByValueDto {
  @ApiProperty()
  @IsString()
  @Length(20)
  value: string;
}

export class CreateProjectRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNullable()
  description: string | null;

  @ApiProperty({ type: [CreateRoleRequestDto], required: false })
  @IsArray()
  @IsOptional()
  roles?: CreateRoleRequestDto[];

  @ApiProperty({ type: [CreateMemberByNameDto], required: false })
  @IsArray()
  @IsOptional()
  members?: CreateMemberByNameDto[];

  @ApiProperty({ type: [CreateApiKeyByValueDto], required: false })
  @IsArray()
  @IsOptional()
  apiKeys?: CreateApiKeyByValueDto[];

  @ApiProperty({ type: CreateIssueTrackerRequestDto, required: false })
  @IsOptional()
  issueTracker?: CreateIssueTrackerRequestDto;
}
