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
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Icon, toast } from '@ufb/ui';
import dayjs from 'dayjs';
import produce from 'immer';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { CheckedTableHead, TableLoadingRow, TableSortIcon } from '@/components';
import { useOAIQuery, usePermissions } from '@/hooks';
import { useFeedbackSearch, useSort } from '@/hooks';

import FeedbackDeleteDialog from './FeedbackDeleteDialog';
import FeedbackTableBar from './FeedbackTableBar';
import FeedbackTableRow from './FeedbackTableRow';
import { getColumns } from './feedback-table-columns';
import useFeedbackTable from './feedback-table.context';

export interface IFeedbackTableProps {
  issueId?: number;
  sub?: boolean;
  onChangeChannel: (channelId: number) => void;
}

const FeedbackTable: React.FC<IFeedbackTableProps> = (props) => {
  const { sub = false, issueId, onChangeChannel } = props;
  const {
    projectId,
    channelId,
    columnOrder,
    columnVisibility,
    limit,
    setColumnOrder,
    setColumnVisibility,
    setSorting,
    sorting,
    page,
    setPage,
    query,
    setQuery,
    createdAtRange,
  } = useFeedbackTable();

  const { t } = useTranslation();
  const perms = usePermissions();
  const router = useRouter();

  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const sort = useSort(sorting);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    setPage(1);
    setQuery({});
    setRowSelection({});
  }, [channelId]);

  useEffect(() => {
    setPage(1);
    setRowSelection({});
  }, [limit, query]);

  useEffect(() => {
    if (!router.query.id || sub) return;
    setQuery((prev) => ({ ...prev, ids: [router.query.id] }));
  }, [router.query]);

  const q = useMemo(
    () =>
      produce(query, (draft) => {
        if (issueId) {
          draft['issueIds'] = [...(draft['issueIds'] ?? []), issueId];
        }
        if (query.ids) draft['ids'] = [draft['ids']];
        if (!sub && createdAtRange) {
          draft['createdAt'] = {
            gte: dayjs(createdAtRange.startDate).startOf('day').toISOString(),
            lt: dayjs(createdAtRange.endDate).endOf('day').toISOString(),
          };
        } else {
          delete draft['createdAt'];
        }
      }),
    [issueId, query, createdAtRange, sub],
  );

  const { data: channelData, refetch: refetchChannelData } = useOAIQuery({
    path: '/api/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const fieldData = channelData?.fields ?? [];

  const {
    data,
    refetch: refetchFeedbackData,
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useFeedbackSearch(
    projectId,
    channelId,
    { page, limit, sort: sort as Record<string, never>, query: q },
    { enabled: channelId !== -1 },
  );

  useEffect(() => {
    if (!feedbackError) return;
    if (feedbackError.code === 'LargeWindow') {
      toast.negative({
        title: 'Failed to search',
        description: 'Please narrow down the search range.',
      });
    }
  }, [feedbackError]);

  useEffect(() => {
    if (!data) setRows([]);
    else setRows(data.items);
  }, [data]);

  const columns = useMemo(() => getColumns(fieldData), [fieldData]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { columnOrder, columnVisibility, sorting, rowSelection },
    enableExpanding: true,
    columnResizeMode: 'onEnd',
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualSorting: true,
    getRowId: (row) => row.id,
  });

  const columnLength = table.getVisibleFlatColumns().length;

  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection).map((id) => parseInt(id)),
    [rowSelection],
  );

  return (
    <div className="flex flex-col gap-2">
      <FeedbackTableBar
        columns={columns}
        onChangeChannel={onChangeChannel}
        table={table}
        fieldData={fieldData}
        meta={data?.meta}
        sub={sub}
      />
      {fieldData && (
        <div className="overflow-x-auto">
          <table
            className="table table-fixed mb-2"
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
                    headerLength={columnLength}
                    count={rowSelectionIds.length}
                    header={table
                      .getFlatHeaders()
                      .find((v) => v.id === 'select')}
                    onClickCancle={table.resetRowSelection}
                    onClickDelete={() => setOpenDeleteDialog(true)}
                    disabled={!perms.includes('feedback_delete')}
                    download={{ channelId, projectId, ids: rowSelectionIds }}
                  />
                ) : (
                  table.getFlatHeaders().map((header) => (
                    <th key={header.index} style={{ width: header.getSize() }}>
                      <div className="flex items-center flex-nowrap">
                        <span className="overflow-hidden text-ellipsis">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <TableSortIcon column={header.column} />
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={[
                            'resizer hover:text-primary z-auto',
                            header.column.getIsResizing()
                              ? 'text-primary bg-secondary'
                              : 'text-tertiary',
                          ].join(' ')}
                          style={{
                            transform: header.column.getIsResizing()
                              ? `translateX(${
                                  table.getState().columnSizingInfo.deltaOffset
                                }px)`
                              : 'translateX(0px)',
                          }}
                        >
                          <Icon
                            name="Handle"
                            className="rotate-90 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            size={16}
                          />
                        </div>
                      )}
                    </th>
                  ))
                )}
              </tr>
              {feedbackLoading && <TableLoadingRow colSpan={columnLength} />}
            </thead>
            <tbody>
              {data?.meta.itemCount === 0 ? (
                <NoData columnLength={columnLength} />
              ) : feedbackError ? (
                <FailedToQueryData columnLength={columnLength} />
              ) : (
                table.getRowModel().rows.map((row) => (
                  <FeedbackTableRow
                    key={row.original.id}
                    row={row}
                    channelId={channelId}
                    projectId={projectId}
                    refetch={async () => {
                      await refetchChannelData();
                      await refetchFeedbackData();
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <FeedbackDeleteDialog
        open={openDeleteDialog}
        close={() => setOpenDeleteDialog(false)}
        channelId={channelId}
        handleSuccess={async () => {
          await refetchFeedbackData();
          toast.negative({ title: t('toast.delete') });
          table.resetRowSelection();
        }}
        projectId={projectId}
        rowSelectionIds={rowSelectionIds}
      />
    </div>
  );
};

interface IFailedToQueryData {
  columnLength: number;
}
const FailedToQueryData: React.FC<IFailedToQueryData> = ({ columnLength }) => {
  return (
    <tr>
      <td colSpan={columnLength}>
        <div className="flex flex-col justify-center items-center gap-3 my-60">
          <Icon
            name="WarningTriangleFill"
            className="text-tertiary"
            size={56}
          />
          <p>Failed to query data.</p>
        </div>
      </td>
    </tr>
  );
};
interface INoData {
  columnLength: number;
}
const NoData: React.FC<INoData> = ({ columnLength }) => {
  const { t } = useTranslation();
  return (
    <tr>
      <td colSpan={columnLength}>
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
  );
};

export default FeedbackTable;
