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

import { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';

import { Badge, Icon } from '@ufb/react';

import type { Category } from '@/entities/category';
import type { Issue } from '@/entities/issue';
import { useIssueSearch } from '@/entities/issue';
import { getColumnsByCategory } from '@/widgets/issue-table/issue-table-columns';
import IssueDetailSheet from '@/widgets/issue-table/ui/issue-detail-sheet.ui';

import { useOAIQuery, useSort } from '../lib';
import { cn } from '../utils';
import type { TableFilterOperator } from './table-filter-popover';
import { BasicTable, TablePagination } from './tables';

const DEFAULT_META = {
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  itemCount: 0,
  itemsPerPage: 0,
};
interface Props {
  projectId: number;
  category: Category;
  queries: Record<string, unknown>[];
  operator: TableFilterOperator;
}

const CategoryTableRow = (props: Props) => {
  const { projectId, category, queries, operator } = props;

  const { t } = useTranslation();

  const [rows, setRows] = useState<Issue[]>([]);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [isOpen, setIsOpen] = useState(category.id === 0);
  const [openIssueId, setOpenIssueId] = useState<number | null>(null);
  const currentIssue = useMemo(
    () => rows.find((v) => v.id === openIssueId),
    [rows, openIssueId],
  );

  const columns = useMemo(
    () => getColumnsByCategory(t, projectId),
    [t, projectId],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: meta.totalPages,
    rowCount: meta.totalItems,
    manualPagination: true,
    getRowId: (row) => String(row.id),
  });

  const { pagination, sorting } = table.getState();
  const sort = useSort(sorting);
  const { data, isLoading } = useIssueSearch(projectId, {
    queries: queries.concat([{ categoryId: category.id, condition: 'IS' }]),
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    operator,
    sort,
  });

  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  useEffect(() => {
    setRows(data?.items ?? []);
    setMeta(data?.meta ?? DEFAULT_META);
  }, [data]);

  return (
    <div>
      <div
        className={cn(
          'bg-neutral-tertiary flex h-12 cursor-pointer items-center rounded-t px-4',
          { 'rounded-b': !isOpen },
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <Icon
            name="RiArrowDownSLine"
            className={cn({ 'rotate-180': !isOpen })}
          />
          <span className={cn({ 'text-neutral-tertiary': category.id === 0 })}>
            {category.name}
          </span>
          {data?.meta.totalItems ?
            <Badge variant="outline" radius="large">
              {data.meta.totalItems}
            </Badge>
          : <></>}
        </div>
      </div>
      {isOpen && (
        <>
          <BasicTable
            table={table}
            disableRound
            onClickRow={(_, row) => setOpenIssueId(row.id)}
            isLoading={isLoading}
            emptyCaption="No issues found"
          />
          <div className="border-neutral-tertiary flex h-12 w-full items-center rounded-b border border-t-0 px-4">
            <TablePagination table={table} disableRowSelect disableLimit />
          </div>
        </>
      )}
      {currentIssue && (
        <IssueDetailSheet
          isOpen={!!currentIssue}
          close={() => setOpenIssueId(null)}
          data={currentIssue}
          projectId={projectId}
          issueTracker={issueTracker?.data}
        />
      )}
    </div>
  );
};

export default CategoryTableRow;
