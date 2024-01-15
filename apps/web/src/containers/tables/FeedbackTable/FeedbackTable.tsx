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
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { useTranslation } from 'next-i18next';

import { Icon, toast } from '@ufb/ui';

import {
  CheckedTableHead,
  TableLoadingRow,
  TableResizer,
  TableSortIcon,
} from '@/components';
import {
  useFeedbackSearch,
  useOAIQuery,
  usePermissions,
  useSort,
} from '@/hooks';
import { getColumns } from './feedback-table-columns';
import useFeedbackTable from './feedback-table.context';
import FeedbackDeleteDialog from './FeedbackDeleteDialog';
import FeedbackTableBar from './FeedbackTableBar';
import FeedbackTableRow from './FeedbackTableRow';

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
    createdAtRange,
  } = useFeedbackTable();

  const { t } = useTranslation();
  const perms = usePermissions();

  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const sort = useSort(sorting);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    setPage(1);
    setRowSelection({});
  }, [limit, query]);

  const formattedQuery = useMemo(
    () =>
      produce(query, (draft) => {
        if (sub) {
          if (issueId) {
            draft['issueIds'] = [issueId];
          }
          Object.keys(draft).forEach((key) => {
            if (key === 'issueIds') return;
            delete draft[key];
          });
        } else {
          if (draft['ids']) {
            draft['ids'] = [draft['ids']].map((v) => +v);
          }
          if (draft['issueIds']) {
            draft['issueIds'] = [draft['issueIds']].map((v) => +v);
          }
          Object.entries(draft).forEach(([key, value]) => {
            if (typeof value === 'string' && value.split('~').length === 2) {
              const [gte, lt] = value.split('~');
              draft[key] = {
                gte: dayjs(gte).startOf('day').toISOString(),
                lt: dayjs(lt).endOf('day').toISOString(),
              };
            }
            if (value === 'true' || value === 'false') {
              draft[key] = value === 'true';
            }
          });
          if (createdAtRange) {
            draft['createdAt'] = {
              gte: dayjs(createdAtRange.startDate).startOf('day').toISOString(),
              lt: dayjs(createdAtRange.endDate).endOf('day').toISOString(),
            };
          } else {
            delete draft['createdAt'];
          }
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
    { page, limit, sort: sort as Record<string, never>, query: formattedQuery },
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

  const columns = useMemo(
    () => getColumns(fieldData, refetchFeedbackData),
    [fieldData, refetchFeedbackData],
  );

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

  const fieldIds = useMemo(() => {
    if (!fieldData) return [];
    if (columnOrder.length === 0) return fieldData.map((v) => v.id);

    return fieldData
      .filter((v) => columnVisibility[v.key] !== false)
      .sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key))
      .map((v) => v.id);
  }, [columnOrder, columnVisibility, fieldData]);

  return (
    <div className="flex flex-col gap-2">
      <FeedbackTableBar
        columns={columns}
        onChangeChannel={(channelId) => {
          setPage(1);
          setRowSelection({});
          onChangeChannel(channelId);
        }}
        table={table}
        fieldData={fieldData}
        meta={data?.meta}
        sub={sub}
        formattedQuery={formattedQuery}
      />
      {fieldData && (
        <div className="overflow-x-auto">
          <table
            className="mb-2 table table-fixed"
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
                    download={{
                      channelId,
                      projectId,
                      ids: rowSelectionIds,
                      fieldIds,
                    }}
                  />
                ) : (
                  table.getFlatHeaders().map((header) => (
                    <th key={header.index} style={{ width: header.getSize() }}>
                      <div className="flex flex-nowrap items-center">
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
                        <TableResizer header={header} table={table} />
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
        <div className="my-60 flex flex-col items-center justify-center gap-3">
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
  );
};

export default FeedbackTable;
