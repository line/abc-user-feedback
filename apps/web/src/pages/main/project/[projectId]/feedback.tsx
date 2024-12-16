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
import { useOverlay } from '@toss/use-overlay';
import dayjs from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsInteger, useQueryState } from 'nuqs';

import {
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  toast,
} from '@ufb/react';

import {
  BasicTable,
  DateRangePicker,
  DEFAULT_LOCALE,
  TablePagination,
  useOAIQuery,
} from '@/shared';
import type { DateRangeType, NextPageWithLayout } from '@/shared/types';
import type { Feedback } from '@/entities/feedback';
import { useFeedbackSearch } from '@/entities/feedback';
import { getColumns } from '@/entities/feedback/feedback-table-columns';
import FeedbackDetailSheet from '@/entities/feedback/ui/feedback-detail-sheet.ui';
import FeedbackTableDownload from '@/entities/feedback/ui/feedback-table-download.ui';
import FeedbackTableExpand from '@/entities/feedback/ui/feedback-table-expand.ui';
import FeedbackTableViewOptions from '@/entities/feedback/ui/feedback-table-view-options.ui';
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

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId: currentChannelId, projectId },
  });
  const query = {
    createdAt: {
      gte: dayjs(dateRange?.startDate).startOf('day').toISOString(),
      lt: dayjs(dateRange?.endDate).endOf('day').toISOString(),
    },
  };

  const { data: feedbackData, isLoading } = useFeedbackSearch(
    projectId,
    currentChannelId,
    {
      query,
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
  const overlay = useOverlay();

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

  const openFeedbackDetail = (feedback: Feedback) => {
    overlay.open(({ close, isOpen }) => (
      <FeedbackDetailSheet
        isOpen={isOpen}
        close={close}
        feedback={feedback}
        fields={fields}
      />
    ));
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
                {channel.name}{' '}
                {currentChannelId === channel.id && (
                  <>{feedbackData?.meta.totalItems}</>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2 [&>button]:min-w-20">
          <DateRangePicker
            onChange={(v) => setDateRange(v)}
            value={dateRange}
            minDate={dayjs().subtract(env.NEXT_PUBLIC_MAX_DAYS, 'day').toDate()}
            maxDate={new Date()}
            maxDays={env.NEXT_PUBLIC_MAX_DAYS}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Icon name="RiSearchLine" />
                Search
              </Button>
            </PopoverTrigger>
          </Popover>
          <FeedbackTableViewOptions table={table} fields={fields} />
          <FeedbackTableExpand table={table} />
          <FeedbackTableDownload fields={fields} query={query} />
        </div>
      </div>
      <BasicTable
        table={table}
        className="table-fixed"
        onClickRow={(_, row) => openFeedbackDetail(row)}
        isLoading={isLoading}
      />
      <TablePagination table={table} />
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
