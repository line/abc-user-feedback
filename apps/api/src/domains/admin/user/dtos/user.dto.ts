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

import { SignUpMethodEnum, UserTypeEnum } from '../entities/enums';

export class UserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ nullable: true })
  department: string | null;

  @Expose()
  @ApiProperty({ enum: UserTypeEnum })
  type: UserTypeEnum;

  @Expose()
  @ApiProperty({ enum: SignUpMethodEnum })
  signUpMethod: SignUpMethodEnum;

  public static transform(params: Partial<UserDto>): UserDto {
    return plainToInstance(UserDto, params, {
      excludeExtraneousValues: true,
    });
  }
}
