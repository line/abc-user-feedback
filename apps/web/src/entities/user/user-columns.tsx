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

import { Badge } from '@ufb/ui';

import { DATE_TIME_FORMAT, displayString, TableCheckbox } from '@/shared';

import UpdateUserPopover from './ui/update-user-popover.ui';
import type { UserMember } from './user.type';

const columnHelper = createColumnHelper<UserMember>();

export const getUserColumns = () => [
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
    size: 50,
    enableSorting: false,
  }),
  columnHelper.accessor('email', { header: 'Email', enableSorting: false }),
  columnHelper.accessor('type', { header: 'Type', enableSorting: false }),
  columnHelper.accessor('name', {
    header: 'Name',
    enableSorting: false,
    cell: ({ getValue }) => displayString(getValue()),
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    cell: ({ getValue }) => displayString(getValue()),
    enableSorting: false,
  }),
  columnHelper.accessor('members', {
    header: 'Project',
    cell: ({ getValue }) =>
      getValue().length > 0 ?
        <div className="flex flex-wrap gap-2">
          {getValue().map((member) => (
            <Badge key={member.id} type="secondary">
              {member.role.project.name}
            </Badge>
          ))}
        </div>
      : '-',
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Edit',
    cell: ({ row }) => <UpdateUserPopover user={row.original} />,
    size: 75,
  }),
];
