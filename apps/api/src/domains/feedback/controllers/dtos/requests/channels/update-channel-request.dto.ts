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
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import {
  CreateChannelRequestDto,
  CreateChannelRequestFieldDto,
} from './create-channel-request.dto';

export class UpdateChannelRequestFieldDto extends CreateChannelRequestFieldDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id?: string;
}

export class UpdateChannelRequestDto extends OmitType(CreateChannelRequestDto, [
  'fields',
]) {
  @ApiProperty({ type: [UpdateChannelRequestFieldDto] })
  @Type(() => UpdateChannelRequestFieldDto)
  @ValidateNested({ each: true })
  fields: UpdateChannelRequestFieldDto[];
}
