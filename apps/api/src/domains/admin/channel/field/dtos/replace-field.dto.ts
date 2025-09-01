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
import { Expose, Type } from 'class-transformer';

import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
} from '../../../../../common/enums';

export class ReplaceFieldDto {
  @Expose()
  id?: number;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Expose()
  description: string | null;

  @Expose()
  format: FieldFormatEnum;

  @Expose()
  property: FieldPropertyEnum;

  @Expose()
  status: FieldStatusEnum;

  @Expose()
  order?: number | null;

  @Expose()
  aiFieldTemplateId?: number | null;

  @Expose()
  aiFieldTargetKeys?: string[] | null;

  @Expose()
  aiFieldAutoProcessing?: boolean | null;

  @Expose()
  @Type(() => Option)
  options?: Option[];
}

class Option {
  @Expose()
  id?: number;

  @Expose()
  name: string;

  @Expose()
  key: string;
}
