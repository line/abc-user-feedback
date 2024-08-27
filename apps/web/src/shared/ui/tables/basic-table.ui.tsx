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
import Image from 'next/image';
import { flexRender } from '@tanstack/react-table';
import type { Table as ReactTable } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ufb/react';

import { cn } from '@/shared/utils';

import CheckedTableHead from './checked-table-head';
import TableLoadingRow from './table-loading-row';
import TableResizer from './table-resizer';

interface IProps<T> {
  table: ReactTable<T>;
  emptyComponent?: React.ReactNode;
  emptyCaption?: string;
  resiable?: boolean;
  isLoading?: boolean;
  onClickDelete?: () => void;
  createButton: React.ReactNode;
  classname?: string;
  onClickRow?: (row: T) => void;
}

function BasicTable<T>(props: IProps<T>) {
  const {
    table,
    emptyCaption,
    resiable = false,
    isLoading = false,
    onClickDelete,
    createButton,
    classname,
    onClickRow,
  } = props;

  return (
    <Table className={classname}>
      <TableHeader>
        <TableRow>
          {table.getIsSomeRowsSelected() ?
            <CheckedTableHead table={table} onClickDelete={onClickDelete} />
          : table.getFlatHeaders().map((header, i) => (
              <TableHead key={i} style={{ width: header.getSize() }}>
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
                </div>
                {resiable && header.column.getCanResize() && (
                  <TableResizer header={header} table={table} />
                )}
              </TableHead>
            ))
          }
        </TableRow>
        {isLoading && (
          <TableLoadingRow colSpan={table.getVisibleFlatColumns().length} />
        )}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ?
          <TableRow className="hover:bg-inherit">
            <TableCell colSpan={table.getFlatHeaders().length}>
              <div className="my-10 flex flex-col items-center justify-center gap-4">
                <Image
                  width={200}
                  height={200}
                  src="/assets/images/empty-image.png"
                  alt="empty image"
                />
                <p className="text-small text-neutral-tertiary">
                  {emptyCaption}
                </p>
                {createButton}
              </div>
            </TableCell>
          </TableRow>
        : table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.index}
              onClick={() => onClickRow && onClickRow(row.original)}
              className={cn({ 'cursor-pointer': !!onClickRow })}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={`${cell.id} ${cell.row.index}`}
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
}

export default BasicTable;
