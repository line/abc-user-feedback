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

import { Badge } from '@ufb/react';

import {
  Avatar,
  DATE_TIME_FORMAT,
  displayString,
  TableCheckbox,
} from '@/shared';

import type { UserMember } from './user.type';

const columnHelper = createColumnHelper<UserMember>();

export const getUserColumns = () => [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <TableCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <TableCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
    size: 50,
    enableSorting: false,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    enableSorting: false,
    size: 220,
  }),

  columnHelper.accessor('name', {
    header: 'Name',
    enableSorting: false,
    cell: ({ getValue }) => {
      const name = getValue();
      return name ?
          <>
            <Avatar name={name} />
            {name}
          </>
        : '-';
    },
    size: 120,
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    cell: ({ getValue }) => displayString(getValue()),
    enableSorting: false,
    size: 120,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    enableSorting: false,
    size: 80,
    filterFn: (row, id, value: UserMember['type'][]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ getValue }) => {
      return <Badge variant="subtle">{getValue()}</Badge>;
    },
  }),
  columnHelper.accessor('members', {
    header: 'Project',
    cell: ({ getValue, row }) =>
      row.original.type === 'SUPER' ? <Badge variant="subtle">All</Badge>
      : getValue().length > 0 ?
        <div className="flex flex-wrap gap-2">
          {getValue().map((member) => (
            <Badge key={member.id} variant="subtle">
              {member.role.project.name} ({member.role.name})
            </Badge>
          ))}
        </div>
      : '-',
    enableSorting: false,
    filterFn: (row, _, value: string[]) => {
      return row.original.members.some((member) =>
        value.includes(String(member.role.project.id)),
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
    enableSorting: true,
  }),
];
