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
import { TFunction } from 'next-i18next';

import { ColorType } from '@/types/color.type';

type Issue = {
  key: string;
  name: string;
  color: ColorType;
};

export const ISSUES: (t: TFunction) => Issue[] = (t) => [
  { key: 'INIT', name: t('text.issue.init'), color: 'red' },
  { key: 'ON_REVIEW', name: t('text.issue.onReview'), color: 'blue' },
  { key: 'IN_PROGRESS', name: t('text.issue.inProgress'), color: 'yellow' },
  { key: 'RESOLVED', name: t('text.issue.resolved'), color: 'green' },
  { key: 'PENDING', name: t('text.issue.pending'), color: 'purple' },
];
export const getStatusColor = (status: string): ColorType => {
  switch (status) {
    case 'INIT':
      return 'red';
    case 'ON_REVIEW':
      return 'blue';
    case 'IN_PROGRESS':
      return 'yellow';
    case 'RESOLVED':
      return 'green';
    case 'PENDING':
      return 'purple';
    default:
      return 'red';
  }
};
