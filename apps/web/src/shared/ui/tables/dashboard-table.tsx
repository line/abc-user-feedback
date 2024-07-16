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
import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import type { ISelectBoxProps } from '@/shared';
import { DescriptionTooltip, SelectBox } from '@/shared';

import ChartFilter from '../charts/chart-filter';
import TableSortIcon from './table-sort-icon';

interface IProps<T> {
  title: string;
  description?: string;
  selectData?: ISelectBoxProps<{ label: string; value: number }, false>;
  table: Table<T>;
  filterContent?: React.ReactNode;
}

function DashboardTable<T>(props: IProps<T>) {
  const { title, description, table, selectData, filterContent } = props;

  return (
    <div className="border-fill-tertiary bg-tertiary rounded border">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-1">
          <h3 className="font-20-bold">{title}</h3>
          {description && (
            <DescriptionTooltip description={description} placement="bottom" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectData && <SelectBox {...selectData} />}
          {filterContent && <ChartFilter>{filterContent}</ChartFilter>}
        </div>
      </div>
      <div className="mb-5 h-[310px] overflow-x-hidden overflow-y-scroll">
        <table className="mx-2 w-full">
          <thead>
            <tr className="h-14">
              {table.getFlatHeaders().map((header, i) => (
                <th
                  key={i}
                  style={{ width: header.getSize() }}
                  className="font-14-regular text-secondary px-3 text-left"
                >
                  <div className="flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <TableSortIcon column={header.column} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="h-14" key={row.index}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={`${cell.id} ${cell.row.index}`}
                    className="border-none px-3"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardTable;
