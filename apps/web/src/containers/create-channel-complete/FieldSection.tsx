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
import { Fragment } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Badge } from '@ufb/ui';

import { CreateSectionTemplate } from '@/components/templates/CreateSectionTemplate';
import type { FieldType } from '@/types/field.type';
import isNotEmptyStr from '@/utils/is-not-empty-string';
import OptionInfoPopover from '../setting-menu/FieldSetting/OptionInfoPopover';

const columnHelper = createColumnHelper<FieldType>();

const columns = [
  columnHelper.accessor('key', {
    header: 'Key',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
    size: 120,
  }),
  columnHelper.accessor('name', {
    header: 'Display Name',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
    size: 150,
  }),
  columnHelper.accessor('format', {
    header: 'Format',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
    size: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
  }),
  columnHelper.accessor('options', {
    header: 'Options',
    cell: ({ getValue }) => {
      const options = getValue() ?? [];
      return options.length > 0 ? <OptionInfoPopover options={options} /> : '-';
    },
    size: 100,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: ({ getValue }) => {
      const color =
        getValue() === 'API' ? 'blue'
        : getValue() === 'ADMIN' ? 'green'
        : 'black';
      const type =
        getValue() === 'API' ? 'primary'
        : getValue() === 'ADMIN' ? 'primary'
        : 'secondary';
      return (
        <Badge color={color} type={type}>
          {getValue()}
        </Badge>
      );
    },
    size: 100,
  }),
];

const fieldSort = (a: FieldType, b: FieldType) => {
  const aNum =
    a.type === 'DEFAULT' ? 1
    : a.type === 'API' ? 2
    : 3;
  const bNum =
    b.type === 'DEFAULT' ? 1
    : b.type === 'API' ? 2
    : 3;
  return aNum - bNum;
};

interface IProps {
  fields: FieldType[];
}

const FieldSection: React.FC<IProps> = ({ fields }) => {
  const { t } = useTranslation();
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: fields.sort(fieldSort),
  });

  return (
    <CreateSectionTemplate title={t('channel-setting-menu.field-mgmt')}>
      <table className="table rounded border">
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
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.index}>
              <tr>
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
            </Fragment>
          ))}
        </tbody>
      </table>
    </CreateSectionTemplate>
  );
};

export default FieldSection;
