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
import { useTranslation } from 'next-i18next';

import type { BadgeProps } from '@ufb/react';
import { Badge } from '@ufb/react';

import { ISSUES } from '@/shared';
import { BADGE_COLOR_MAP } from '@/shared/constants/color-map';
import type { BadgeColor } from '@/shared/constants/color-map';

import type { Issue, IssueStatus } from '../issue.type';

const ISSUE_COLOR_MAP: Record<IssueStatus, BadgeColor> = {
  INIT: 'yellow',
  ON_REVIEW: 'green',
  IN_PROGRESS: 'sky',
  RESOLVED: 'zinc',
  PENDING: 'indigo',
};
interface IProps extends Omit<BadgeProps, 'color'> {
  right?: React.ReactNode;
  status: Issue['status'];
  name?: string;
}

const IssueBadge: React.FC<IProps> = ({ name, status, right, ...props }) => {
  const { t } = useTranslation();

  return (
    <Badge {...props} className={BADGE_COLOR_MAP[ISSUE_COLOR_MAP[status]]}>
      {name ?? ISSUES(t).find((v) => v.key === status)?.name} {right}
    </Badge>
  );
};

export default IssueBadge;
