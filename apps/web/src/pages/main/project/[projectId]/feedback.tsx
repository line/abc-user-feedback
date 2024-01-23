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

import { MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { ironOption } from '@/constants/iron-option';
import { FeedbackTable } from '@/containers';
import { CreateChannelButton } from '@/containers/buttons';
import { env } from '@/env.mjs';
import type { NextPageWithLayout } from '@/pages/_app';

interface IProps {
  projectId: number;
  channelId?: number | null;
  noChannel?: boolean;
}

const FeedbackManagementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId, channelId, noChannel } = props;

  const { t } = useTranslation();

  if (channelId && isNaN(channelId)) {
    return <div>Channel Id is Bad Request</div>;
  }

  return (
    <>
      <h1 className="font-20-bold mb-3">{t('main.feedback.title')}</h1>
      {noChannel ? (
        <div className="flex flex-1 items-center justify-center">
          <CreateChannelButton projectId={projectId} type="blue" />
        </div>
      ) : (
        <FeedbackTable projectId={projectId} channelId={channelId} />
      )}
    </>
  );
};

FeedbackManagementPage.getLayout = function getLayout(page) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
  res,
}) => {
  const session = await getIronSession(req, res, ironOption);
  const projectId = parseInt(query.projectId as string);

  const response = await fetch(
    `${env.API_BASE_URL}/api/projects/${projectId}/channels`,
    { headers: { Authorization: 'Bearer ' + session.jwt?.accessToken } },
  );

  if (response.status === 401) {
    return {
      redirect: {
        destination: `/main/${projectId}/not-permission`,
        permanent: true,
      },
    };
  }
  const data = await response.json();
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
      channelId: query.channelId ? +query.channelId : null,
      noChannel: false,
    },
  };
};

export default FeedbackManagementPage;
