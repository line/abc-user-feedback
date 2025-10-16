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
import { IsArray, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

import { WebhookStatusEnum } from '@/common/enums';
import { TokenValidator } from '@/common/validators/token-validator';
import { IsNullable } from '@/domains/admin/user/decorators';
import { EventDto } from '..';

export class CreateWebhookRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({ enum: WebhookStatusEnum })
  @IsEnum(WebhookStatusEnum)
  status: WebhookStatusEnum;

  @ApiProperty({ type: [EventDto] })
  @IsArray()
  @IsNotEmpty()
  events: EventDto[];

  @ApiProperty({ nullable: true, type: String })
  @IsNullable()
  @TokenValidator()
  token: string | null;
}
