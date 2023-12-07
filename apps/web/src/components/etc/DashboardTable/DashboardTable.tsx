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
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import DescriptionTooltip from '../DescriptionTooltip';
import type { ISelectBoxProps } from '../SelectBox';
import SelectBox from '../SelectBox';
import TableSortIcon from '../TableSortIcon';

interface IProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: ColumnDef<T, any>[];
  select?: ISelectBoxProps<false>;
}

function DashboardTable<T>(props: IProps<T>) {
  const { title, description, columns, data, select } = props;
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columns,
    data,
    enableSorting: true,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="border-fill-tertiary rounded border">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-1">
          <h3 className="font-20-bold">{title}</h3>
          {description && <DescriptionTooltip description={description} />}
        </div>
        <div className="flex items-center gap-2">
          {select && <SelectBox {...select} />}
          <button className="btn btn-secondary">필터설정</button>
        </div>
      </div>
      <div className="mb-5 h-[336px] overflow-x-hidden overflow-y-scroll">
        <table className="mx-2 w-full">
          <thead>
            <tr className="h-14">
              {table.getFlatHeaders().map((header, i) => (
                <th
                  key={i}
                  style={{ width: header.getSize() }}
                  className="font-14-regular text-secondary px-3 text-left"
                >
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
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.index}>
                <tr className="h-14 ">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`${cell.id} ${cell.row.index}`}
                      className="border-none px-3"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardTable;
