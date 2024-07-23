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

import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'next-i18next';

import {
  DATE_TIME_FORMAT,
  ExpandableText,
  ISSUES,
  TableCheckbox,
} from '@/shared';
import type { Issue } from '@/entities/issue';
import { IssueBadge, IssueCircle } from '@/entities/issue';

import TicketLink from './ui/ticket-link.ui';

const columnHelper = createColumnHelper<Issue>();

export const getColumns = (t: TFunction, projectId: number) => [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <TableCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <TableCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    size: 40,
    enableResizing: false,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    cell: ({ getValue, row }) => (
      <ExpandableText isExpanded={row.getIsExpanded()}>
        {getValue()}
      </ExpandableText>
    ),
    size: 50,
    minSize: 50,
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => (
      <div className="overflow-hidden">
        <IssueBadge issue={row.original} />
      </div>
    ),
    size: 150,
    minSize: 50,
    enableSorting: false,
  }),
  columnHelper.accessor('feedbackCount', {
    header: 'Feedback Count',
    cell: ({ getValue }) => getValue().toLocaleString(),
    size: 160,
    minSize: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue, row }) => (
      <ExpandableText isExpanded={row.getIsExpanded()}>
        {getValue() ?? '-'}
      </ExpandableText>
    ),
    enableSorting: false,
    size: 300,
    minSize: 100,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <IssueCircle issueKey={getValue()} />
        {ISSUES(t).find((v) => v.key === getValue())?.name}
      </div>
    ),
    size: 100,
    minSize: 100,
  }),
  columnHelper.accessor('externalIssueId', {
    header: 'Ticket',
    cell: ({ getValue }) => (
      <TicketLink value={getValue()} projectId={projectId} />
    ),
    enableSorting: false,
    size: 100,
    minSize: 50,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 100,
    minSize: 50,
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 100,
    minSize: 50,
  }),
];
