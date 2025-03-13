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
import type { GetServerSideProps } from 'next';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  OnChangeFn,
  PaginationState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsInteger, useQueryState } from 'nuqs';

import {
  Badge,
  Button,
  Icon,
  Tabs,
  TabsList,
  TabsTrigger,
  toast,
} from '@ufb/react';

import type { TableFilterField } from '@/shared';
import {
  BasicTable,
  DateRangePicker,
  DEFAULT_LOCALE,
  DeleteDialog,
  TableFilterPopover,
  TablePagination,
  useAllChannels,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useSort,
} from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import {
  FeedbackDetailSheet,
  FeedbackTableDownload,
  FeedbackTableExpand,
  FeedbackTableViewOptions,
  useFeedbackQueryConverter,
  useFeedbackSearch,
} from '@/entities/feedback';
import { getColumns } from '@/entities/feedback/feedback-table-columns';
import { ProjectGuard } from '@/entities/project';
import { Layout } from '@/widgets/layout';

import { env } from '@/env';

interface IProps {
  projectId: number;
}

const FeedbackManagementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId } = props;
  const { t } = useTranslation();

  const perms = usePermissions(projectId);
  const [currentChannelId, setCurrentChannelId] = useQueryState<number>(
    'channelId',
    parseAsInteger.withDefault(-1),
  );

  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const overlay = useOverlay();
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
        [currentChannelId]: updaterOrValue,
      });
    } else {
      setColumnVisibility((prev) => ({
        ...prev,
        [currentChannelId]: updaterOrValue(
          columnVisibility[currentChannelId] ?? {},
        ),
      }));
    }
  };

  const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null);

  const { data } = useAllChannels(projectId);

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId: currentChannelId, projectId },
  });

  const fields = (channelData?.fields ?? []).sort((a, b) => a.order - b.order);
  const filterFields = useMemo(() => {
    return fields
      .filter((field) => field.key !== 'createdAt' && field.format !== 'images')
      .map((field) => {
        if (field.format === 'text') {
          return {
            key: field.key,
            name: field.name,
            format: 'string',
            matchType: ['CONTAINS'],
          };
        }
        if (field.format === 'keyword') {
          return {
            key: field.key,
            name: field.name,
            format: 'string',
            matchType: ['IS'],
          };
        }
        if (field.format === 'number') {
          return {
            key: field.key,
            name: field.name,
            format: 'number',
            matchType: ['IS'],
          };
        }
        if (field.format === 'date') {
          return {
            key: field.key,
            name: field.name,
            format: 'date',
            matchType: ['BETWEEN', 'IS'],
          };
        }

        if (field.key === 'issues') {
          return {
            key: 'issueIds',
            format: 'issue',
            name: field.name,
            matchType: ['IS'],
            visible: true,
          };
        }
        if (field.format === 'select') {
          return {
            key: field.key,
            name: field.name,
            format: field.format,
            options: field.options,
            matchType: ['IS'],
          };
        }
        if (field.format === 'multiSelect') {
          return {
            key: field.key,
            name: field.name,
            format: field.format,
            options: field.options,
            matchType: ['IS', 'CONTAINS'],
          };
        }
      })
      .filter((v) => !!v?.key) as TableFilterField[];
  }, [fields]);

  const {
    queries,
    tableFilters,
    dateRange,
    operator,
    updateTableFilters,
    updateDateRage,
  } = useFeedbackQueryConverter({
    projectId,
    filterFields,
  });

  const columns = useMemo(
    () => getColumns(channelData?.fields ?? []),
    [channelData],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    rowCount,
    state: { pagination, columnVisibility: columnVisibility[currentChannelId] },
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
    manualSorting: true,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: onChangeColumnVisibility,
    getRowId: (row) => String(row.id),
  });

  const { sorting } = table.getState();
  const sort = useSort(sorting);

  const {
    data: feedbackData,
    isLoading,
    refetch,
  } = useFeedbackSearch(
    projectId,
    currentChannelId,
    {
      queries: queries,
      operator: operator,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort,
    },
    {
      enabled: currentChannelId !== -1 && queries.length > 0,
      throwOnError(error) {
        if (error.code === 'LargeWindow') {
          toast.error('Please narrow down the search range.');
        }
        return false;
      },
    },
  );

  useEffect(() => {
    if (!data || currentChannelId !== -1) return;
    void setCurrentChannelId(data.items[0]?.id ?? null);
  }, [data]);

  useEffect(() => {
    table.setPageIndex(0);
    table.resetRowSelection();
  }, [currentChannelId, pagination.pageSize]);

  useEffect(() => {
    setRows(feedbackData?.items ?? []);
    setPageCount(feedbackData?.meta.totalPages ?? 0);
    setRowCount(feedbackData?.meta.totalItems ?? 0);
  }, [feedbackData]);

  const currentFeedback = useMemo(
    () => rows.find((v) => v.id === openFeedbackId),
    [rows, openFeedbackId],
  );
  const { mutateAsync: updateFeedback } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}',
    pathParams: {
      channelId: currentChannelId,
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
  const { mutateAsync: deleteFeedback } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks',
    pathParams: { channelId: currentChannelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.success(t('v2.toast.success'));
        table.resetRowSelection();
      },
    },
  });

  const selectedRowIds = useMemo(() => {
    return Object.entries(table.getState().rowSelection).reduce(
      (acc, [key, value]) => (value ? acc.concat(Number(key)) : acc),
      [] as number[],
    );
  }, [table.getState().rowSelection]);

  const openDeleteUsersDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => deleteFeedback({ feedbackIds: selectedRowIds })}
      />
    ));
  };

  if (currentChannelId && isNaN(currentChannelId)) {
    return <div>Channel Id is Bad Request</div>;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex justify-between gap-2">
        <Tabs
          value={String(currentChannelId)}
          onValueChange={(v) => setCurrentChannelId(Number(v))}
          className="overflow-auto"
        >
          <TabsList>
            {data?.items.length === 0 ?
              <TabsTrigger value="-1">
                {t('v2.text.no-data.channel')}
              </TabsTrigger>
            : data?.items.map((channel) => (
                <TabsTrigger key={channel.id} value={String(channel.id)}>
                  {channel.name}
                  {currentChannelId === channel.id && (
                    <span className="ml-1 font-bold">
                      {feedbackData?.meta.totalItems}
                    </span>
                  )}
                </TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
        <div className="flex gap-2 [&>button]:min-w-20">
          {selectedRowIds.length > 0 && (
            <Button
              variant="outline"
              className="!text-tint-red"
              onClick={openDeleteUsersDialog}
            >
              <Icon name="RiDeleteBin6Line" />
              {t('v2.button.name.delete', { name: 'Feedback' })}
              <Badge variant="subtle" className="!text-tint-red">
                {selectedRowIds.length}
              </Badge>
            </Button>
          )}
          <DateRangePicker
            onChange={updateDateRage}
            value={dateRange}
            maxDate={new Date()}
            maxDays={env.NEXT_PUBLIC_MAX_DAYS}
          />
          <TableFilterPopover
            filterFields={filterFields.filter(
              (v) =>
                v.key === 'issueIds' ||
                table.getAllColumns().some((column) => column.id === v.key),
            )}
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
        emptyCaption={t('v2.text.no-data.feedback')}
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
          channelId={currentChannelId}
        />
      )}
    </div>
  );
};

FeedbackManagementPage.getLayout = (page: React.ReactElement<IProps>) => {
  return (
    <Layout projectId={page.props.projectId} title="Feedback">
      <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default FeedbackManagementPage;
