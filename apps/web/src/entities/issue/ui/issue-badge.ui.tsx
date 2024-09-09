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
import type { BadgeProps } from '@ufb/react';
import { Badge } from '@ufb/react';

import { ISSUE_COLOR_MAP } from '../issue-color.constant';
import type { Issue } from '../issue.type';

interface IProps extends Omit<BadgeProps, 'color'> {
  issue: Issue;
  right?: React.ReactNode;
}

const IssueBadge: React.FC<IProps> = ({ issue, right, ...props }) => {
  return (
    <Badge color={ISSUE_COLOR_MAP[issue.status]} {...props}>
      {issue.name} {right}
    </Badge>
  );
};

export default IssueBadge;
