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

import { Fragment, useEffect, useState } from 'react';
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

import { CreateSectionTemplate } from '@/components/templates';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIQuery } from '@/hooks';
import type { ApiKeyType } from '@/types/api-key.type';

const columnHelper = createColumnHelper<ApiKeyType>();
const columns = (t: TFunction) => [
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
  }),
  columnHelper.display({
    header: 'Created',
    cell: () => (
      <p className="text-primary">{dayjs().format(DATE_TIME_FORMAT)}</p>
    ),
    size: 100,
  }),
  columnHelper.display({
    header: 'Status',
    cell: () => (
      <Badge color="blue" type="primary">
        {t('main.setting.api-key-status.active')}
      </Badge>
    ),
    size: 50,
  }),
];

interface IProps {
  projectId: number;
}

const ApiKeySection: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ApiKeyType[]>([]);
  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}/api-keys',
    variables: { projectId },
  });
  useEffect(() => {
    if (!data) return;
    setRows(data.items);
  }, [data]);

  const table = useReactTable({
    columns: columns(t),
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <CreateSectionTemplate title="Member 관리">
      <table className="table">
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={table.getFlatHeaders().length}>
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
    </CreateSectionTemplate>
  );
};

export default ApiKeySection;
