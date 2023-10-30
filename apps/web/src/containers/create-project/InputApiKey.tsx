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
import { Fragment, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { Badge, Icon, toast } from '@ufb/ui';

import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import type { ApiKeyType } from '@/types/api-key.type';

const columnHelper = createColumnHelper<ApiKeyType>();
const columns = (t: TFunction) => [
  columnHelper.accessor('value', {
    header: 'API KEY',
    cell: ({ getValue, row }) => (
      <div
        className={[
          'flex items-center gap-1',
          row.original.deletedAt !== null ? 'text-tertiary' : '',
        ].join(' ')}
      >
        {getValue()}
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          onClick={() => {
            try {
              navigator.clipboard.writeText(getValue());
              toast.positive({
                title: t('toast.copy'),
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
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue, row }) => (
      <p className={row.original.deletedAt !== null ? 'text-tertiary' : ''}>
        {dayjs(getValue()).format(DATE_TIME_FORMAT)}
      </p>
    ),
    size: 100,
  }),
  columnHelper.accessor('deletedAt', {
    header: 'Status',
    cell: ({ getValue }) => (
      <Badge
        color={getValue() ? 'black' : 'blue'}
        type={getValue() ? 'secondary' : 'primary'}
      >
        {getValue()
          ? t('main.setting.api-key-status.inactive')
          : t('main.setting.api-key-status.active')}
      </Badge>
    ),
    size: 50,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: () => (
      <button className="icon-btn icon-btn-tertiary icon-btn-sm">
        <Icon name="TrashFill" />
      </button>
    ),
    size: 50,
  }),
];

// API
const InputApiKey: React.FC = () => {
  const { t } = useTranslation();
  const [rows] = useState([]);
  const table = useReactTable({
    columns: columns(t),
    data: [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="table">
      <thead>
        <tr>
          {table.getFlatHeaders().map((header, i) => (
            <th key={i} style={{ width: header.getSize() }}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr className="h-[240px]">
            <td colSpan={5} className="border-none">
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <Icon
                  name="WarningTriangleFill"
                  className="text-quaternary"
                  size={32}
                />
                <p className="text-secondary">{t('text.no-data')}</p>
              </div>
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-none"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            </Fragment>
          ))
        )}
      </tbody>
    </table>
  );
};

export const CreateApiKeyButton: React.FC = () => {
  return <button className="btn btn-primary btn-md w-[120px]">Key 생성</button>;
};

export default InputApiKey;
