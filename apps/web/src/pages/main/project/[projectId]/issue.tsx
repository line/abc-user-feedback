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
import { getIronSession } from 'iron-session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { CreateChannelButton, MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { ironOption } from '@/constants/iron-option';
import { IssueTable } from '@/containers/tables';
import { env } from '@/env.mjs';
import type { NextPageWithLayout } from '../../../_app';

interface IProps {
  projectId: number;
  noChannel?: boolean;
}
const IssueMangementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId, noChannel } = props;
  const { t } = useTranslation();
  return (
    <>
      <h1 className="font-20-bold mb-3">{t('main.issue.title')}</h1>
      {noChannel ? (
        <div className="flex flex-1 items-center justify-center">
          <CreateChannelButton projectId={projectId} type="blue" />
        </div>
      ) : (
        <IssueTable projectId={projectId} />
      )}
    </>
  );
};

IssueMangementPage.getLayout = function getLayout(page) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<IProps> = async ({
  req,
  res,
  locale,
  query,
}) => {
  const session = await getIronSession(req, res, ironOption);

  const projectId = parseInt(query.projectId as string);

  const response1 = await fetch(
    `${env.API_BASE_URL}/api/projects/${projectId}`,
    { headers: { Authorization: 'Bearer ' + session.jwt?.accessToken } },
  );

  if (response1.status === 401) {
    return {
      redirect: {
        destination: `/main/${projectId}/not-permission`,
        permanent: true,
      },
    };
  }

  const response2 = await fetch(
    `${env.API_BASE_URL}/api/projects/${projectId}/channels`,
    { headers: { Authorization: 'Bearer ' + session.jwt?.accessToken } },
  );
  if (response2.status === 401) {
    return {
      redirect: {
        destination: `/main/${projectId}/not-permission`,
        permanent: true,
      },
    };
  }
  const data = await response2.json();
  if (data.meta.totalItems === 0) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
        projectId,
        noChannel: true,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
      noChannel: false,
    },
  };
};

export default IssueMangementPage;
