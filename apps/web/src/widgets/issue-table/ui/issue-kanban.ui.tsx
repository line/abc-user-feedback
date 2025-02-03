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
import { useTranslation } from 'react-i18next';

import { ISSUES } from '@/shared';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

import IssueKanbanColumn from './issue-kanban-column.ui';
import IssueKanbanDndContext from './issue-kanban-dnd-context.ui';
import IssueKanbanDroppableContainer from './issue-kanban-droppable-container.ui';

interface Props {
  projectId: number;
  issueTracker?: IssueTracker;
}

const IssueKanban = (props: Props) => {
  const { projectId, issueTracker } = props;

  const { t } = useTranslation();

  const [items, setItems] = useState<Record<UniqueIdentifier, Issue[]>>({
    INIT: [],
    ON_REVIEW: [],
    IN_PROGRESS: [],
    RESOLVED: [],
    PENDING: [],
  });

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  );

  return (
    <IssueKanbanDndContext
      items={items}
      setItems={setItems}
      setContainers={setContainers}
    >
      <div className="grid grid-cols-5 items-start gap-4">
        <SortableContext
          items={containers}
          strategy={verticalListSortingStrategy}
        >
          {ISSUES(t).map((issue) => (
            <IssueKanbanDroppableContainer
              key={issue.key}
              id={issue.key}
              items={items[issue.key] ?? []}
            >
              <IssueKanbanColumn
                key={issue.key}
                issue={issue}
                projectId={projectId}
                issueTracker={issueTracker}
                items={items[issue.key] ?? []}
                setItems={setItems}
              />
            </IssueKanbanDroppableContainer>
          ))}
        </SortableContext>
      </div>
    </IssueKanbanDndContext>
  );
};

export default IssueKanban;
