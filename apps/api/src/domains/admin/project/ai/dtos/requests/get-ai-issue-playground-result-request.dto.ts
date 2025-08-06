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
import { IsArray, IsNumber, IsString } from 'class-validator';

export class TemporaryField {
  @ApiProperty({ nullable: false, type: String })
  @IsString()
  name: string;

  @ApiProperty({ nullable: false, type: String })
  @IsString()
  description: string;

  @ApiProperty({ nullable: false, type: String })
  @IsString()
  value: string;
}

export class GetAIIssuePlaygroundResultRequestDto {
  @ApiProperty({ nullable: false, type: Number })
  @IsNumber()
  channelId: number;

  @ApiProperty({ nullable: true, type: [String] })
  @IsString({ each: true })
  targetFieldKeys: string[];

  @ApiProperty({ nullable: false, type: String })
  @IsString()
  templatePrompt: string;

  @ApiProperty({ nullable: false, type: String })
  @IsString()
  model: string;

  @ApiProperty({ nullable: false, type: Number })
  @IsNumber()
  temperature: number;

  @ApiProperty({ nullable: false, type: Number })
  @IsNumber()
  dataReferenceAmount: number;

  @ApiProperty({ nullable: false, type: [TemporaryField] })
  @IsArray()
  temporaryFields: TemporaryField[];
}
