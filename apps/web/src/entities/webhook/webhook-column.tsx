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

import { cn, DATE_TIME_FORMAT } from '@/shared';

import WebhookEventCell from './ui/webhook-event-cell';
import WebhookSwitch from './ui/webhook-switch.ui';
import type { Webhook, WebhookInfo } from './webhook.type';

const columnHelper = createColumnHelper<Webhook>();

export const getWebhookColumns = (
  projectId: number,
  onUpdate: (id: number, data: WebhookInfo) => void,
) => [
  columnHelper.accessor('status', {
    header: () => <p className="w-full text-center">On/Off</p>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <WebhookSwitch webhook={row.original} onChangeUpdate={onUpdate} />
      </div>
    ),
    size: 100,
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue, row }) => (
      <span
        className={cn({ 'opacity-50': row.original.status === 'INACTIVE' })}
      >
        {getValue()}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    cell: ({ getValue, row }) => (
      <span
        className={cn('line-clamp-1 break-all', {
          'opacity-50': row.original.status === 'INACTIVE',
        })}
      >
        {getValue()}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('events', {
    header: 'Event Trigger',
    cell: ({ getValue, row }) => (
      <div
        className={cn('my-1 flex flex-wrap gap-1', {
          'opacity-50': row.original.status === 'INACTIVE',
        })}
      >
        {getValue()
          .filter((v) => v.status === 'ACTIVE')
          .map((v) => (
            <WebhookEventCell
              key={v.id}
              channels={v.channels}
              type={v.type}
              projectId={projectId}
            />
          ))}
      </div>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue, row }) => (
      <span
        className={cn({ 'opacity-50': row.original.status === 'INACTIVE' })}
      >
        {dayjs(getValue()).format(DATE_TIME_FORMAT)}
      </span>
    ),
    size: 150,
  }),
];
