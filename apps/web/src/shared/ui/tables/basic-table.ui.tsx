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
import { flexRender } from '@tanstack/react-table';
import type { Table as ReactTable } from '@tanstack/react-table';

import { TableSortIcon } from '@/components';

interface IProps<T> {
  table: ReactTable<T>;
  emptyComponent: React.ReactNode;
}

const BasicTable = <T extends object>(props: IProps<T>) => {
  const { table, emptyComponent } = props;

  return (
    <table className="table">
      <thead>
        <tr>
          {table.getFlatHeaders().map((header, i) => (
            <th key={i} style={{ width: header.getSize() }}>
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getCanSort() && (
                <TableSortIcon column={header.column} />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 ?
          <tr>
            <td colSpan={table.getFlatHeaders().length}>{emptyComponent}</td>
          </tr>
        : table.getRowModel().rows.map((row) => (
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
          ))
        }
      </tbody>
    </table>
  );
};

export default BasicTable;
