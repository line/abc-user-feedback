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
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

class UpdateTenantRequestDefaultRoleDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class UpdateTenantRequestDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  siteName: string;

  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsBoolean()
  isRestrictDomain: boolean;

  @ApiProperty()
  @IsString({ each: true })
  allowDomains: string[];

  @ApiProperty({ type: UpdateTenantRequestDefaultRoleDto })
  @IsNotEmpty()
  @Type(() => UpdateTenantRequestDefaultRoleDto)
  defaultRole: UpdateTenantRequestDefaultRoleDto;
}
