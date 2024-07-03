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
import { Trans } from 'next-i18next';

import { Badge, Icon, toast } from '@ufb/ui';

import { DATE_TIME_FORMAT } from '@/shared';

import type { ApiKey } from './api-key.type';

const columnHelper = createColumnHelper<ApiKey>();

export const getApiKeyColumns = (onDelete?: (id: number) => void) => [
  columnHelper.accessor('value', {
    header: 'API KEY',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        {getValue()}
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          onClick={() => {
            try {
              navigator.clipboard.writeText(getValue());
              toast.positive({
                title: <Trans i18nKey="toast.copy" />,
                iconName: 'CopyFill',
              });
            } catch (error) {
              toast.negative({ title: 'fail' });
            }
          }}
        >
          <Icon name="Clips" size={16} className="cursor-pointer" />
        </button>
      </div>
    ),
    size: 300,
  }),
  columnHelper.display({
    header: 'Created',
    cell: () => (
      <p className="text-primary">{dayjs().format(DATE_TIME_FORMAT)}</p>
    ),
    size: 150,
  }),
  columnHelper.display({
    header: 'Status',
    cell: () => (
      <Badge color="blue" type="primary">
        <Trans i18nKey="main.setting.api-key-status.active" />
      </Badge>
    ),
    size: 150,
  }),
  ...(onDelete ?
    [
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: ({ row }) => (
          <button
            className="icon-btn icon-btn-tertiary icon-btn-sm"
            onClick={() => onDelete(row.original.id)}
          >
            <Icon name="TrashFill" />
          </button>
        ),
        size: 100,
      }),
    ]
  : []),
];
