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

import { Avatar, DATE_TIME_FORMAT, TableCheckbox } from '@/shared';

import type { MemberInfo } from './member.type';
import MemberNameCell from './ui/member-name-cell.ui';

const columnHelper = createColumnHelper<MemberInfo>();

export const memberColumns = [
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
    size: 30,
    enableSorting: false,
  }),
  columnHelper.accessor('user.email', {
    header: 'Email',
    enableSorting: false,
    cell: ({ getValue }) => <MemberNameCell email={getValue()} />,
  }),
  columnHelper.accessor('user.name', {
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
  }),
  columnHelper.accessor('user.department', {
    header: 'Department',
    enableSorting: false,
    cell: ({ getValue }) =>
      getValue() ? <Badge variant="subtle">{getValue()}</Badge> : '-',
  }),
  columnHelper.accessor('role.name', {
    header: 'Role',
    cell: ({ getValue }) => <Badge variant="subtle">{getValue()}</Badge>,
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Joined',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
  }),
];
