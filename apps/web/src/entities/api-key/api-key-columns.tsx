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

import { CopyIconButton, DATE_TIME_FORMAT } from '@/shared';

import type { ApiKey } from './api-key.type';

const columnHelper = createColumnHelper<ApiKey>();

export const getApiKeyColumns = () => [
  columnHelper.accessor('value', {
    header: 'API KEY',
    cell: ({ getValue }) => (
      <div className="text-base-strong flex items-center">
        {getValue()}
        <CopyIconButton data={getValue()} />
      </div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('deletedAt', {
    header: 'Status',
    cell: ({ getValue }) => (
      <Badge color={getValue() === null ? 'green' : 'red'} radius="large">
        {getValue() === null ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
  }),
];
