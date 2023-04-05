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
import type { NextPageWithLayout } from '@/pages/_app';
import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';

import { Card, MainTemplate, RowTable, TitleTemplate } from '@/components';
import { PATH } from '@/constants/path';
import { SnippetModal } from '@/containers';
import FeedbackTableContainer from '@/containers/tables/FeedbackTableContainer';
import { useOAIQuery } from '@/hooks';
import { useSetFeedbackTableStore } from '@/stores/feedback-table.store';

interface IProps {
  projectId: string;
  channelId: string;
  name: string;
  description: string;
}

const FeedbackIdPage: NextPageWithLayout<IProps> = (props) => {
  const { name, description, channelId, projectId } = props;

  const { data } = useOAIQuery({
    path: '/api/channels/{channelId}/fields',
    variables: { channelId },
  });

  const { t } = useTranslation();
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    useSetFeedbackTableStore.persist.setOptions({ name: channelId });
    useSetFeedbackTableStore.persist.rehydrate();
  }, [channelId]);

  return (
    <TitleTemplate title={`${t('title.manageChannel')} | ${name} `} showBackBtn>
      <Stack gap={4}>
        <Flex gap={4}>
          <Card
            title={t('title.card.channelInfo')}
            w="100%"
            actionChildren={
              <IconButton
                aria-label="modify"
                variant="outline"
                icon={<EditIcon />}
                onClick={() =>
                  router.push({
                    pathname: PATH.PROJECT_MANAGEMENT.CHANNEL.MODIFY,
                    query: { channelId, projectId },
                  })
                }
              />
            }
          >
            <Heading mb={4}>{name}</Heading>
            <Divider my={2} />
            <Text mb={2} fontWeight="medium">
              {t('description')}
            </Text>
            <Text>{description}</Text>
            <Divider my={2} />
          </Card>
        </Flex>
        <Card
          title={t('field')}
          actionChildren={
            <Button size="sm" onClick={() => setOpenModal(true)}>
              {t('feedbackCodeSnippet')}
            </Button>
          }
        >
          <SnippetModal
            channelId={channelId}
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
          />
          <RowTable
            tableProps={{ size: 'sm' }}
            columns={[
              { title: t('order'), dataIndex: 'order', width: '100px' },
              { title: t('fieldName'), dataIndex: 'name', width: '180px' },
              { title: t('fieldType'), dataIndex: 'type', width: '150px' },
              {
                title: 'isAdmin',
                dataIndex: 'isAdmin',
                width: '130px',
                render: (v) => (v ? 'O' : 'X'),
              },
              {
                title: 'isDisabled',
                dataIndex: 'isDisabled',
                width: '130px',
                render: (v) => (v ? 'O' : 'X'),
              },
              {
                title: t('fieldOption'),
                dataIndex: 'options',
                render: (options: { name: string; id: string }[]) => (
                  <Flex flexWrap="nowrap" overflowX="auto" gap={2}>
                    {options?.map(({ name }, idx) => (
                      <Tag key={idx} size="sm" flexShrink={0}>
                        {name}
                      </Tag>
                    ))}
                  </Flex>
                ),
              },
            ]}
            data={data?.sort((a, b) => a.order - b.order) ?? []}
          />
        </Card>
        <Card title="피드백 목록" overflowX="auto">
          <FeedbackTableContainer channelId={channelId} />
        </Card>
      </Stack>
    </TitleTemplate>
  );
};

FeedbackIdPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  params,
  locale,
}) => {
  const channelId = (params?.channelId ?? '') as string;
  const projectId = (params?.projectId ?? '') as string;

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/channels/${channelId}`,
    { method: 'get' },
  );

  const data = await response.json();
  if (response.status !== 200) {
    return { notFound: true };
  }

  const { name, description } = data;

  return {
    props: {
      projectId,
      channelId,
      name,
      description,
      ...(await serverSideTranslations(locale ?? 'en')),
    },
  };
};

export default FeedbackIdPage;
