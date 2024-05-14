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

import { Fragment, useCallback, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Badge, Icon } from '@ufb/ui';

import { useCreateChannel } from '@/contexts/create-channel.context';
import type { InputFieldType } from '@/types/field.type';
import { fieldProperty, isDefaultField } from '@/utils/field-utils';
import isNotEmptyStr from '@/utils/is-not-empty-string';
import FieldSettingPopover from '../setting-menu/FieldSetting/FieldSettingPopover';
import OptionInfoPopover from '../setting-menu/FieldSetting/OptionInfoPopover';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

const columnHelper = createColumnHelper<InputFieldType>();

const getColumns = (
  deleteField: (index: number) => void,
  modifyField: (input: InputFieldType, index: number) => void,
  fieldRows: InputFieldType[],
) => [
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
  columnHelper.accessor('property', {
    header: 'Property',
    cell: ({ getValue }) => {
      return <Badge type="secondary">{fieldProperty[getValue()]}</Badge>;
    },
    size: 120,
  }),
  columnHelper.display({
    id: 'delete',
    header: () => <p className="text-center">Delete</p>,
    cell: ({ row }) => (
      <div className="text-center">
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          disabled={isDefaultField(row.original)}
          onClick={() => deleteField(row.index)}
        >
          <Icon name="TrashFill" />
        </button>
      </div>
    ),
    size: 125,
  }),
  columnHelper.display({
    id: 'edit',
    header: () => <p className="text-center">Edit</p>,
    cell: ({ row }) => (
      <div className="text-center">
        <FieldSettingPopover
          onSave={(input) => modifyField(input, row.index)}
          data={row.original}
          disabled={isDefaultField(row.original)}
          fieldRows={fieldRows}
        />
      </div>
    ),
    size: 125,
  }),
];

interface IProps {}

const InputField: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateChannel();

  const fields = useMemo(() => input.fields, [input.fields]);
  const setFields = useCallback(
    (input: InputFieldType[]) => onChangeInput('fields', input),
    [],
  );

  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  const modifyField = (input: InputFieldType, index: number) => {
    setFields(fields.map((v, i) => (i === index ? input : v)));
  };

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns: getColumns(deleteField, modifyField, fields),
    data: fields,
    enableGlobalFilter: true,
  });

  return (
    <CreateChannelInputTemplate>
      <div className="flex justify-end">
        <button>
          <FieldSettingPopover
            onSave={(input) => setFields(fields.concat(input))}
            fieldRows={fields}
          />
        </button>
      </div>
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
    </CreateChannelInputTemplate>
  );
};

export default InputField;
