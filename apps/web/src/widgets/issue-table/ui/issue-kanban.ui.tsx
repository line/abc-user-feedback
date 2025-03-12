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

import { useState } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { toast } from '@ufb/react';

import type { TableFilterOperator } from '@/shared';
import { client, ISSUES } from '@/shared';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

import IssueKanbanColumn from './issue-kanban-column.ui';
import IssueKanbanDndContext from './issue-kanban-dnd-context.ui';

interface Props {
  projectId: number;
  issueTracker?: IssueTracker;
  queries: Record<string, unknown>[];
  operator: TableFilterOperator;
}

const IssueKanban = (props: Props) => {
  const { projectId, issueTracker, queries, operator } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<Record<UniqueIdentifier, Issue[]>>({
    INIT: [],
    ON_REVIEW: [],
    IN_PROGRESS: [],
    RESOLVED: [],
    PENDING: [],
  });

  const { mutate } = useMutation({
    mutationFn: (input: { item: Issue; status: string }) => {
      const { item, status } = input;
      return client.put({
        path: '/api/admin/projects/{projectId}/issues/{issueId}',
        pathParams: { projectId, issueId: item.id },
        body: { ...item, status: status as Issue['status'] },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['/api/admin/projects/{projectId}/issues/search'],
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  );

  return (
    <IssueKanbanDndContext
      items={items}
      setItems={setItems}
      setContainers={setContainers}
      updateStatus={(item, status) => mutate({ item, status })}
    >
      <div className="grid grid-cols-5 items-start gap-4">
        <SortableContext
          items={containers}
          strategy={verticalListSortingStrategy}
        >
          {ISSUES(t).map((issue) => (
            <IssueKanbanColumn
              key={issue.key}
              issue={issue}
              projectId={projectId}
              issueTracker={issueTracker}
              items={items[issue.key] ?? []}
              setItems={setItems}
              queries={queries}
              operator={operator}
            />
          ))}
        </SortableContext>
      </div>
    </IssueKanbanDndContext>
  );
};

export default IssueKanban;
