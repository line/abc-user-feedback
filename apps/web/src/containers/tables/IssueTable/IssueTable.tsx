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
import type {
  Row,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'next-i18next';
import { useTranslation } from 'next-i18next';

import { Badge, Icon, Popover, PopoverModalContent, toast } from '@ufb/ui';

import {
  TableCheckbox,
  TableLoadingRow,
  TablePagination,
  TableResizer,
  TableSortIcon,
} from '@/shared';
import { FeedbackTableInIssue } from '@/widgets/feedback-table';

import IssueSettingPopover from './IssueSettingPopover';
import IssueTableSelectBox from './IssueTableSelectBox';
import { TableRow } from './TableRow';
import TicketLink from './TicketLink';

import {
  DateRangePicker,
  ExpandableText,
  IssueCircle,
  TableSearchInput,
} from '@/components';
import type { SearchItemType } from '@/components/etc/TableSearchInput/TableSearchInput';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { getStatusColor, ISSUES } from '@/constants/issues';
import { ShareButton } from '@/containers/buttons';
import {
  useIssueCount,
  useIssueSearch,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useSort,
} from '@/hooks';
import useQueryParamsState from '@/hooks/useQueryParamsState';
import type { DateRangeType } from '@/types/date-range.type';
import type { IssueTrackerType } from '@/types/issue-tracker.type';
import type { IssueType } from '@/types/issue.type';

const columnHelper = createColumnHelper<IssueType>();

const getColumns = (t: TFunction, issueTracker?: IssueTrackerType) => [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <TableCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <TableCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    size: 40,
    enableResizing: false,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    cell: ({ getValue, row }) => (
      <ExpandableText isExpanded={row.getIsExpanded()}>
        {getValue()}
      </ExpandableText>
    ),
    size: 50,
    minSize: 50,
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue, row }) => (
      <div className="overflow-hidden">
        <Badge color={getStatusColor(row.original.status)} type="secondary">
          {getValue()}
        </Badge>
      </div>
    ),
    size: 150,
    minSize: 50,
    enableSorting: false,
  }),
  columnHelper.accessor('feedbackCount', {
    header: 'Feedback Count',
    cell: ({ getValue }) => getValue().toLocaleString(),
    size: 160,
    minSize: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue, row }) => (
      <ExpandableText isExpanded={row.getIsExpanded()}>
        {getValue() ?? '-'}
      </ExpandableText>
    ),
    enableSorting: false,
    size: 300,
    minSize: 100,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <IssueCircle issueKey={getValue()} />
        {ISSUES(t).find((v) => v.key === getValue())?.name}
      </div>
    ),
    size: 100,
    minSize: 100,
  }),
  columnHelper.accessor('externalIssueId', {
    header: 'Ticket',
    cell: ({ getValue }) =>
      getValue() ?
        issueTracker ?
          <TicketLink value={getValue()} issueTracker={issueTracker} />
        : getValue()
      : '-',
    enableSorting: false,
    size: 100,
    minSize: 50,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 100,
    minSize: 50,
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 100,
    minSize: 50,
  }),
];

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const IssueTable: React.FC<IProps> = ({ projectId }) => {
  const perms = usePermissions();

  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { query, setQuery } = useQueryParamsState(
    { projectId },
    { status: 'total' },
    (input) => {
      if (!input.createdAt) return true;
      const [starDate, endDate] = input.createdAt.split('~');
      if (dayjs(endDate).isAfter(dayjs(), 'day')) return false;
      if (dayjs(endDate).isBefore(dayjs(starDate), 'day')) return false;
      return true;
    },
  );

  const sort = useSort(sorting);
  const currentIssueKey = useMemo(() => query.status, [query]);

  useEffect(() => {
    setPage(1);
    setRowSelection({});
  }, [limit, query]);

  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection).map((v) => parseInt(v)),
    [rowSelection],
  );

  const formattedQuery = useMemo(() => {
    return Object.entries(query).reduce((prev, [key, value]) => {
      if (key === 'status' && value === 'total') return prev;
      if (key === 'createdAt' || key === 'updatedAt') {
        const [startDate, endDate] = value.split('~');
        return {
          ...prev,
          [key]: {
            gte: dayjs(startDate).startOf('day').toISOString(),
            lt: dayjs(endDate).endOf('day').toISOString(),
          },
        };
      }
      return { ...prev, [key]: value };
    }, {});
  }, [query]);

  const dateRange = useMemo(() => {
    const queryStr = query['createdAt'];
    if (!queryStr) return null;

    const [startDateStr, endDateStr] = queryStr.split('~');

    return {
      startDate: dayjs(startDateStr).toDate(),
      endDate: dayjs(endDateStr).toDate(),
    };
  }, [query]);

  const setDateRange = (dateRange: DateRangeType) => {
    setQuery({
      ...query,
      createdAt:
        dateRange ?
          `${dayjs(dateRange.startDate).format(DATE_FORMAT)}~${dayjs(
            dateRange.endDate,
          ).format(DATE_FORMAT)}`
        : undefined,
    });
  };

  const {
    data,
    refetch: refetchIssueSearch,
    isLoading,
  } = useIssueSearch(projectId, {
    page,
    limit,
    query: formattedQuery,
    sort: sort as Record<string, never>,
  });

  const { data: issueCountData, refetch: refetchIssueCount } = useIssueCount(
    projectId,
    formattedQuery,
  );

  const refetch = async () => {
    await refetchIssueSearch();
    await refetchIssueCount();
  };

  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const { mutate: deleteIssues, isPending: deleteIssuesPending } =
    useOAIMutation({
      method: 'delete',
      path: '/api/admin/projects/{projectId}/issues',
      pathParams: { projectId },
      queryOptions: {
        async onSuccess() {
          await refetch();
          toast.negative({ title: t('toast.delete') });
          table.resetRowSelection();
          setOpenDeleteDialog(false);
        },
        onError(error) {
          toast.negative({ title: error?.message ?? 'Error' });
        },
      },
    });

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  const columns = useMemo(
    () => getColumns(t, issueTracker?.data as IssueTrackerType | undefined),
    [t, issueTracker],
  );
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    getRowId: (row) => String(row.id),
  });

  useEffect(() => {
    if (!data) return;
    setRows(data.items);
  }, [data]);

  const onClickDelete = () => {
    deleteIssues({ issueIds: rowSelectionIds });
  };

  const onClickTableRow = (row: Row<IssueType>) => () => {
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

  return (
    <div className="flex flex-col gap-2">
      <IssueTableSelectBox
        currentIssueKey={currentIssueKey}
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
            limit={limit}
            nextPage={nextPage}
            prevPage={prevPage}
            setLimit={setLimit}
            disabledNextPage={page >= (data?.meta.totalPages ?? 1)}
            disabledPrevPage={page <= 1}
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
              {table.getFlatHeaders().map((header, i) => (
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
              ))}
            </tr>
            {isLoading && <TableLoadingRow colSpan={columns.length} />}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ?
              <tr>
                <td colSpan={columns.length}>
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
      <Popover
        open={openDeleteDialog}
        onOpenChange={() => setOpenDeleteDialog(false)}
        modal
      >
        <PopoverModalContent
          title={t('main.issue.dialog.delete-issue.title')}
          description={t('main.issue.dialog.delete-issue.description')}
          cancelButton={{ children: t('button.cancel') }}
          submitButton={{
            children: t('button.delete'),
            onClick: onClickDelete,
            disabled: deleteIssuesPending,
          }}
          icon={{
            name: 'WarningCircleFill',
            className: 'text-red-primary',
            size: 56,
          }}
        />
      </Popover>
    </div>
  );
};

export default IssueTable;
