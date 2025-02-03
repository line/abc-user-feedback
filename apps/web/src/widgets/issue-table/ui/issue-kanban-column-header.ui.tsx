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

import { Badge } from '@ufb/react';

import type { IssuesItem } from '@/shared';
import { cn } from '@/shared';

import IssueKanbanColumnSorting from './issue-kanban-column-sorting.ui';

const ISSUE_MAP: Record<
  IssuesItem['status'],
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
  totalItems: number;
  sort: { key: string; value: string };
  onChangeSort: (input: { key: string; value: string }) => void;
}

const IssueKanbanColumnHeader = (props: Props) => {
  const { issue, totalItems, sort, onChangeSort } = props;
  return (
    <div
      className={cn(
        'text-neutral-inverse rounded-8 text-base-strong flex items-center justify-between px-4 py-2',
        ISSUE_MAP[issue.status].fgClassName,
      )}
    >
      <div className="flex items-center gap-1">
        {issue.name}
        {totalItems ?
          <Badge variant="subtle" radius="large">
            {totalItems.toLocaleString()}
          </Badge>
        : <></>}
      </div>
      <IssueKanbanColumnSorting sort={sort} onSubmit={onChangeSort} />
    </div>
  );
};

export default IssueKanbanColumnHeader;
