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
import type {
  ColumnOrderState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { useTranslation } from 'next-i18next';

import { Icon, toast } from '@ufb/ui';

import {
  CheckedTableHead,
  TableLoadingRow,
  TableResizer,
  TableSortIcon,
  useLocalColumnSetting,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useSort,
} from '@/shared';
import { useFeedbackSearch } from '@/entities/feedback';

import { getColumns } from '../feedback-table-columns';
import { useFeedbackTable } from '../model';
import FeedbackDeleteDialog from './feedback-delete-dialog';
import FeedbackTableBar from './feedback-table-bar';
import FeedbackTableDownloadButton from './feedback-table-download-button.ui';
import FeedbackTableRow from './feedback-table-row';

export interface IFeedbackTableProps {
  issueId?: number;
  sub?: boolean;
  onChangeChannel: (channelId: number) => void;
}

const FeedbackTable: React.FC<IFeedbackTableProps> = (props) => {
  const { sub = false, issueId, onChangeChannel } = props;

  const { t } = useTranslation();
  const overlay = useOverlay();

  const perms = usePermissions();

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  const { projectId, channelId, query } = useFeedbackTable();

  const { data: channelData, refetch: refetchChannelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const fieldData = channelData?.fields ?? [];

  const formattedQuery = useMemo(
    () =>
      produce(query, (draft) => {
        if (sub) {
          if (issueId) draft['issueIds'] = [issueId];
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
            const field = fieldData.find((v) => v.key === key);

            if (field?.format === 'date') {
              const [gte, lt] = value.split('~');
              draft[key] = {
                gte: dayjs(gte).startOf('day').toISOString(),
                lt: dayjs(lt).endOf('day').toISOString(),
              };
            }
            if (field?.format === 'number') {
              draft[key] = Number(value);
            }
            if (field?.format === 'multiSelect') {
              draft[key] = [String(value)];
            }
          });
        }
      }),
    [issueId, query, sub, fieldData],
  );

  const [sorting, setSorting] = useLocalColumnSetting<SortingState>({
    channelId,
    key: 'sort',
    projectId,
    initialValue: [{ id: 'createdAt', desc: true }],
  });

  const [columnVisibility, setColumnVisibility] =
    useLocalColumnSetting<VisibilityState>({
      channelId,
      key: 'ColumnVisibility',
      projectId,
      initialValue: {},
    });

  const [columnOrder, setColumnOrder] = useLocalColumnSetting<ColumnOrderState>(
    {
      channelId,
      key: 'ColumnOrder',
      projectId,
      initialValue: [],
    },
  );

  const table = useReactTable({
    data: rows,
    state: { columnVisibility, columnOrder, sorting },
    columns: getColumns(fieldData),
    enableExpanding: true,
    columnResizeMode: 'onEnd',
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.id,
    manualSorting: true,
    manualPagination: true,
    initialState: {
      pagination: { pageSize: 20 },
      sorting: [{ id: 'createdAt', desc: true }],
    },
  });

  const { rowSelection, pagination } = table.getState();
  const sort = useSort(sorting);

  const {
    data,
    refetch: refetchFeedbackData,
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useFeedbackSearch(
    projectId,
    channelId,
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sort as Record<string, never>,
      query: formattedQuery,
    },
    {
      enabled: channelId !== -1,
      throwOnError(error) {
        if (error.code === 'LargeWindow') {
          toast.negative({
            title: 'Failed to search',
            description: 'Please narrow down the search range.',
          });
        }
        return false;
      },
    },
  );

  useEffect(() => {
    setRows(data?.items ?? []);
  }, [data]);

  useEffect(() => {
    table.resetRowSelection();
    table.resetPageIndex();
  }, [query, channelId]);

  const columnLength = table.getVisibleFlatColumns().length;

  const { mutate: deleteFeedback } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks',
    pathParams: { projectId, channelId },
    queryOptions: {
      async onSuccess() {
        await refetchFeedbackData();
        toast.negative({ title: t('toast.delete') });
        table.resetRowSelection();
        close();
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const openFeedbackDeleteDialog = () => {
    return overlay.open(({ isOpen, close }) => (
      <FeedbackDeleteDialog
        open={isOpen}
        close={close}
        onClickDelete={() => {
          deleteFeedback({
            feedbackIds: Object.keys(rowSelection).map((id) => parseInt(id)),
          });
        }}
      />
    ));
  };
  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection).map((id) => parseInt(id)),
    [rowSelection],
  );

  return (
    <div className="flex flex-col gap-2">
      <FeedbackTableBar
        table={table}
        fieldData={fieldData}
        meta={data?.meta}
        sub={sub}
        formattedQuery={formattedQuery}
        onChangeChannel={onChangeChannel}
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
                {rowSelectionIds.length > 0 ?
                  <CheckedTableHead
                    table={table}
                    onClickDelete={openFeedbackDeleteDialog}
                    disabled={!perms.includes('feedback_delete')}
                    button={
                      <FeedbackTableDownloadButton
                        query={{ ids: rowSelectionIds }}
                        count={rowSelectionIds.length}
                        fieldData={fieldData}
                        table={table}
                        isHead
                      />
                    }
                  />
                : table.getFlatHeaders().map((header) => (
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
                }
              </tr>
              {feedbackLoading && <TableLoadingRow colSpan={columnLength} />}
            </thead>
            <tbody>
              {data?.meta.itemCount === 0 ?
                <NoData columnLength={columnLength} />
              : feedbackError ?
                <FailedToQueryData columnLength={columnLength} />
              : table.getRowModel().rows.map((row) => (
                  <FeedbackTableRow
                    key={row.original.id}
                    row={row}
                    refetch={async () => {
                      await refetchChannelData();
                      await refetchFeedbackData();
                    }}
                  />
                ))
              }
            </tbody>
          </table>
        </div>
      )}
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
