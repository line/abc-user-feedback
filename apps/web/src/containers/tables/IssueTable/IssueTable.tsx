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
import {
  Row,
  RowSelectionState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge, Icon, toast } from '@ufb/ui';
import dayjs from 'dayjs';
import { TFunction, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';

import {
  CheckedTableHead,
  DateRangePicker,
  Dialog,
  ExpandableText,
  IssueCircle,
  ShareButton,
  TableCheckbox,
  TableLoadingRow,
  TablePagination,
  TableSearchInput,
  TableSortIcon,
} from '@/components';
import { SearchItemType } from '@/components/etc/TableSearchInput/TableSearchInput';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { DEFAULT_DATE_RANGE } from '@/constants/default-date-range';
import { ISSUES, getStatusColor } from '@/constants/issues';
import { env } from '@/env.mjs';
import {
  useIssueSearch,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useSort,
} from '@/hooks';
import { IssueTrackerType } from '@/types/issue-tracker.type';
import { IssueType } from '@/types/issue.type';

import { FeedbackTableInIssue } from '../FeedbackTable';
import IssueSettingPopover from './IssueSettingPopover';
import IssueTabelSelectBox from './IssueTabelSelectBox';
import { TableRow } from './TableRow';
import TicketLink from './TicketLink';

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
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    cell: ({ getValue, row }) => (
      <ExpandableText isExpanded={row.getIsExpanded()}>
        {getValue()}
      </ExpandableText>
    ),
    size: 100,
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue, row }) => (
      <Badge color={getStatusColor(row.original.status)} type="secondary">
        {getValue()}
      </Badge>
    ),
    size: 100,
    enableSorting: false,
  }),
  columnHelper.accessor('feedbackCount', {
    header: 'Feedback Count',
    cell: ({ getValue }) => getValue().toLocaleString(),
    size: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue, row }) => (
      <ExpandableText isExpanded={row.getIsExpanded()}>
        {getValue() ?? '-'}
      </ExpandableText>
    ),
    enableSorting: false,
    size: 250,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => (
      <div className="flex gap-1 items-center">
        <IssueCircle issueKey={getValue()} />
        {ISSUES(t).find((v) => v.key === getValue())?.name}
      </div>
    ),
    size: 70,
  }),
  columnHelper.accessor('externalIssueId', {
    header: 'Ticket',
    cell: ({ getValue }) =>
      getValue() ? (
        issueTracker ? (
          <TicketLink value={getValue()} issueTracker={issueTracker} />
        ) : (
          getValue()
        )
      ) : (
        '-'
      ),
    enableSorting: false,
    size: 100,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 100,
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated',
    cell: ({ getValue }) => <>{dayjs(getValue()).format(DATE_TIME_FORMAT)}</>,
    size: 100,
  }),
];

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const IssueTable: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();
  const perms = usePermissions();

  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createdAtRange, setCreatedAtRange] = useState(DEFAULT_DATE_RANGE);

  const [query, setQuery] = useState<Record<string, any>>({});
  const sort = useSort(sorting);

  useEffect(() => {
    if (router.query.id) {
      setQuery({ id: router.query.id });
    }
  }, [router.query]);

  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection),
    [rowSelection],
  );

  const { data, refetch, isLoading } = useIssueSearch(projectId, {
    page,
    limit,
    query: {
      ...query,
      createdAt: {
        gte: dayjs(createdAtRange?.startDate).startOf('day').toISOString(),
        lt: dayjs(createdAtRange?.endDate).endOf('day').toISOString(),
      },
    },
    sort: sort as Record<string, never>,
  });
  const { data: issueTracker } = useOAIQuery({
    path: '/api/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const { mutate: deleteIssues, isLoading: deleteIssuesLoading } =
    useOAIMutation({
      method: 'delete',
      path: '/api/projects/{projectId}/issues',
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
    [refetch, t, issueTracker],
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
    deleteIssues({ issueIds: rowSelectionIds.map((v) => +v) });
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

  return (
    <div className="flex flex-col gap-2">
      <IssueTabelSelectBox
        projectId={projectId}
        onChangeOption={(option) =>
          option.key !== 'total'
            ? setQuery({ status: option.key })
            : setQuery({})
        }
      />
      <div className="flex justify-between items-center">
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
          <div className="w-[272px]">
            <DateRangePicker
              value={createdAtRange}
              onChange={setCreatedAtRange}
              maxDays={env.NEXT_PUBLIC_MAX_DAYS}
              maxDate={new Date()}
            />
          </div>
          <TableSearchInput
            searchItems={columnInfo}
            onChangeQuery={(input) => setQuery(input)}
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
              {rowSelectionIds.length > 0 ? (
                <CheckedTableHead
                  headerLength={columns.length}
                  count={rowSelectionIds.length}
                  header={table.getFlatHeaders().find((v) => v.id === 'select')}
                  onClickCancle={table.resetRowSelection}
                  onClickDelete={() => setOpenDeleteDialog(true)}
                  disabled={!perms.includes('issue_delete')}
                />
              ) : (
                table.getFlatHeaders().map((header, i) => (
                  <th key={i} style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <TableSortIcon column={header.column} />
                    )}
                  </th>
                ))
              )}
            </tr>
            {isLoading && <TableLoadingRow colSpan={columns.length} />}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col justify-center items-center gap-3 my-60">
                    <Icon
                      name="WarningTriangleFill"
                      className="text-tertiary"
                      size={56}
                    />
                    <p>{t('text.no-data')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    isSelected={row.getIsExpanded()}
                    hoverElement={
                      <>
                        <TableCheckbox
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          indeterminate={row.getIsSomeSelected()}
                          onChange={row.getToggleSelectedHandler()}
                        />
                        <button
                          className="icon-btn icon-btn-sm icon-btn-tertiary"
                          onClick={onClickTableRow(row)}
                        >
                          <Icon
                            name={row.getIsExpanded() ? 'Compress' : 'Expand'}
                            size={16}
                          />
                        </button>
                        <ShareButton id={row.original.id} />
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
                  {perms.includes('feedback_read') && row.getIsExpanded() && (
                    <tr>
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="bg-fill-quaternary p-4"
                      >
                        <div className="bg-primary p-4 rounded">
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
            )}
          </tbody>
        </table>
      </div>
      <Dialog
        open={openDeleteDialog}
        close={() => setOpenDeleteDialog(false)}
        title={t('main.issue.dialog.delete-issue.title')}
        description={t('main.issue.dialog.delete-issue.description')}
        submitButton={{
          children: t('button.delete'),
          onClick: onClickDelete,
          disabled: deleteIssuesLoading,
        }}
        icon={{
          name: 'WarningCircleFill',
          className: 'text-red-primary',
          size: 56,
        }}
      />
    </div>
  );
};

export default IssueTable;
