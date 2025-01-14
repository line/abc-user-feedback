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
import dayjs from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Tabs, TabsList, TabsTrigger, toast } from '@ufb/react';

import type {
  TableFilter,
  TableFilterCondition,
  TableFilterFieldFotmat,
  TableFilterOperator,
} from '@/shared';
import {
  BasicTable,
  client,
  DateRangePicker,
  DEFAULT_LOCALE,
  TableFilterPopover,
  TablePagination,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import type { DateRangeType, NextPageWithLayout } from '@/shared/types';
import {
  FeedbackDetailSheet,
  FeedbackTableDownload,
  FeedbackTableExpand,
  FeedbackTableViewOptions,
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
  const [currentChannelId, setCurrentChannelId] = useQueryState<number>(
    'channelId',
    parseAsInteger.withDefault(-1),
  );
  const [tableFilters, setTableFilters] = useState<TableFilter[]>([]);
  const [operator, setOperator] = useState<TableFilterOperator>('AND');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: dayjs()
      .subtract(env.NEXT_PUBLIC_MAX_DAYS - 1, 'day')
      .toDate(),
    endDate: dayjs().toDate(),
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

  const createdAtQuery = {
    createdAt: {
      gte: dayjs(dateRange?.startDate).format('YYYY-MM-DD'),
      lt: dayjs(dateRange?.endDate).add(1, 'day').format('YYYY-MM-DD'),
    },
    condition: 'IS' as TableFilterCondition,
  };

  const [queries, setQueries] = useState<Record<string, unknown>[]>([
    createdAtQuery,
  ]);

  const changeQueries = async (tableFilters: TableFilter[]) => {
    const getValue: Record<
      TableFilterFieldFotmat,
      (valeu: unknown) => unknown
    > = {
      number: (value) => Number(value),
      issue: async (value) => {
        const { data } = await client.post({
          path: '/api/admin/projects/{projectId}/issues/search',
          pathParams: { projectId },
          body: { query: { searchText: value } },
        });
        const result = data?.items.find((v) => v.name === value);
        return result ? [result.id] : [];
      },
      keyword: (value) => value,
      multiSelect: (value) => value,
      select: (value) => value,
      text: (value) => value,
      date: (value) => value,
    };

    const res = await Promise.all(
      tableFilters.map(async ({ condition, format, key, value }) => ({
        [key]: await getValue[format](value),
        condition,
      })),
    );
    setQueries(res.concat(createdAtQuery));
  };

  const {
    data: feedbackData,
    isLoading,
    refetch,
  } = useFeedbackSearch(
    projectId,
    currentChannelId,
    {
      queries,
      operator: operator,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
    {
      enabled: currentChannelId !== -1,
      throwOnError(error) {
        if (error.code === 'LargeWindow') {
          toast.error('Please narrow down the search range.');
        }
        return false;
      },
    },
  );

  const fields = channelData?.fields ?? [];
  const feedbacks = feedbackData?.items ?? [];
  const pageCount = feedbackData?.meta.totalPages ?? 0;
  const rowCount = feedbackData?.meta.totalItems ?? 0;

  const columns = useMemo(
    () => getColumns(channelData?.fields ?? []),
    [channelData],
  );

  const table = useReactTable({
    columns,
    data: feedbacks,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
    rowCount,
    state: { pagination },
    onPaginationChange: setPagination,
    getRowId: (row) => String(row.id),
  });

  useEffect(() => {
    if (!data || currentChannelId !== -1) return;
    void setCurrentChannelId(data.items[0]?.id ?? null);
  }, [data]);

  const currentFeedback = useMemo(
    () => feedbacks.find((v) => v.id === openFeedbackId),
    [feedbacks, openFeedbackId],
  );
  const { mutate: updateFeedback } = useOAIMutation({
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

  const updateTableFilters = async (
    tableFilters: TableFilter[],
    op: TableFilterOperator,
  ) => {
    await changeQueries(tableFilters);
    setTableFilters(tableFilters);
    setOperator(op);
  };

  if (currentChannelId && isNaN(currentChannelId)) {
    return <div>Channel Id is Bad Request</div>;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex justify-between">
        <Tabs
          value={String(currentChannelId)}
          onValueChange={(v) => setCurrentChannelId(Number(v))}
        >
          <TabsList>
            {data?.items.map((channel) => (
              <TabsTrigger key={channel.id} value={String(channel.id)}>
                {channel.name}
                {currentChannelId === channel.id && (
                  <span className="ml-1 font-bold">
                    {feedbackData?.meta.totalItems}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2 [&>button]:min-w-20">
          <DateRangePicker
            onChange={(v) => setDateRange(v)}
            value={dateRange}
            maxDate={new Date()}
            maxDays={env.NEXT_PUBLIC_MAX_DAYS}
          />
          <TableFilterPopover
            filterFields={fields.map((field) => ({
              key: field.key,
              name: field.name,
              options: field.options,
              format: (field.key === 'issues' ?
                'issue'
              : field.format) as TableFilterFieldFotmat,
            }))}
            onSubmit={updateTableFilters}
            tableFilters={tableFilters}
          />
          <FeedbackTableViewOptions table={table} fields={fields} />
          <FeedbackTableExpand table={table} />
          <FeedbackTableDownload fields={fields} queries={queries} />
        </div>
      </div>
      <BasicTable
        table={table}
        className="table-fixed"
        onClickRow={(_, row) => setOpenFeedbackId(Number(row.id))}
        isLoading={isLoading}
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
