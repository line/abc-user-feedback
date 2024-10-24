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
import { useMemo } from 'react';
import Image from 'next/image';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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

import DraggableRow from './draggable-row.ui';
import TableLoadingRow from './table-loading-row';
import TableResizer from './table-resizer';

interface IProps<T> {
  table: ReactTable<T>;
  emptyComponent?: React.ReactNode;
  emptyCaption?: string;
  resiable?: boolean;
  isLoading?: boolean;
  createButton?: React.ReactNode;
  className?: string;
  onClickRow?: (index: number, row: T) => void;
  reoder?: (data: T[]) => void;
}

const BasicTable = <T,>(props: IProps<T>) => {
  const {
    table,
    emptyCaption,
    resiable = false,
    isLoading = false,
    createButton,
    className,
    onClickRow,
    reoder,
  } = props;

  // reorder rows after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id as string);
      const newIndex = dataIds.indexOf(over.id as string);
      reoder?.(
        arrayMove(
          table.getRowModel().rows.map((v) => v.original),
          oldIndex,
          newIndex,
        ),
      );
    }
  }
  const dataIds = useMemo(() => {
    return table.getRowModel().rows.map((row) => row.id);
  }, [table.getRowModel().rows]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <Table
        className={cn(
          className,
          'border-separate border-spacing-0 rounded border',
          {
            'h-full': dataIds.length === 0,
          },
        )}
      >
        <TableHeader>
          <TableRow>
            {table.getFlatHeaders().map((header, i) => (
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
            ))}
          </TableRow>
          {isLoading && (
            <TableLoadingRow colSpan={table.getVisibleFlatColumns().length} />
          )}
        </TableHeader>
        <TableBody>
          {table.getRowCount() === 0 ?
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
          : <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow
                  key={row.id}
                  row={row}
                  onClickRow={() =>
                    onClickRow?.(Number(row.index), row.original)
                  }
                />
              ))}
            </SortableContext>
          }
        </TableBody>
      </Table>
    </DndContext>
  );
};

export default BasicTable;
