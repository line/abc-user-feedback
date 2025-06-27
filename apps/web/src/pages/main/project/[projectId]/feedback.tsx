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
import { useEffect, useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Button, Icon } from '@ufb/react';

import type { TableFilterField } from '@/shared';
import { useAllChannels, useOAIQuery } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { useCheckAIUsageLimit } from '@/entities/ai';
import { useRoutingChannelCreation } from '@/entities/channel/lib';
import { FeedbackTable } from '@/entities/feedback';
import { ProjectGuard } from '@/entities/project';
import { Layout } from '@/widgets/layout';

import serverSideTranslations from '@/server-side-translations';

interface IProps {
  projectId: number;
}

const FeedbackManagementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId } = props;

  const router = useRouter();
  const { t } = useTranslation();

  useCheckAIUsageLimit(projectId);

  const { data: channels, isLoading } = useAllChannels(projectId);
  const { openChannelInProgress } = useRoutingChannelCreation(projectId);

  const [currentChannelId, setCurrentChannelId] = useQueryState<number>(
    'channelId',
    parseAsInteger.withDefault(-1),
  );

  const { data: channelData, isLoading: isChannelLoading } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId: currentChannelId, projectId },
    queryOptions: {
      enabled: currentChannelId !== -1,
    },
  });

  const currentChannel = useMemo(() => {
    return channels?.items.find((channel) => channel.id === currentChannelId);
  }, [channels, currentChannelId]);

  const fields = (channelData?.fields ?? []).sort((a, b) => a.order - b.order);

  const filterFields = useMemo(() => {
    return (channelData?.fields ?? [])
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
            matchType: ['IS', 'CONTAINS'],
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
            matchType: ['CONTAINS', 'IS'],
          };
        }
        if (field.format === 'aiField') {
          return {
            key: field.key,
            name: field.name,
            format: 'string',
            matchType: ['CONTAINS'],
          };
        }
      })
      .filter((v) => !!v?.key) as TableFilterField[];
  }, [channelData]);

  useEffect(() => {
    if (!channels || currentChannelId !== -1) return;
    void setCurrentChannelId(channels.items[0]?.id ?? null);
  }, [channels, currentChannelId]);

  if (isLoading || isChannelLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Icon name="RiLoader4Line" className="animate-spin" />
      </div>
    );
  }

  if (channels?.meta.totalItems === 0 && currentChannelId === -1) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/assets/images/channel-make.svg"
            alt="No channels"
            width={200}
            height={200}
          />
          <p className="text-neutral-secondary text-center">
            {t('v2.text.no-data.channel')}
          </p>
          <Button onClick={openChannelInProgress}>
            {t('v2.text.create-channel')}
          </Button>
        </div>
      </div>
    );
  }

  if (!currentChannel) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Icon name="RiInboxArchiveLine" size={32} />
          <p className="text-neutral-secondary text-center">
            Channel is invalid.
          </p>
          <Button
            onClick={() =>
              router.replace({
                pathname: router.pathname,
                query: { projectId },
              })
            }
          >
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FeedbackTable
      channels={channels?.items ?? []}
      currentChannel={currentChannel}
      setCurrentChannelId={setCurrentChannelId}
      projectId={projectId}
      filterFields={filterFields}
      fields={fields}
    />
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
      ...(await serverSideTranslations(locale)),
      projectId,
    },
  };
};

export default FeedbackManagementPage;
