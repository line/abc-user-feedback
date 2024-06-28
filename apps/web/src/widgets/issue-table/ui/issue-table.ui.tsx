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
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { Row } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Icon, toast } from '@ufb/ui';

import {
  CheckedTableHead,
  TableCheckbox,
  TableLoadingRow,
  TablePagination,
  TableResizer,
  TableRow,
  TableSortIcon,
} from '@/shared';
import type { Issue } from '@/entities/issue';
import { FeedbackTableInIssue } from '@/widgets/feedback-table';

import { getColumns } from '../issue-table-columns';
import { useIssueQuery } from '../lib';
import IssueDeletionPopover from './issue-deletion-popover.ui';
import IssueTableSelectBox from './issue-select-box.ui';
import IssueSettingPopover from './issue-setting-popover.ui';

import { DateRangePicker, TableSearchInput } from '@/components';
import type { SearchItemType } from '@/components/etc/TableSearchInput/TableSearchInput';
import { ShareButton } from '@/containers/buttons';
import {
  useIssueCount,
  useIssueSearch,
  useOAIQuery,
  usePermissions,
  useSort,
} from '@/hooks';
import type { IssueTrackerType } from '@/types/issue-tracker.type';

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const IssueTable: React.FC<IProps> = ({ projectId }) => {
  const perms = usePermissions();

  const { t } = useTranslation();
  const overlay = useOverlay();

  const [rows, setRows] = useState<Issue[]>([]);

  const { query, setQuery, dateRange, setDateRange, formattedQuery } =
    useIssueQuery(projectId);

  const { data: issueCountData, refetch: refetchIssueCount } = useIssueCount(
    projectId,
    formattedQuery,
  );

  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const table = useReactTable({
    data: rows,
    columns: getColumns(t, projectId),
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    manualSorting: true,
    manualPagination: true,
  });

  const { sorting, pagination } = table.getState();

  const sort = useSort(sorting);

  const {
    data,
    refetch: refetchIssueSearch,
    isLoading,
  } = useIssueSearch(projectId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    query: formattedQuery,
    sort: sort as Record<string, never>,
  });

  useEffect(() => {
    table.resetRowSelection();
    table.resetPageIndex();
  }, [query]);

  useEffect(() => {
    setRows(data?.items ?? []);
  }, [data]);

  const onClickTableRow = (row: Row<Issue>) => () => {
    table.resetExpanded();
    row.toggleExpanded(!row.getIsExpanded());
  };

  const columnInfo = useMemo(
    () =>
      [
        { key: 'id', format: 'number', name: 'ID' },
        { key: 'name', format: 'text', name: 'Name' },
        { key: 'description', format: 'text', name: 'Description' },
        { key: 'externalIssueId', format: 'text', name: 'Ticket' },
        { key: 'updatedAt', format: 'date', name: 'Updated' },
      ] as SearchItemType[],
    [t],
  );

  const onChangeInputSearch = (input: Record<string, any>) => {
    const { status, createdAt } = query;
    setQuery({ status, createdAt, ...input });
  };

  const refetch = async () => {
    await refetchIssueSearch();
    await refetchIssueCount();
  };

  const openIssueDeletionPopover = () => {
    return overlay.open(({ isOpen, close }) => (
      <IssueDeletionPopover
        open={isOpen}
        close={close}
        onSuccess={async () => {
          await refetch();
          toast.negative({ title: t('toast.delete') });
          table.resetRowSelection();
          close();
        }}
        projectId={projectId}
        table={table}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-2">
      <IssueTableSelectBox
        currentIssueKey={query.status}
        issueCountData={issueCountData}
        onChangeOption={(status) => setQuery({ ...query, status })}
      />
      <div className="flex items-center justify-between">
        <h2 className="font-18-regular">
          {t('text.search-result')}{' '}
          <span className="font-18-bold">
            {t('text.number-count', { count: data?.meta.totalItems ?? 0 })}
          </span>
        </h2>
        <div className="flex items-center gap-4">
          <TablePagination
            limit={pagination.pageSize}
            nextPage={() => table.setPageIndex((page) => page + 1)}
            prevPage={() => table.setPageIndex((page) => page - 1)}
            disabledNextPage={
              pagination.pageIndex >= (data?.meta.totalPages ?? 1)
            }
            disabledPrevPage={pagination.pageIndex <= 1}
            setLimit={table.setPageSize}
          />
          <div className="w-[300px]">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              maxDate={new Date()}
              isClearable
            />
          </div>
          <TableSearchInput
            searchItems={columnInfo}
            onChangeQuery={onChangeInputSearch}
            query={query}
          />
        </div>
      </div>
      <div className="overflow-auto">
        <table
          className="table table-fixed"
          style={{ width: table.getCenterTotalSize(), minWidth: '100%' }}
        >
          <colgroup>
            {table.getFlatHeaders().map((header) => (
              <col key={header.index} width={header.getSize()} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {table.getIsSomePageRowsSelected() ?
                <CheckedTableHead
                  table={table}
                  onClickDelete={openIssueDeletionPopover}
                  disabled={!perms.includes('issue_delete')}
                />
              : table.getFlatHeaders().map((header, i) => (
                  <th key={i} style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <TableSortIcon column={header.column} />
                    )}
                    {header.column.getCanResize() && (
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
                <td colSpan={table.getVisibleFlatColumns().length}>
                  <div className="my-60 flex flex-col items-center justify-center gap-3">
                    <Icon
                      name="WarningTriangleFill"
                      className="text-tertiary"
                      size={56}
                    />
                    <p>{t('text.no-data')}</p>
                  </div>
                </td>
              </tr>
            : table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    isSelected={row.getIsExpanded()}
                    onClick={onClickTableRow(row)}
                    hoverElement={
                      <>
                        <TableCheckbox
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          indeterminate={row.getIsSomeSelected()}
                          onChange={row.getToggleSelectedHandler()}
                        />
                        <ShareButton
                          pathname={`/main/project/${projectId}/issue?id=${row.original.id}`}
                        />
                        <IssueSettingPopover
                          issue={row.original}
                          refetch={refetch}
                          issueTracker={
                            issueTracker?.data as IssueTrackerType | undefined
                          }
                          disabled={!perms.includes('issue_update')}
                        />
                      </>
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <tr>
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="bg-fill-quaternary p-4"
                      >
                        <div className="bg-primary rounded p-4">
                          <FeedbackTableInIssue
                            projectId={projectId}
                            issueId={row.original.id}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTable;
