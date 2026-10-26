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

import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

import { Badge } from '@ufb/react';

import { CopyIconButton, DATE_TIME_FORMAT } from '@/shared';

import type { ApiKey, ApiKeyStatus } from './api-key.type';
import { getApiKeyStatus, maskApiKey } from './api-key.util';

const columnHelper = createColumnHelper<ApiKey>();

const STATUS_BADGE: Record<
  ApiKeyStatus,
  { color: 'green' | 'red' | 'orange'; label: string }
> = {
  active: { color: 'green', label: 'Active' },
  inactive: { color: 'red', label: 'Inactive' },
  expired: { color: 'orange', label: 'Expired' },
};

export const getApiKeyColumns = () => [
  columnHelper.accessor('prefix', {
    header: 'API KEY',
    cell: ({ row }) =>
      // The raw value exists only for keys that have not been saved yet.
      row.original.value ?
        <div className="text-base-strong flex items-center">
          {row.original.value}
          <CopyIconButton data={row.original.value} />
        </div>
      : <div className="text-base-strong font-mono">
          {maskApiKey(row.original)}
        </div>,
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { color, label } = STATUS_BADGE[getApiKeyStatus(row.original)];
      return (
        <Badge color={color} radius="large">
          {label}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('expiresAt', {
    header: 'Expires',
    cell: ({ getValue }) => {
      const expiresAt = getValue();
      return expiresAt ? dayjs(expiresAt).format(DATE_TIME_FORMAT) : 'Never';
    },
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
  }),
];
