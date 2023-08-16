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
import { faker } from '@faker-js/faker';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { ExpandableText } from '@/components/etc';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import EditableCell from '@/containers/tables/FeedbackTable/EditableCell/EditableCell';
import { FieldType } from '@/types/field.type';

import { FieldRowType } from './FieldSetting';

const columnHelper = createColumnHelper<any>();

interface IProps extends React.PropsWithChildren {
  fields: FieldRowType[];
}

const PreviewTable: React.FC<IProps> = ({ fields }) => {
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    const fakeRows: Record<string, any>[] = [];
    for (let i = 1; i <= 8; i++) {
      const fakeData: Record<string, any> = {};
      for (const field of fields) {
        if (field.type === 'DEFAULT') {
          fakeData[field.name] =
            field.key === 'id'
              ? i
              : field.key === 'createdAt' || field.key === 'updatedAt'
              ? dayjs()
              : null;
        } else if (field.type === 'API') {
          fakeData[field.name] =
            field.format === 'boolean'
              ? faker.datatype.boolean()
              : field.format === 'date'
              ? faker.datatype.datetime()
              : field.format === 'keyword'
              ? faker.word.noun()
              : field.format === 'multiSelect'
              ? faker.helpers.arrayElements(
                  (field.options ?? []).map((v) => v.name),
                )
              : field.format === 'select'
              ? faker.helpers.arrayElement(
                  (field.options ?? []).map((v) => v.name),
                )
              : field.format === 'number'
              ? faker.datatype.number()
              : field.format === 'text'
              ? faker.lorem.text()
              : null;
        }
      }
      fakeRows.push(fakeData);
    }
    setRows(fakeRows);
  }, [fields]);

  const columns = useMemo(
    () =>
      fields.map((field) =>
        columnHelper.accessor(field.name, {
          size: field.key === 'id' ? 50 : field.format === 'text' ? 200 : 150,
          cell: (info) =>
            field.type === 'ADMIN' ? (
              <EditableCell
                field={field as FieldType}
                value={info.getValue()}
                isExpanded={info.row.getIsExpanded()}
                feedbackId={info.row.original.id}
              />
            ) : typeof info.getValue() ===
              'undefined' ? undefined : field.format === 'date' ? (
              dayjs(info.getValue() as string).format(DATE_TIME_FORMAT)
            ) : field.format === 'multiSelect' ? (
              ((info.getValue() ?? []) as string[]).join(', ')
            ) : field.format === 'text' ? (
              <ExpandableText isExpanded={info.row.getIsExpanded()}>
                {info.getValue() as string}
              </ExpandableText>
            ) : (
              String(info.getValue())
            ),
        }),
      ),
    [fields],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table
      className="table table-fixed"
      style={{ width: table.getCenterTotalSize(), minWidth: '100%' }}
    >
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
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <tr>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                    border: 'none',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default PreviewTable;
