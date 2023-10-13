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
import { Expose, plainToInstance, Type } from 'class-transformer';

import { ChannelEntity } from '@/domains/channel/channel/channel.entity';
import { CreateFieldDto } from '../field/dtos';

export class CreateChannelDto {
  @Expose()
  projectId: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];

  public static from(params: any): CreateChannelDto {
    return plainToInstance(CreateChannelDto, params, {
      excludeExtraneousValues: true,
    });
  }

  static toChannelEntity(params: CreateChannelDto) {
    return ChannelEntity.from(
      params.name,
      params.description,
      params.projectId,
    );
  }
}
