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
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { HelpCardDocs, SettingMenuTemplate } from '@/components';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIQuery, usePermissions } from '@/hooks';
import type { WebhookType } from '@/types/webhook.type';
import WebhookDeleteDialog from './WebhookDeleteDialog';
import WebhookTypePopover from './WebhookTypePopover';
import WebhookUpsertDialog from './WebhookUpsertDialog';

const columnHelper = createColumnHelper<WebhookType>();

const getColumns = (projectId: number, refetch: () => Promise<any>) => [
  columnHelper.accessor('status', {
    header: '',
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <input
          type="checkbox"
          className={classNames('toggle toggle-sm', {
            'border-fill-primary bg-fill-primary': status === 'INACTIVE',
          })}
          checked={status === 'ACTIVE'}
        />
      );
    },
    size: 50,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue }) => getValue(),
    size: 75,
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    cell: ({ getValue }) => getValue(),
    size: 100,
  }),
  columnHelper.accessor('events', {
    header: 'Event',
    cell: ({ getValue }) => (
      <div className="flex flex-wrap gap-2.5">
        {getValue().map((v) => (
          <WebhookTypePopover
            key={v.id}
            projectId={projectId}
            channelIds={v.channelIds}
            type={v.type}
          />
        ))}
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Edit',
    cell: ({ row }) => (
      <WebhookUpsertDialog
        projectId={projectId}
        defaultValues={row.original}
        refetch={refetch}
      >
        <button className="icon-btn icon-btn-sm icon-btn-tertiary">
          <Icon name="EditFill" />
        </button>
      </WebhookUpsertDialog>
    ),
    size: 50,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: ({ row }) => (
      <WebhookDeleteDialog
        projectId={projectId}
        webhookId={row.original.id}
        refetch={refetch}
      />
    ),
    size: 50,
  }),
];

interface IProps {
  projectId: number;
}

const WebhookSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions();
  const [rows, setRows] = useState<WebhookType[]>([]);
  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/webhooks',
    variables: { projectId },
  });

  useEffect(() => {
    if (!data) setRows([]);
    else setRows(data.items);
  }, [data]);

  const table = useReactTable({
    columns: getColumns(projectId, refetch),
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.webhook-integration')}
      action={
        <WebhookUpsertDialog projectId={projectId} refetch={refetch}>
          <button
            className="btn btn-primary"
            disabled={!perms.includes('project_webhook_create')}
          >
            {t('button.create', { name: 'Webhook' })}
          </button>
        </WebhookUpsertDialog>
      }
    >
      <div className="flex items-center rounded border px-6 py-2">
        <p className="flex-1 whitespace-pre-line py-5">
          <HelpCardDocs i18nKey="help-card.webhook" />
        </p>
        <div className="relative h-full w-[90px]">
          <Image
            src="/assets/images/webhook-help.png"
            style={{ objectFit: 'contain' }}
            alt="temp"
            fill
          />
        </div>
      </div>
      <table className="table">
        <thead>
          {table.getFlatHeaders().map((header) => (
            <th key={header.index} style={{ width: header.getSize() }}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.index}
              className={classNames({
                'text-tertiary': row.original.status === 'INACTIVE',
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={`${cell.id} ${cell.row.index}`}
                  className="border-none"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </SettingMenuTemplate>
  );
};

export default WebhookSetting;
