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

import { BACKGROUND_COLOR_MAP, cn } from '@/shared';

import { ISSUE_COLOR_MAP } from '../issue-color.constant';
import type { IssueStatus } from '../issue.type';

interface IProps {
  issueKey?: IssueStatus;
}

const IssueCircle: React.FC<IProps> = ({ issueKey }) => {
  return (
    <div
      className={cn([
        'border-fill-secondary bg- mr-1.5 h-1.5 w-1.5 rounded-full border',
        issueKey && BACKGROUND_COLOR_MAP[ISSUE_COLOR_MAP[issueKey]],
      ])}
    />
  );
};

export default IssueCircle;
