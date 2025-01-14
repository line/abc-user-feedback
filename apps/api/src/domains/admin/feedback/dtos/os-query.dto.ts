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

export class OsQueryDto {
  bool: {
    must: MustItem[];
    should?: MustItem[];
    minimum_should_match?: number;
  };
}

export class MustItem {
  match_phrase?: Record<string, string>;
  range?: Record<string, TimeRange>;
  term?: Record<string, string>;
  ids?: {
    values: string[];
  };
  bool?: {
    must: MustItem[];
    should?: MustItem[];
  };
}
