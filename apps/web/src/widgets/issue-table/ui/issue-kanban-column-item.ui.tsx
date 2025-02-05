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
import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

import { Badge, Icon } from '@ufb/react';

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
            boxShadow:
              isDragging ?
                '0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
              : undefined,
          }
        : initialStyles
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        easings: { type: 'spring' },
        scale: { duration: 0.25 },
        zIndex: { delay: isDragging ? 0 : 0.25 },
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <div className="bg-neutral-primary border-neutral-tertiary rounded-8 shadow-default flex cursor-pointer flex-col gap-2 border px-4 py-3 hover:opacity-60">
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
        {item.category && (
          <Badge variant="subtle" className="w-fit">
            {item.category.name}
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

export default IssueKanbanColumnItem;
