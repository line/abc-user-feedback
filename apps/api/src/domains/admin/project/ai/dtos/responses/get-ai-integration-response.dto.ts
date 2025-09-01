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
import { IsEnum, IsNumber, IsString, Max } from 'class-validator';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';

export class GetAIIntegrationResponseDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  id: number;

  @Expose()
  @ApiProperty({ enum: AIProvidersEnum, enumName: 'AIProvidersEnum' })
  @IsEnum(AIProvidersEnum)
  provider: AIProvidersEnum;

  @ApiProperty()
  @IsString()
  @Expose()
  apiKey: string;

  @ApiProperty()
  @IsString()
  @Expose()
  endpointUrl: string;

  @ApiProperty()
  @IsString()
  @Expose()
  systemPrompt: string;

  @ApiProperty({ type: Number, nullable: true })
  @IsNumber()
  @Expose()
  @Max(50000000)
  tokenThreshold: number | null;

  @ApiProperty({ type: Number, nullable: true })
  @IsNumber()
  @Expose()
  notificationThreshold: number | null;

  public static transform(params: any): GetAIIntegrationResponseDto {
    return plainToInstance(GetAIIntegrationResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
