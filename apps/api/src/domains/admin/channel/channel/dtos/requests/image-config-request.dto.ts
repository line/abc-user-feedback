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
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

class ImageConfigBaseRequestDto {
  @ApiProperty()
  @IsString()
  accessKeyId: string;

  @ApiProperty()
  @IsString()
  endpoint: string;

  @ApiProperty()
  @IsString()
  region: string;

  @ApiProperty()
  @IsString()
  bucket: string;

  @ApiProperty({ nullable: true, type: [String] })
  @IsString({ each: true })
  domainWhiteList: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enablePresignedUrlDownload: boolean;
}

/** Used on update, where the stored secret is kept when none is sent. */
export class ImageConfigRequestDto extends ImageConfigBaseRequestDto {
  @ApiProperty({
    required: false,
    description:
      'Omit or leave empty to keep the secret already stored for the channel',
  })
  @IsOptional()
  @IsString()
  secretAccessKey?: string;
}

/** Used on create, where there is no stored secret to fall back to. */
export class CreateImageConfigRequestDto extends ImageConfigBaseRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  secretAccessKey: string;
}
