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
import { Spinner, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { DataTable } from '@/components/tables';
import { DATE_FORMAT } from '@/constants/dayjs-format';
import { PATH } from '@/constants/path';
import { useOAIQuery } from '@/hooks';

const LIMIT = 10;

interface IProps extends React.PropsWithChildren {
  projectId: string;
}

const ChannelTable: React.FC<IProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, status } = useOAIQuery({
    path: '/api/projects/{projectId}/channels',
    variables: {
      limit: LIMIT,
      page: currentPage,
      projectId,
      keyword,
    },
    queryOptions: { keepPreviousData: true },
  });

  if (!data) return <Spinner />;

  return (
    <DataTable
      columns={[
        {
          title: t('table.head.channelTitle'),
          dataIndex: 'name',
          width: '25%',
          render: (v, r) => (
            <Link
              href={{
                pathname: PATH.PROJECT_MANAGEMENT.CHANNEL.DETAIL,
                query: { channelId: r.id, projectId },
              }}
              passHref
            >
              <Text
                color="primary"
                textDecor="underline"
                display="block"
                _hover={{ cursor: 'pointer' }}
              >
                {v}
              </Text>
            </Link>
          ),
        },
        {
          title: t('description'),
          dataIndex: 'description',
          width: '45%',
          render: (value) => (
            <Text
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxW: '200px',
              }}
            >
              {value}
            </Text>
          ),
        },
        {
          title: t('table.head.createAt'),
          dataIndex: 'createdAt',
          render: (v) => <>{dayjs(v).format(DATE_FORMAT)}</>,
          width: '15%',
        },
        {
          title: t('table.head.createBy'),
          dataIndex: 'createdBy',
          width: '15%',
          render: (v) => <>{v?.nickname ?? ''}</>,
        },
      ]}
      data={data?.items ?? []}
      status={status}
      tableBar={{
        count: data?.meta.totalItems,
        rightButtons: [
          {
            children: t('button.registerChannel'),
            onClick: () =>
              router.push({
                pathname: PATH.PROJECT_MANAGEMENT.CHANNEL.CREATE,
                query: { projectId },
              }),
          },
        ],
        searchInput: {
          value: keyword,
          onChange: (e) => setKeyword(e.currentTarget.value),
          placeholder: t('input.placeholder.channelTitle'),
        },
      }}
      pagination={{
        meta: data.meta,
        onChangePage: (page) => setCurrentPage(page),
      }}
    />
  );
};

export default ChannelTable;
