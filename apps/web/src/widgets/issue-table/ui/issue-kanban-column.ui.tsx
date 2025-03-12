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

import { useEffect, useMemo, useState } from 'react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@ufb/react';

import type { IssuesItem, TableFilterOperator } from '@/shared';
import { useIssueSearchInfinite } from '@/entities/issue';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

import IssueDetailSheet from './issue-detail-sheet.ui';
import IssueKanbanColumnHeader from './issue-kanban-column-header.ui';
import IssueKanbanColumnItem from './issue-kanban-column-item.ui';

const DEFAULT_META = {
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  itemCount: 0,
  itemsPerPage: 0,
};

interface Props {
  issue: IssuesItem;
  projectId: number;
  issueTracker?: IssueTracker;
  items: Issue[];
  setItems: React.Dispatch<React.SetStateAction<Record<string, Issue[]>>>;
  queries: Record<string, unknown>[];
  operator: TableFilterOperator;
}

const IssueKanbanColumn = (props: Props) => {
  const { issue, projectId, issueTracker, items, setItems, queries, operator } =
    props;

  const [sort, setSort] = useState({ key: 'createdAt', value: 'DESC' });
  const [meta, setMeta] = useState(DEFAULT_META);

  const [openIssueId, setOpenIssueId] = useState<number | null>(null);
  const currentIssue = useMemo(
    () => items.find((v) => v.id === openIssueId),
    [items, openIssueId],
  );

  const { setNodeRef, transform, transition } = useSortable({
    id: issue.key,
    data: { type: 'container', children: items },
  });

  const { data, hasNextPage, fetchNextPage, isFetching } =
    useIssueSearchInfinite(projectId, {
      queries: queries.concat([{ status: issue.status, condition: 'IS' }]),
      sort: { [sort.key]: sort.value },
      limit: 5,
      operator,
    });

  useEffect(() => {
    setItems((items) => ({
      ...items,
      [issue.status]: data.pages.flatMap((page) => page?.items ?? []),
    }));
    setMeta(data.pages[0]?.meta ?? DEFAULT_META);
  }, [data]);

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="rounded-16 bg-neutral-tertiary flex flex-col gap-2 px-2 py-3">
          <IssueKanbanColumnHeader
            issue={issue}
            totalItems={meta.totalItems}
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
              <IssueKanbanColumnItem
                key={item.id}
                item={item}
                issueTracker={issueTracker}
                onClick={() => setOpenIssueId(item.id)}
              />
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
      {currentIssue && (
        <IssueDetailSheet
          isOpen={!!currentIssue}
          close={() => setOpenIssueId(null)}
          data={currentIssue}
          projectId={projectId}
          issueTracker={issueTracker}
        />
      )}
    </div>
  );
};

export default IssueKanbanColumn;
