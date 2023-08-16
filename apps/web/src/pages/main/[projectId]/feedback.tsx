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

import { MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { FeedbackTable } from '@/containers';
import { NextPageWithLayout } from '@/pages/_app';

interface IProps {
  projectId: number | null;
  channelId?: number | null;
}

const FeedbackManagementPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId, channelId } = props;

  const { t } = useTranslation();
  if (!projectId) return <div>Project Id is Bad Request</div>;
  if (channelId && isNaN(channelId)) {
    return <div>Channel Id is Bad Request</div>;
  }
  return (
    <>
      <h1 className="font-24-bold mb-3">{t('main.feedback.title')}</h1>
      <FeedbackTable projectId={projectId} channelId={channelId} />
    </>
  );
};

FeedbackManagementPage.getLayout = function getLayout(page) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId: parseInt(query.projectId as string),
      channelId: query.channelId ? +query.channelId : null,
    },
  };
};

export default FeedbackManagementPage;
