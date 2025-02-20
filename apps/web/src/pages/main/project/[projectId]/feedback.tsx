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
import type { PaginationState } from '@tanstack/react-table';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsList, TabsTrigger, toast } from '@ufb/react';

import type { TableFilterField } from '@/shared';
import {
  BasicTable,
  DateRangePicker,
  DEFAULT_LOCALE,
  TableFilterPopover,
  TablePagination,
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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [openFeedbackId, setOpenFeedbackId] = useState<number | null>(null);

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId: currentChannelId, projectId },
  });

  const {
    queries,
    tableFilters,
    dateRange,
    operator,
    updateTableFilters,
    updateDateRage,
  } = useFeedbackQueryConverter({
    projectId,
    fields: channelData?.fields ?? [],
  });

  const fields = channelData?.fields ?? [];

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
    state: { pagination },
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
    manualSorting: true,
    onPaginationChange: setPagination,
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
        toast.success('Feedback updated successfully');
      },
    },
  });
  const { mutate: deleteFeedback } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks',
    pathParams: { channelId: currentChannelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.success('Feedback deleted successfully');
      },
    },
  });

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

        if (field.format === 'select' || field.format === 'multiSelect') {
          if (field.key === 'issues') {
            return {
              format: 'issue',
              key: 'issueIds',
              name: field.name,
              matchType: ['IS'],
            };
          }
          return {
            key: field.key,
            name: field.name,
            format: 'select',
            options: field.options,
            matchType: ['BETWEEN', 'IS'],
          };
        }
      })
      .filter((v) => !!v?.key) as TableFilterField[];
  }, [fields]);
  if (currentChannelId && isNaN(currentChannelId)) {
    return <div>Channel Id is Bad Request</div>;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap justify-between gap-2">
        <Tabs
          value={String(currentChannelId)}
          onValueChange={(v) => setCurrentChannelId(Number(v))}
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
          <DateRangePicker
            onChange={(v) => updateDateRage(v)}
            value={dateRange}
            maxDate={new Date()}
            maxDays={env.NEXT_PUBLIC_MAX_DAYS}
          />
          <TableFilterPopover
            filterFields={filterFields}
            onSubmit={updateTableFilters}
            tableFilters={tableFilters}
          />
          <FeedbackTableViewOptions table={table} fields={fields} />
          <FeedbackTableExpand table={table} />
          <FeedbackTableDownload
            fields={fields}
            queries={queries}
            disabled={!perms.includes('feedback_download_read')}
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
