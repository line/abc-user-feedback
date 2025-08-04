/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
  OnChangeFn,
  PaginationState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import {
  Badge,
  Button,
  Icon,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ufb/react';

import type { TableFilterField } from '@/shared';
import {
  BasicTable,
  DateRangePicker,
  DeleteDialog,
  TableFilterPopover,
  TablePagination,
  useOAIMutation,
  usePermissions,
} from '@/shared';
import type { Channel } from '@/entities/channel';
import type { Field } from '@/entities/field';

import { AISparklingIcon } from '@/assets';
import { getColumns } from '../feedback-table-columns';
import {
  useAIFIeldFeedbackCellLoading,
  useFeedbackQueryConverter,
  useFeedbackSearch,
} from '../lib';
import FeedbackDetailSheet from './feedback-detail-sheet.ui';
import FeedbackTableChannelSelection from './feedback-table-channel-selection.ui';
import FeedbackTableDownload from './feedback-table-download.ui';
import FeedbackTableExpand from './feedback-table-expand.ui';
import FeedbackTableViewOptions from './feedback-table-view-options.ui';

interface Props {
  projectId: number;
  channels: Channel[];
  currentChannel: Channel;
  setCurrentChannelId: (id: number) => void;
  filterFields: TableFilterField[];
  fields: Field[];
}

const FeedbackTable = (props: Props) => {
  const {
    channels,
    currentChannel,
    setCurrentChannelId,
    projectId,
    filterFields,
    fields,
  } = props;

  const { t } = useTranslation();
  const perms = usePermissions();
  const overlay = useOverlay();

  const setLoadingFeedbackIds = useAIFIeldFeedbackCellLoading(
    (state) => state.setLoadingFeedbackIds,
  );
  const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null);

  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [columnVisibility, setColumnVisibility] = useState<
    Record<number, VisibilityState>
  >({});

  const onChangeColumnVisibility: OnChangeFn<VisibilityState> = (
    updaterOrValue: Updater<VisibilityState>,
  ) => {
    if (typeof updaterOrValue !== 'function') {
      setColumnVisibility({
        ...columnVisibility,
        [currentChannel.id]: updaterOrValue,
      });
    } else {
      setColumnVisibility((prev) => ({
        ...prev,
        [currentChannel.id]: updaterOrValue(
          columnVisibility[currentChannel.id] ?? {},
        ),
      }));
    }
  };

  const {
    queries,
    tableFilters,
    dateRange,
    operator,
    updateTableFilters,
    updateDateRage,
    defaultQueries,
    resetDateRange,
  } = useFeedbackQueryConverter({
    projectId,
    filterFields,
    feedbackSearchMaxDays: currentChannel.feedbackSearchMaxDays,
  });

  const columns = useMemo(() => getColumns(fields), [fields]);

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    rowCount,
    state: {
      pagination,
      columnVisibility: columnVisibility[currentChannel.id],
    },
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
    manualSorting: true,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: onChangeColumnVisibility,
    getRowId: (row) => String(row.id),
  });
  const { rowSelection } = table.getState();

  const selectedRowIds = useMemo(() => {
    return Object.entries(rowSelection).reduce(
      (acc, [key, value]) => (value ? acc.concat(Number(key)) : acc),
      [] as number[],
    );
  }, [rowSelection]);

  const {
    data: feedbackData,
    isLoading,
    refetch,
  } = useFeedbackSearch(
    projectId,
    currentChannel.id,
    {
      queries,
      operator,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      defaultQueries,
    },
    {
      throwOnError(error) {
        if (error.code === 'LargeWindow') {
          toast.error('Please narrow down the search range.');
        }
        return false;
      },
    },
  );
  useEffect(() => {
    void resetDateRange();
  }, [currentChannel]);

  useEffect(() => {
    setRows(feedbackData?.items ?? []);
    setPageCount(feedbackData?.meta.totalPages ?? 0);
    setRowCount(feedbackData?.meta.totalItems ?? 0);
    table.resetRowSelection();
  }, [feedbackData]);

  useEffect(() => {
    table.setPageIndex(0);
    table.resetRowSelection();
  }, [pagination.pageSize]);

  const { mutateAsync: deleteFeedback } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks',
    pathParams: { channelId: currentChannel.id, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.success(t('v2.toast.success'));
        table.resetRowSelection();
      },
    },
  });
  const openDeleteFeedbacksDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => deleteFeedback({ feedbackIds: selectedRowIds })}
      />
    ));
  };

  const currentFeedback = useMemo(
    () => rows.find((v) => v.id === openFeedbackId),
    [rows, openFeedbackId],
  );

  const { mutateAsync: updateFeedback } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}',
    pathParams: {
      channelId: currentChannel.id,
      feedbackId: (currentFeedback?.id ?? 0) as number,
      projectId,
    },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const { mutateAsync: processAI, isPending: isPendingAIProcess } =
    useOAIMutation({
      method: 'post',
      path: '/api/admin/projects/{projectId}/ai/process',
      pathParams: { projectId },
      queryOptions: {
        onSuccess() {
          toast.success(t('v2.toast.success'));
        },
        async onSettled() {
          table.resetRowSelection();
          await refetch();
          setLoadingFeedbackIds([]);
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-shrink justify-between gap-2">
        <FeedbackTableChannelSelection
          channels={channels}
          currentChannelId={currentChannel.id}
          setCurrentChannelId={setCurrentChannelId}
          totalItems={feedbackData?.meta.totalItems ?? 0}
        />
        <div className="flex flex-shrink-0 gap-2 [&>button]:min-w-20 [&>button]:flex-shrink-0">
          {selectedRowIds.length > 0 &&
            fields.filter(
              (v) => v.format === 'aiField' && v.status === 'ACTIVE',
            ).length > 0 && (
              <>
                <Button
                  variant="outline"
                  className="!text-tint-red"
                  onClick={openDeleteFeedbacksDialog}
                  disabled={!perms.includes('feedback_delete')}
                >
                  <Icon name="RiDeleteBin6Line" />
                  {t('v2.button.name.delete', { name: 'Feedback' })}
                  <Badge variant="subtle" className="!text-tint-red">
                    {selectedRowIds.length}
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoadingFeedbackIds(selectedRowIds);
                    toast.promise(processAI({ feedbackIds: selectedRowIds }), {
                      loading: 'Loading',
                      success: () => 'Success',
                    });
                  }}
                  disabled={
                    isPendingAIProcess || !perms.includes('feedback_update')
                  }
                >
                  <AISparklingIcon />
                  {t('v2.button.process-ai')}
                  <Badge variant="subtle">{selectedRowIds.length}</Badge>
                </Button>
              </>
            )}
          <Tooltip>
            <TooltipTrigger>
              <DateRangePicker
                onChange={updateDateRage}
                value={dateRange}
                maxDate={new Date()}
                maxDays={currentChannel.feedbackSearchMaxDays}
                clearable={currentChannel.feedbackSearchMaxDays === -1}
              />
            </TooltipTrigger>
            <TooltipContent>
              {t('tooltip.feedback-date-picker-button')}
            </TooltipContent>
          </Tooltip>
          <TableFilterPopover
            filterFields={filterFields.filter(
              (v) =>
                v.key === 'issueIds' ||
                table.getAllColumns().some((column) => column.id === v.key),
            )}
            operator={operator}
            onSubmit={updateTableFilters}
            tableFilters={tableFilters}
            table={table}
          />
          <FeedbackTableViewOptions table={table} fields={fields} />
          <FeedbackTableExpand table={table} />
          <FeedbackTableDownload
            table={table}
            fields={fields}
            queries={queries}
            defaultQueries={defaultQueries}
            disabled={!perms.includes('feedback_download_read')}
            operator={operator}
            totalItems={feedbackData?.meta.totalItems ?? 0}
          />
        </div>
      </div>
      <BasicTable
        table={table}
        onClickRow={(_, row) => setOpenFeedbackId(row.id as number)}
        isLoading={isLoading}
        isFiltered={queries.length > 0}
        resiable
      />
      <TablePagination table={table} />
      {currentFeedback && (
        <FeedbackDetailSheet
          updateFeedback={(feedback) => updateFeedback(feedback as never)}
          onClickDelete={() =>
            deleteFeedback({ feedbackIds: [currentFeedback.id as number] })
          }
          isOpen={!!openFeedbackId}
          close={() => setOpenFeedbackId(null)}
          feedback={currentFeedback}
          fields={fields}
          channelId={currentChannel.id}
          refetchFeedback={refetch}
        />
      )}
    </div>
  );
};

export default FeedbackTable;
