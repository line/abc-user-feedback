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
import type { PaginationState } from '@tanstack/react-table';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Button, Popover, PopoverTrigger, toast } from '@ufb/react';

import { cn, DEFAULT_LOCALE, useOAIQuery } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import type { Channel } from '@/entities/channel';
import { FeedbackTable, useFeedbackSearch } from '@/entities/feedback';
import { ProjectGuard } from '@/entities/project';
import { Layout } from '@/widgets/layout';

interface IProps {
  projectId: number;
  channelId?: number | null;
}

const FeedbackManagementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId, channelId } = props;
  const [currentChannelId, setCurrentChannelId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId: currentChannelId!, projectId },
    queryOptions: { enabled: !!currentChannelId },
  });

  const { data: feedbackData, isLoading } = useFeedbackSearch(
    projectId,
    currentChannelId!,
    { query: {}, page: pagination.pageIndex + 1, limit: pagination.pageSize },
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

  useEffect(() => {
    if (!data || currentChannelId) return;
    setCurrentChannelId(data.items[0]?.id ?? null);
  }, [data]);

  if (channelId && isNaN(channelId)) {
    return <div>Channel Id is Bad Request</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div className="bg-neutral-tertiary rounded-8 flex gap-2 p-2">
          {data?.items.map((channel) => (
            <button
              key={channel.id}
              className={cn('rounded-8 border p-2', {
                'bg-white': currentChannelId === channel.id,
              })}
              onClick={() => setCurrentChannelId(channel.id)}
            >
              {channel.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2 [&>button]:min-w-min">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" iconL="RiCalendar2Line">
                Date
              </Button>
            </PopoverTrigger>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" iconL="RiSearchLine">
                Search
              </Button>
            </PopoverTrigger>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" iconL="RiEyeLine">
                View
              </Button>
            </PopoverTrigger>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" iconL="RiLineHeight">
                Expand
              </Button>
            </PopoverTrigger>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" iconL="RiDownload2Line">
                Export
              </Button>
            </PopoverTrigger>
          </Popover>
        </div>
      </div>
      <FeedbackTable
        fields={channelData?.fields ?? []}
        feedbacks={feedbackData?.items ?? []}
        pageCount={feedbackData?.meta.totalPages ?? 0}
        rowCount={feedbackData?.meta.totalItems ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </>
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
      channelId: query.channelId ? +query.channelId : null,
      noChannel: false,
    },
  };
};

export default FeedbackManagementPage;
