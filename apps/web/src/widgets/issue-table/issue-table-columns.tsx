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

import { Tag } from '@ufb/react';

import { DATE_TIME_FORMAT, ExpandableText, ISSUES } from '@/shared';
import CategoryCombobox from '@/shared/ui/category-combobox.ui';
import type { Issue } from '@/entities/issue';
import { IssueBadge } from '@/entities/issue';

import TicketLink from './ui/ticket-link.ui';

const columnHelper = createColumnHelper<Issue>();

export const getColumnsByCategory = (t: TFunction, projectId: number) => [
  columnHelper.accessor('name', {
    header: 'Title',
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
    size: 200,
    minSize: 100,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => (
      <IssueBadge
        name={ISSUES(t).find((v) => v.key === row.original.status)?.name ?? '-'}
        status={row.original.status}
      />
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
    size: 150,
    minSize: 50,
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 150,
    minSize: 50,
  }),
  columnHelper.display({
    id: 'Action',
    header: 'Category',
    cell: ({ row }) => {
      const { category, id } = row.original;
      return (
        <CategoryCombobox issueId={id} category={category}>
          <Tag variant="outline" size="small">
            {category ? 'Edit' : 'Add'}
          </Tag>
        </CategoryCombobox>
      );
    },
  }),
];
