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

import React from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Issue } from '@/entities/issue';

interface Props extends React.PropsWithChildren {
  id: UniqueIdentifier;
  items: Issue[];
}

const IssueKanbanDroppableContainer = (props: Props) => {
  const { id, items, children } = props;

  const { active, isDragging, over, setNodeRef, transition, transform } =
    useSortable({ id, data: { type: 'container', children: items } });

  const isOverContainer =
    over ?
      (id === over.id && active?.data.current?.type !== 'container') ||
      items.some((v) => v.id === over.id)
    : false;

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
        ...(isOverContainer ?
          { backgroundColor: 'rgb(235, 235, 235, 1)' }
        : {}),
      }}
    >
      {children}
    </div>
  );
};

export default IssueKanbanDroppableContainer;
