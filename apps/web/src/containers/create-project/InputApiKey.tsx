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
import { randomBytes } from 'crypto';
import { Fragment, useMemo } from 'react';
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
import { useCreateProject } from '@/contexts/create-project.context';
import type { InputApiKeyType } from '@/types/api-key.type';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

const columnHelper = createColumnHelper<InputApiKeyType>();
const getColumns = (t: TFunction, onDelete: (index: number) => void) => [
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
        {t('main.setting.api-key-status.active')}
      </Badge>
    ),
    size: 150,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: ({ row }) => (
      <button
        className="icon-btn icon-btn-tertiary icon-btn-sm"
        onClick={() => onDelete(row.index)}
      >
        <Icon name="TrashFill" />
      </button>
    ),
    size: 100,
  }),
];

// API
const InputApiKey: React.FC = () => {
  const { input, onChangeInput } = useCreateProject();
  const { t } = useTranslation();
  const apiKeys = useMemo(() => input.apiKeys, [input.apiKeys]);

  const onDelete = (index: number) => {
    onChangeInput(
      'apiKeys',
      apiKeys.filter((_, i) => i !== index),
    );
  };

  const table = useReactTable({
    columns: getColumns(t, onDelete),
    data: apiKeys,
    getCoreRowModel: getCoreRowModel(),
  });

  const onCreate = () => {
    onChangeInput('apiKeys', [
      ...apiKeys,
      { value: randomBytes(10).toString('hex').toUpperCase() },
    ]);
  };

  return (
    <CreateProjectInputTemplate
      actionButton={
        <button className="btn btn-primary btn-md w-[120px]" onClick={onCreate}>
          {t('main.setting.button.create-api-key')}
        </button>
      }
    >
      <table className="table table-fixed">
        <thead>
          <tr>
            {table.getFlatHeaders().map((header, i) => (
              <th key={i} style={{ width: header.getSize() }}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apiKeys.length === 0 ? (
            <tr>
              <td colSpan={getColumns(t, onDelete).length}>
                <div className="my-32 flex flex-col items-center justify-center gap-3">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))
          )}
        </tbody>
      </table>
    </CreateProjectInputTemplate>
  );
};

export default InputApiKey;
