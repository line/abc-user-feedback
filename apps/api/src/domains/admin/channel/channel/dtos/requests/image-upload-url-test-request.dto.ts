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
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ImageUploadUrlTestRequestDto {
  @ApiProperty()
  @IsString()
  accessKeyId: string;

  @ApiProperty({
    required: false,
    description:
      'Omit to test with the secret stored for channelId, since saved secrets are not returned to clients',
  })
  @IsOptional()
  @IsString()
  secretAccessKey?: string;

  @ApiProperty()
  @IsString()
  endpoint: string;

  @ApiProperty()
  @IsString()
  region: string;

  @ApiProperty()
  @IsString()
  bucket: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  channelId?: number;
}
