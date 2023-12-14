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
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { TableSortIcon } from '@/components';
import { CreateSectionTemplate } from '@/components/templates';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIQuery } from '@/hooks';
import type { MemberType } from '@/types/member.type';

const columnHelper = createColumnHelper<MemberType>();
const columns = [
  columnHelper.accessor('user.email', {
    header: 'Email',
    enableSorting: false,
  }),
  columnHelper.accessor('user.name', {
    header: 'Name',
    enableSorting: false,
    cell: ({ getValue }) => ((getValue() ?? '').length > 0 ? getValue() : '-'),
  }),
  columnHelper.accessor('user.department', {
    header: 'Department',
    enableSorting: false,
    cell: ({ getValue }) => ((getValue() ?? '').length > 0 ? getValue() : '-'),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Joined',
    cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
    enableSorting: true,
  }),
  columnHelper.accessor('role.name', {
    header: 'Role',
    cell: ({ getValue }) => getValue(),
    enableSorting: false,
  }),
];

interface IProps {
  projectId: number;
}

const MemberSection: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<MemberType[]>([]);
  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}/members',
    variables: { projectId, createdAt: 'ASC' },
  });
  useEffect(() => {
    if (!data) return;
    setRows(data.members);
  }, [data]);
  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <CreateSectionTemplate title={t('main.setting.subtitle.member-mgmt')}>
      <table className="table">
        <thead>
          <tr>
            {table.getFlatHeaders().map((header, i) => (
              <th key={i} style={{ width: header.getSize() }}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.column.getCanSort() && (
                  <TableSortIcon column={header.column} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="my-32 flex flex-col items-center justify-center gap-3">
                  <Icon
                    name="DriverRegisterFill"
                    className="text-tertiary"
                    size={56}
                  />
                  <p>{t('text.no-data')}</p>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.index}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`${cell.id} ${cell.row.index}`}
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

export default MemberSection;
