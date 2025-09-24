/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

import { Badge, Icon } from '@ufb/react';

import { cn, usePermissions } from '@/shared';
import { CategoryCombobox } from '@/entities/category';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

const baseStyles: React.CSSProperties = {
  position: 'relative',
};

const initialStyles = {
  x: 0,
  y: 0,
  scale: 1,
};

interface Props {
  item: Issue;
  issueTracker?: IssueTracker;
  onClick?: () => void;
}

const IssueKanbanColumnItem = (props: Props) => {
  const { item, issueTracker, onClick } = props;
  const { setNodeRef, listeners, isDragging, transform, attributes } =
    useSortable({ id: item.id });
  const perms = usePermissions();

  return (
    <motion.div
      ref={setNodeRef}
      layoutId={String(item.id)}
      style={baseStyles}
      animate={
        transform ?
          {
            x: transform.x,
            y: transform.y,
            scale: isDragging ? 1.05 : 1,
            zIndex: isDragging ? 1 : 0,
          }
        : initialStyles
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        scale: { duration: 0.25 },
        zIndex: { delay: isDragging ? 0 : 0.25 },
      }}
      onClick={onClick}
      className="bg-neutral-primary border-neutral-tertiary rounded-8 shadow-default flex items-stretch border"
    >
      <div className="flex flex-1 cursor-pointer flex-col gap-2 py-3 pl-4 hover:opacity-60">
        <div>
          <p className="text-neutral-primary text-base-strong">{item.name}</p>
          {item.description && (
            <p className="text-neutral-tertiary">{item.description}</p>
          )}
        </div>
        <div className="text-neutral-secondary flex flex-wrap gap-x-2">
          <div className="flex flex-shrink-0 items-center gap-1">
            <Icon name="RiMessage2Line" size={12} />
            <span>{item.feedbackCount}</span>
            <span>feedbacks</span>
          </div>
          {item.externalIssueId && (
            <div className="flex flex-shrink-0 items-center gap-1">
              <Icon name="RiTicketLine" size={12} />
              <span>
                {issueTracker?.ticketKey ?
                  `${issueTracker.ticketKey}-${item.externalIssueId}`
                : item.externalIssueId}
              </span>
            </div>
          )}
        </div>
        {item.category ?
          <Badge variant="subtle" className="w-fit">
            {item.category.name}
          </Badge>
        : <CategoryCombobox issueId={item.id} category={item.category}>
            <Badge variant="outline" className="cursor-pointer">
              Add Category
            </Badge>
          </CategoryCombobox>
        }
      </div>
      <button
        className={cn(
          'hover:bg-neutral-tertiary flex w-4 items-center justify-center hover:cursor-grab active:cursor-grabbing',
          {
            'hover:cursor-not-allowed hover:bg-inherit active:cursor-not-allowed':
              !perms.includes('issue_update'),
          },
        )}
        disabled={!perms.includes('issue_update')}
        {...attributes}
        {...listeners}
      >
        <Icon name="RiDraggable" className="text-neutral-tertiary" />
      </button>
    </motion.div>
  );
};

export default IssueKanbanColumnItem;
