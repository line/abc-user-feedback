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
import { Button, Flex, Tag, Text } from '@chakra-ui/react';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useMemo } from 'react';

import { Card, MainTemplate, RowTable, TitleTemplate } from '@/components';
import { IRowTable } from '@/components/tables/RowTable';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useOAIQuery } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';

const RolePage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { data } = useOAIQuery({ path: '/api/roles' });

  const columns = useMemo<IRowTable.ColumnsType[]>(
    () => [
      {
        title: t('roleName'),
        dataIndex: 'name',
        width: '200px',
        render: (v, r) => (
          <Text color="primary" textDecoration="underline">
            <Link
              href={{
                pathname: PATH.SETTING.ROLE.DETAIL,
                query: { roleId: r.id },
              }}
            >
              {v}
            </Link>
          </Text>
        ),
      },
      {
        title: t('permission'),
        dataIndex: 'permissions',
        render: (perms: string[]) => (
          <Flex gap={2} overflowX="auto">
            {perms?.map((perm) => (
              <Tag key={perm} size="sm" flexShrink={0}>
                {perm}
              </Tag>
            ))}
          </Flex>
        ),
      },
    ],
    [t],
  );

  return (
    <TitleTemplate title={t('title.roleManagement')}>
      <Card
        title={`${data?.total} ${t('roles')}`}
        actionChildren={
          <Button
            variant="link"
            size="sx"
            onClick={() => router.push(PATH.SETTING.ROLE.CREATE)}
          >
            {t('button.createRole')}
          </Button>
        }
      >
        <RowTable columns={columns} data={data?.roles ?? []} />
      </Card>
    </TitleTemplate>
  );
};

RolePage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default RolePage;
