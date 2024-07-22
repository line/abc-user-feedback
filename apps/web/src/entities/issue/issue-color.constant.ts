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
import type { ColorType } from '@ufb/ui';

import type { IssueStatus } from './issue.type';

export const ISSUE_COLOR_MAP: Record<IssueStatus, ColorType> = {
  INIT: 'red',
  ON_REVIEW: 'blue',
  IN_PROGRESS: 'yellow',
  RESOLVED: 'green',
  PENDING: 'purple',
};
