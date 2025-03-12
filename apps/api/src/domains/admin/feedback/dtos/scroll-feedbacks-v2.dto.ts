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
import type { TimeRange } from '@/common/dtos';
import type { QueryV2ConditionsEnum, SortMethodEnum } from '@/common/enums';
import type { FieldEntity } from '@/domains/admin/channel/field/field.entity';

export class ScrollFeedbacksDtoV2 {
  channelId: number;
  queries?: {
    createdAt?: TimeRange;
    updatedAt?: TimeRange;
    ids?: number[];
    [key: string]:
      | string
      | string[]
      | TimeRange
      | number
      | number[]
      | undefined;
    condition: QueryV2ConditionsEnum;
  }[];
  sort?: Record<string, SortMethodEnum>;
  operator?: 'AND' | 'OR';
  fields: FieldEntity[];
  size: number;
  scrollId: string | null;
}
