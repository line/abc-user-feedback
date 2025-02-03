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

import { useEffect, useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Button } from '@ufb/react';

import type { IssuesItem } from '@/shared';
import { useIssueSearchInfinite } from '@/entities/issue';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

import IssueDetailSheet from './issue-detail-sheet.ui';
import IssueKanbanColumnHeader from './issue-kanban-column-header.ui';
import IssueKanbanColumnItem from './issue-kanban-column-item.ui';

interface Props {
  issue: IssuesItem;
  projectId: number;
  issueTracker?: IssueTracker;
  items: Issue[];
  setItems: React.Dispatch<React.SetStateAction<Record<string, Issue[]>>>;
}

const IssueKanbanColumn = (props: Props) => {
  const { issue, projectId, issueTracker, items, setItems } = props;

  const [sort, setSort] = useState({ key: 'createdAt', value: 'DESC' });

  const { data, hasNextPage, fetchNextPage, isFetching } =
    useIssueSearchInfinite(projectId, {
      query: { status: issue.status },
      sort: { [sort.key]: sort.value },
    });

  useEffect(() => {
    setItems((items) => ({
      ...items,
      [issue.status]: data.pages.flatMap((page) => page?.items ?? []),
    }));
  }, [data]);

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div className="rounded-16 bg-neutral-tertiary flex flex-col gap-2 px-2 py-3">
        <IssueKanbanColumnHeader
          issue={issue}
          totalItems={data.pages[0]?.meta.totalItems ?? 0}
          sort={sort}
          onChangeSort={(input) => setSort(input)}
        />
        {items.length === 0 ?
          <div className="flex h-12 items-center justify-center">
            <p className="text-neutral-tertiary text-center">
              There is no issue on this status.
            </p>
          </div>
        : items.map((item) => (
            <IssueDetailSheet
              key={item.id}
              item={item}
              issueTracker={issueTracker}
              projectId={projectId}
            >
              <IssueKanbanColumnItem item={item} issueTracker={issueTracker} />
            </IssueDetailSheet>
          ))
        }
        {hasNextPage && (
          <Button
            variant="secondary"
            onClick={() => fetchNextPage()}
            loading={isFetching}
          >
            More
          </Button>
        )}
      </div>
    </SortableContext>
  );
};

export default IssueKanbanColumn;
