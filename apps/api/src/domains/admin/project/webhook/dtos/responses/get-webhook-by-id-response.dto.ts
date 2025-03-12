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
import { Expose, plainToInstance } from 'class-transformer';

import {
  EventStatusEnum,
  EventTypeEnum,
  WebhookStatusEnum,
} from '@/common/enums';
import { FindChannelByIdResponseDto } from '@/domains/admin/channel/channel/dtos/responses';

export class GetWebhookResponseEventDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ enum: EventStatusEnum })
  status: EventStatusEnum;

  @Expose()
  @ApiProperty({ enum: EventTypeEnum })
  type: EventTypeEnum;

  @Expose()
  @ApiProperty({ type: [FindChannelByIdResponseDto] })
  channels: FindChannelByIdResponseDto[];

  @Expose()
  @ApiProperty()
  createdAt: Date;
}

export class GetWebhookByIdResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  token: string;

  @Expose()
  @ApiProperty({ enum: WebhookStatusEnum })
  status: WebhookStatusEnum;

  @Expose()
  @ApiProperty({ type: [GetWebhookResponseEventDto] })
  events: GetWebhookResponseEventDto[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  public static transform(plain: any): GetWebhookByIdResponseDto {
    return plainToInstance(GetWebhookByIdResponseDto, plain);
  }
}
