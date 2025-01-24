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
import React, { useMemo } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';

import { BasicTable, TablePagination } from '@/shared';
import type { FieldInfo } from '@/entities/field';

import { getColumns } from '../feedback-table-columns';
import type { Feedback } from '../feedback.type';
import FeedbackDetailSheet from './feedback-detail-sheet.ui';

interface Props {
  fields: FieldInfo[];
  feedbacks: Feedback[];
  rowCount: number;
  pageCount: number;
  pagination: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  isLoading?: boolean;
}

const FeedbackTable: React.FC<Props> = (props) => {
  const {
    fields,
    feedbacks,
    pageCount,
    rowCount,
    pagination,
    setPagination,
    isLoading,
  } = props;
  const columns = useMemo(() => getColumns(fields), [fields]);
  const overlay = useOverlay();

  const table = useReactTable({
    columns,
    data: feedbacks,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    rowCount,
    state: { pagination },
    onPaginationChange: setPagination,
    getRowId: (row) => String(row.id),
  });

  const openFeedbackDetail = (feedback: Feedback) => {
    overlay.open(({ close, isOpen }) => (
      <FeedbackDetailSheet
        isOpen={isOpen}
        close={close}
        feedback={feedback}
        fields={fields}
      />
    ));
  };

  return (
    <>
      <BasicTable
        table={table}
        className="table-fixed"
        onClickRow={(_, row) => openFeedbackDetail(row)}
        isLoading={isLoading}
      />
      <TablePagination table={table} />
    </>
  );
};

export default FeedbackTable;
