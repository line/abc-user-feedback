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
import { IsBoolean, IsObject, IsString } from 'class-validator';

import { IsNullable } from '@/domains/user/decorators';

export class OAuthConfigRequestDto {
  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  clientSecret: string;

  @ApiProperty()
  @IsString()
  authCodeRequestURL: string;

  @ApiProperty()
  @IsString()
  scopeString: string;

  @ApiProperty()
  @IsString()
  accessTokenRequestURL: string;

  @ApiProperty()
  @IsString()
  userProfileRequestURL: string;

  @ApiProperty()
  @IsString()
  emailKey: string;
}

export class UpdateTenantRequestDto {
  @ApiProperty()
  @IsString()
  siteName: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNullable()
  description: string | null;

  @ApiProperty()
  @IsBoolean()
  useEmail: boolean;

  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsBoolean()
  isRestrictDomain: boolean;

  @ApiProperty({ nullable: true })
  @IsString({ each: true })
  @IsNullable()
  allowDomains: string[] | null;

  @ApiProperty()
  @IsBoolean()
  useOAuth: boolean;

  @ApiProperty({ nullable: true, type: OAuthConfigRequestDto })
  @IsObject()
  @IsNullable()
  oauthConfig: OAuthConfigRequestDto | null;
}
