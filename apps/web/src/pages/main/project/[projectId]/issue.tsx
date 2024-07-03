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
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { DEFAULT_LOCALE, useOAIQuery } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { RouteCreateChannelButton } from '@/features/create-channel';
import { MainLayout } from '@/widgets';
import { IssueTable } from '@/widgets/issue-table';

interface IProps {
  projectId: number;
}
const IssueMangementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId } = props;
  const { t } = useTranslation();
  const { data, status } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  return (
    <>
      <h1 className="font-20-bold mb-3">{t('main.issue.title')}</h1>
      {status === 'pending' ?
        <p className="font-32-bold animate-bounce">Loading...</p>
      : status === 'error' ?
        <p className="font-32-bold">Not Permission</p>
      : data.meta.totalItems === 0 ?
        <div className="flex flex-1 items-center justify-center">
          <RouteCreateChannelButton projectId={projectId} type="blue" />
        </div>
      : <IssueTable projectId={projectId} />}
    </>
  );
};

IssueMangementPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  locale,
  query,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
      noChannel: false,
    },
  };
};

export default IssueMangementPage;
