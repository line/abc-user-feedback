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
import { useTranslation } from 'react-i18next';

import { Badge } from '@ufb/react';

import {
  Avatar,
  DATE_TIME_FORMAT,
  DescriptionTooltip,
  SortingTableHead,
} from '@/shared';

import type { User } from '../user';
import type { MemberInfo } from './member.type';

const columnHelper = createColumnHelper<MemberInfo>();

export const getMemberColumns = (users: User[]) => [
  columnHelper.accessor('user.email', {
    header: 'Email',
    enableSorting: false,
    cell: ({ getValue }) => {
      const { t } = useTranslation();
      return users.some((v) => v.email === getValue()) ? getValue() : (
          <div className="flex items-center gap-1">
            <span className="text-red-primary">{getValue()}</span>
            <DescriptionTooltip
              color="red"
              description={t('main.create-project.error-member')}
            />
          </div>
        );
    },
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
    header: ({ column }) => (
      <SortingTableHead column={column}>Joined</SortingTableHead>
    ),
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
  }),
];
