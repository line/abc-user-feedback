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

import { LoginButtonTypeEnum } from '../../entities/enums/login-button-type.enum';

export class OAuthConfigResponseDto {
  @Expose()
  @ApiProperty()
  oauthUse: boolean;

  @Expose()
  @ApiProperty()
  clientId: string;

  @Expose()
  @ApiProperty()
  clientSecret: string;

  @Expose()
  @ApiProperty()
  authCodeRequestURL: string;

  @Expose()
  @ApiProperty()
  scopeString: string;

  @Expose()
  @ApiProperty()
  accessTokenRequestURL: string;

  @Expose()
  @ApiProperty()
  userProfileRequestURL: string;

  @Expose()
  @ApiProperty()
  emailKey: string;

  @Expose()
  @ApiProperty({
    enumName: 'LoginButtonTypeEnum',
    enum: LoginButtonTypeEnum,
    type: LoginButtonTypeEnum,
    nullable: true,
  })
  loginButtonType: LoginButtonTypeEnum | null;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  loginButtonName: string | null;
}

export class GetTenantResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  siteName: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @Expose()
  @ApiProperty()
  useEmail: boolean;

  @Expose()
  @ApiProperty()
  useOAuth: boolean;

  @Expose()
  @ApiProperty({ nullable: true, type: [String] })
  allowDomains: string[] | null;

  @Expose()
  @ApiProperty({ type: OAuthConfigResponseDto, nullable: true })
  @Type(() => OAuthConfigResponseDto)
  oauthConfig: OAuthConfigResponseDto | null;

  public static transform(params: any): GetTenantResponseDto {
    return plainToInstance(GetTenantResponseDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
