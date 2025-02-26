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
import type { TFunction } from 'next-i18next';

import type { IssueStatus } from '@/entities/issue';

import type { BadgeColor } from './color-map';

export interface IssuesItem {
  key: IssueStatus;
  status: IssueStatus;
  name: string;
  color: BadgeColor;
}

export const ISSUES: (t: TFunction) => IssuesItem[] = (t) => [
  {
    key: 'INIT',
    status: 'INIT',
    name: t('text.issue.init'),
    color: 'yellow',
  },
  {
    key: 'ON_REVIEW',
    status: 'ON_REVIEW',
    name: t('text.issue.onReview'),
    color: 'green',
  },
  {
    key: 'IN_PROGRESS',
    status: 'IN_PROGRESS',
    name: t('text.issue.inProgress'),
    color: 'sky',
  },
  {
    key: 'RESOLVED',
    status: 'RESOLVED',
    name: t('text.issue.resolved'),
    color: 'zinc',
  },
  {
    key: 'PENDING',
    status: 'PENDING',
    name: t('text.issue.pending'),
    color: 'indigo',
  },
];
