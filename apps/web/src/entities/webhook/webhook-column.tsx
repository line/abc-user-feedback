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

import { UpdateWebhookPopover } from './ui';
import DeleteWebhookPopover from './ui/delete-webhook-popover.ui';
import WebhookEventCell from './ui/webhook-event-cell';
import WebhookSwitch from './ui/webhook-switch.ui';
import type { Webhook, WebhookInfo } from './webhook.type';

const columnHelper = createColumnHelper<Webhook>();

export const getWebhookColumns = (
  projectId: number,
  onDelete: (webhookId: number) => void,
  onUpdate: (webhookId: number, input: WebhookInfo) => void,
) => [
  columnHelper.accessor('status', {
    header: '',
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <WebhookSwitch webhook={row.original} onChangeUpdate={onUpdate} />
        </div>
      );
    },
    size: 65,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue, row }) => (
      <span
        className={cn({ 'text-tertiary': row.original.status === 'INACTIVE' })}
      >
        {getValue()}
      </span>
    ),
    size: 75,
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    cell: ({ getValue, row }) => (
      <span
        className={cn('line-clamp-2 break-all', {
          'text-tertiary': row.original.status === 'INACTIVE',
        })}
      >
        {getValue()}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor('events', {
    header: 'Event',
    cell: ({ getValue, row }) => (
      <div
        className={cn('my-1 flex flex-wrap gap-x-2.5 gap-y-1', {
          'text-tertiary': row.original.status === 'INACTIVE',
        })}
      >
        {getValue()
          .filter((v) => v.status === 'ACTIVE')
          .map((v) => (
            <WebhookEventCell
              key={v.id}
              channels={v.channels}
              type={v.type}
              webhookStatus={row.original.status}
            />
          ))}
      </div>
    ),
    size: 300,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue, row }) => (
      <span
        className={cn({ 'text-tertiary': row.original.status === 'INACTIVE' })}
      >
        {dayjs(getValue()).format(DATE_TIME_FORMAT)}
      </span>
    ),
    size: 150,
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Edit',
    cell: ({ row }) => (
      <UpdateWebhookPopover
        projectId={projectId}
        webhook={row.original}
        onClickUpdate={onUpdate}
      />
    ),
    size: 50,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: ({ row }) => (
      <DeleteWebhookPopover
        webhookId={row.original.id}
        onClickDelete={onDelete}
      />
    ),
    size: 50,
  }),
];
