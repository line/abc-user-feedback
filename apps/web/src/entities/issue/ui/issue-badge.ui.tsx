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
import { useTranslation } from 'react-i18next';

import type { BadgeProps } from '@ufb/react';
import { Badge } from '@ufb/react';

import { ISSUES } from '@/shared';

import type { Issue, IssueStatus } from '../issue.type';

const ISSUE_COLOR_MAP: Record<IssueStatus, string> = {
  INIT: 'bg-yellow-500',
  ON_REVIEW: 'bg-green-500',
  IN_PROGRESS: 'bg-teal-500',
  RESOLVED: 'bg-slate-500',
  PENDING: 'bg-indigo-500',
};
interface IProps extends Omit<BadgeProps, 'color'> {
  right?: React.ReactNode;
  status: Issue['status'];
  name?: string;
}

const IssueBadge: React.FC<IProps> = ({ name, status, right, ...props }) => {
  const { t } = useTranslation();

  return (
    <Badge {...props} className={ISSUE_COLOR_MAP[status]}>
      {name ?? ISSUES(t).find((v) => v.key === status)?.name} {right}
    </Badge>
  );
};

export default IssueBadge;
