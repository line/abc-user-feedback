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
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {
  Column,
  ColumnOrderState,
  Header,
  Table as TTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { OverlayLoading, Pagination } from '@/components';
import { textCompressStyle } from '@/constants/style';
import { useOAIQuery } from '@/hooks';
import client from '@/libs/client';
import {
  useFeedbackTableStore,
  useSetFeedbackTableStore,
} from '@/stores/feedback-table.store';
import { DateRangeType } from '@/types/date-rage.type';
import { toDateRangeStr } from '@/utils/date-range-str';

import EditableCell from './EditableCell';

interface IProps extends React.PropsWithChildren {
  channelId: string;
}

const columnHelper = createColumnHelper<any>();

const FeedbackTable: React.FC<IProps> = ({ channelId }) => {
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    dateRange,
    isCellExpanded,
    columnVisibility,
    columnOrder,
    filterValues,
  } = useFeedbackTableStore();

  const { onColumnOrderChange } = useSetFeedbackTableStore();

  const { data: fieldData } = useOAIQuery({
    path: '/api/channels/{channelId}/fields',
    variables: { channelId },
  });

  useEffect(() => {
    setPage(1);
  }, [limit, filterValues]);

  useEffect(() => {
    setIsLoading(true);

    client
      .post({
        path: '/api/channels/{channelId}/feedbacks/search',
        pathParams: { channelId },
        body: {
          query: { ...toDateRangeStr(dateRange), ...filterValues } as any,
          page,
          limit,
        },
      })
      .then(({ data }) => {
        setRows(data?.items ?? []);
        setTotalPage(data ? Math.ceil(data.total / limit) : 0);
        setIsLoading(false);
      });
  }, [channelId, dateRange, page, filterValues, limit]);

  const columns = useMemo(
    () =>
      [columnHelper.accessor('id', { cell: (info) => info.getValue() })].concat(
        fieldData?.map((field) =>
          columnHelper.accessor(field.name, {
            minSize: 100,
            cell: (info) => {
              return field.isAdmin ? (
                <EditableCell
                  field={field}
                  value={info.getValue()}
                  channelId={channelId}
                  feedbackId={info.row.id}
                />
              ) : field.type === 'date' ? (
                dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss')
              ) : typeof info.getValue() === 'undefined' ? undefined : (
                String(info.getValue())
              );
            },
          }),
        ) ?? [],
      ),
    [fieldData],
  );

  useEffect(() => {
    if (!fieldData) return;
    onColumnOrderChange((prev) => {
      const columnsData = ['id'].concat(
        fieldData.sort((a, b) => a.order - b.order).map((v) => v.name),
      );
      if (prev.length === 0) return columnsData;
      if (columnsData.join('') === prev?.join('')) return prev;
      return columnOrder;
    });
  }, [columnOrder, fieldData]);

  const table = useReactTable({
    data: rows ?? [],
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getRowId: (originalRow) => originalRow.id,
    state: { columnVisibility, columnOrder },
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <OverlayLoading isLoading={isLoading} />

      <Table
        style={{
          width: table.getCenterTotalSize(),
          paddingRight: '24px',
          tableLayout: 'fixed',
        }}
        size="sm"
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <DraggableColumnHeader key={i} header={header} table={table} />
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row, i) => (
            <Tr key={i}>
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                    ...(isCellExpanded ? {} : textCompressStyle),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        meta={{
          currentPage: page,
          itemsPerPage: limit,
          totalPages: totalPage,
        }}
        onChangePage={setPage}
        limit={{
          onChangeLimit: setLimit,
          options: [10, 50, 100],
        }}
      />
    </DndProvider>
  );
};

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[],
): ColumnOrderState => {
  const draggedColumnIndex = columnOrder.indexOf(draggedColumnId);
  const targetColumnIndex = columnOrder.indexOf(targetColumnId);
  const results = columnOrder.slice();
  const firstItem = columnOrder[draggedColumnIndex];
  results[draggedColumnIndex] = columnOrder[targetColumnIndex];
  results[targetColumnIndex] = firstItem;

  return [...results];
};

const DraggableColumnHeader: React.FC<{
  header: Header<any, unknown>;
  table: TTable<any>;
}> = ({ header, table }) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<any>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder,
      );
      setColumnOrder(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  return (
    <Th
      ref={dropRef}
      key={header.id}
      colSpan={header.colSpan}
      style={{
        position: 'relative',
        width: header.getSize(),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div ref={previewRef}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button ref={dragRef}>🟰</button>

        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`resizer ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`}
        />
      </div>
    </Th>
  );
};

export default FeedbackTable;
