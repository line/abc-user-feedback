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
import { Button, Spinner, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { DataTable } from '@/components/tables';
import { PATH } from '@/constants/path';
import { useOAIQuery } from '@/hooks';

const LIMIT = 5;
const ONLY_DATE_FORMAT = 'YYYY-MM-DD';
interface IProps extends React.PropsWithChildren {}

const ProjectTable: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, status } = useOAIQuery({
    path: '/api/projects',
    variables: { keyword, limit: LIMIT, page: currentPage },
    queryOptions: { keepPreviousData: true },
  });

  if (!data) return <Spinner />;

  return (
    <DataTable
      columns={[
        {
          title: t('table.head.projectTitle'),
          dataIndex: 'name',
          width: '20%',
          render: (v, r) => (
            <Link
              href={{
                pathname: PATH.PROJECT_MANAGEMENT.PROJECT.DETAIL,
                query: { projectId: r.id },
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
        },
        {
          title: t('table.head.createAt'),
          dataIndex: 'createdAt',
          render: (v) => <>{dayjs(v).format(ONLY_DATE_FORMAT)}</>,
          width: '15%',
        },
        {
          title: t('table.head.createBy'),
          dataIndex: 'createdBy',
          width: '20%',
          render: (v) => <>{v?.nickname ?? ''}</>,
        },
      ]}
      data={data?.items ?? []}
      status={status}
      tableBar={{
        count: data?.meta.totalItems,
        rightButtons: [
          {
            children: t('button.registerProject'),
            onClick: () => router.push(PATH.PROJECT_MANAGEMENT.PROJECT.CREATE),
          },
        ],
        searchInput: {
          value: keyword,
          onChange: (e) => setKeyword(e.currentTarget.value),
          placeholder: t('input.placeholder.projectTitle'),
        },
      }}
      pagination={{
        meta: data?.meta,
        onChangePage: (page) => setCurrentPage(page),
      }}
    />
  );
};

export default ProjectTable;
