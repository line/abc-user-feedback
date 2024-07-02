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
import { memo, useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  DATE_TIME_FORMAT,
  ExpandableText,
  ISSUES,
  TableResizer,
} from '@/shared';
import { IssueBadge } from '@/entities/issue';
import type { Issue } from '@/entities/issue';
import EditableCell from '@/widgets/feedback-table/ui/editable-cell';

import type { FieldRowType } from './FieldSetting';

import { ImagePreviewButton } from '@/components/buttons';
import type { FieldType } from '@/types/field.type';

const columnHelper = createColumnHelper<any>();

interface IProps {
  fields: FieldRowType[];
}

const PreviewTable: React.FC<IProps> = ({ fields }) => {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fakeRows: Record<string, any>[] = [];
    const issues = faker.helpers
      .uniqueArray(faker.word.sample, 10)
      .map((v) => ({
        name: v,
        status: faker.helpers.arrayElement(ISSUES(t).map((v) => v.key)),
      }));

    for (let i = 1; i <= 1; i++) {
      const fakeData: Record<string, any> = {};
      for (const field of fields) {
        if (field.key === 'id') {
          fakeData[field.name] = i;
        } else if (field.key === 'createdAt' || field.key === 'updatedAt') {
          fakeData[field.name] = dayjs().add(i, 'hour');
        } else if (field.key === 'issues') {
          fakeData[field.name] = faker.helpers.arrayElements(issues, {
            min: 0,
            max: 4,
          });
        } else {
          fakeData[field.name] =
            field.format === 'date' ? faker.date.anytime()
            : field.format === 'keyword' ? faker.word.noun()
            : field.format === 'multiSelect' ?
              faker.helpers.arrayElements(
                (field.options ?? []).map((v) => v.name),
              )
            : field.format === 'select' ?
              faker.helpers.arrayElement(
                (field.options ?? []).map((v) => v.name),
              )
            : field.format === 'number' ? faker.number.int()
            : field.format === 'text' ? faker.lorem.text()
            : field.format === 'images' ?
              faker.helpers.arrayElements(
                Array.from(
                  { length: faker.number.int({ min: 1, max: 15 }) },
                  () => '/assets/images/sample_image.png',
                ),
              )
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
          size:
            field.key === 'id' ? 50
            : field.format === 'text' ? 200
            : 150,
          cell: (info) =>
            field.key === 'issues' ?
              <div className="scrollbar-hide flex items-center gap-1">
                {(info.getValue() as Issue[])?.map((v, i) => (
                  <IssueBadge key={i} issue={v} />
                ))}
              </div>
            : field.property === 'EDITABLE' ?
              <EditableCell
                field={field as FieldType}
                value={info.getValue()}
                isExpanded={info.row.getIsExpanded()}
                feedbackId={info.row.original.id}
              />
            : typeof info.getValue() === 'undefined' ? undefined
            : field.format === 'date' ?
              dayjs(info.getValue() as string).format(DATE_TIME_FORMAT)
            : field.format === 'multiSelect' ?
              ((info.getValue() ?? []) as string[]).join(', ')
            : field.format === 'text' ?
              <ExpandableText isExpanded={info.row.getIsExpanded()}>
                {info.getValue() as string}
              </ExpandableText>
            : field.format === 'images' ?
              <ImagePreviewButton urls={(info.getValue() ?? []) as string[]} />
            : String(info.getValue()),
        }),
      ),
    [fields],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onEnd',
  });

  return (
    <div className="overflow-x-auto">
      <table
        className="mb-2 table table-fixed"
        style={{ width: table.getCenterTotalSize(), minWidth: '100%' }}
      >
        <colgroup>
          {table.getFlatHeaders().map((header) => (
            <col key={header.index} width={header.getSize()} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {table.getFlatHeaders().map((header) => (
              <th key={header.index} style={{ width: header.getSize() }}>
                <div className="flex flex-nowrap items-center">
                  <span className="overflow-hidden text-ellipsis">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </span>
                </div>
                {header.column.getCanResize() && (
                  <TableResizer header={header} table={table} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize(), border: 'none' }}
                  className="overflow-hidden"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(
  PreviewTable,
  (prev, next) => JSON.stringify(prev.fields) === JSON.stringify(next.fields),
);
