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
import { flexRender } from '@tanstack/react-table';
import type { Table as ReactTable } from '@tanstack/react-table';

import { cn } from '@/shared/utils';

import CheckedTableHead from './checked-table-head';
import TableLoadingRow from './table-loading-row';
import TableResizer from './table-resizer';
import TableSortIcon from './table-sort-icon';

interface IProps<T> {
  table: ReactTable<T>;
  emptyComponent?: React.ReactNode;
  resiable?: boolean;
  isLoading?: boolean;
  onClickDelete?: () => void;
}

function BasicTable<T>(props: IProps<T>) {
  const {
    table,
    emptyComponent,
    resiable = false,
    isLoading = false,
    onClickDelete,
  } = props;

  return (
    <div className="overflow-auto">
      <table className="table w-full table-fixed">
        <thead>
          <tr>
            {table.getIsSomeRowsSelected() ?
              <CheckedTableHead table={table} onClickDelete={onClickDelete} />
            : table.getFlatHeaders().map((header, i) => (
                <th key={i} style={{ width: header.getSize() }}>
                  <div
                    className={cn('flex flex-nowrap items-center', {
                      'overflow-hidden text-ellipsis':
                        resiable && header.column.getCanResize(),
                    })}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <TableSortIcon column={header.column} />
                    )}
                  </div>
                  {resiable && header.column.getCanResize() && (
                    <TableResizer header={header} table={table} />
                  )}
                </th>
              ))
            }
          </tr>
          {isLoading && (
            <TableLoadingRow colSpan={table.getVisibleFlatColumns().length} />
          )}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ?
            <tr>
              <td colSpan={table.getFlatHeaders().length}>{emptyComponent}</td>
            </tr>
          : table.getRowModel().rows.map((row) => (
              <tr key={row.index}>
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
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default BasicTable;
