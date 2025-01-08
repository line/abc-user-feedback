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

import { Badge, Icon } from '@ufb/react';

import type { IssuesItem } from '@/shared';
import { cn } from '@/shared';
import { useIssueSearch } from '@/entities/issue';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

import IssueDetailSheet from './issue-detail-sheet.ui';

const ISSUE_MAP: Record<
  Issue['status'],
  { bgClassName: string; fgClassName: string }
> = {
  INIT: { bgClassName: 'bg-yellow-50', fgClassName: 'bg-yellow-500' },
  ON_REVIEW: { bgClassName: 'bg-green-50', fgClassName: 'bg-green-500' },
  IN_PROGRESS: { bgClassName: 'bg-teal-50', fgClassName: 'bg-teal-500' },
  RESOLVED: { bgClassName: 'bg-slate-50', fgClassName: 'bg-slate-500' },
  PENDING: { bgClassName: 'bg-indigo-50', fgClassName: 'bg-indigo-500' },
};

interface Props {
  issue: IssuesItem;
  projectId: number;
  issueTracker?: IssueTracker;
}

const IssueKanbanColumn = (props: Props) => {
  const { issue, projectId, issueTracker } = props;
  const { data, isLoading } = useIssueSearch(projectId, {
    query: { status: issue.status },
  });

  return (
    <div
      className={cn(
        'rounded-16 flex flex-col gap-2 px-2 py-3',
        ISSUE_MAP[issue.status].bgClassName,
      )}
    >
      <div
        className={cn(
          'text-neutral-inverse rounded-8 text-base-strong flex items-center justify-between px-4 py-2',
          ISSUE_MAP[issue.status].fgClassName,
        )}
      >
        <div className="flex items-center gap-1">
          {issue.name}
          <Badge variant="subtle" radius="large">
            {data?.meta.totalItems}
          </Badge>
        </div>
        <Icon name="RiArrowUpDownFill" size={20} />
      </div>
      {!isLoading && data?.items.length === 0 ?
        <div className="flex h-12 items-center justify-center">
          <p className="text-neutral-tertiary text-center">
            There is no issue on this status.
          </p>
        </div>
      : data?.items.map((item) => (
          <IssueDetailSheet
            key={item.id}
            item={item}
            issueTracker={issueTracker}
            projectId={projectId}
          />
        ))
      }
    </div>
  );
};

export default IssueKanbanColumn;
