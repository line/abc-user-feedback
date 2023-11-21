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
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { getIronSession } from 'iron-session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { DescriptionTooltip, MainTemplate, SelectBox } from '@/components';
import {
  SimpleBarChart,
  SimpleLineChart,
  StackedBarChart,
} from '@/components/charts';
import DashboardCard from '@/components/etc/DashboardCard';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { ironOption } from '@/constants/iron-option';
import { env } from '@/env.mjs';
import type { NextPageWithLayout } from '@/pages/_app';

interface IProps {
  projectId: number;
}

const DashboardPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  console.log('projectId: ', projectId);
  const { t } = useTranslation();
  return (
    <>
      <h1 className="font-20-bold mb-3">{t('main.dashboard.title')}</h1>

      <div className="border-fill-tertiary rounded border">
        <div className="flex justify-between p-4">
          <div className="flex items-center gap-1">
            <h3 className="font-20-bold">이슈 순위</h3>
            <DescriptionTooltip description="이슈 순위" />
          </div>
          <div className="flex items-center gap-2">
            <SelectBox />
            <button className="btn btn-secondary">필터설정</button>
          </div>
        </div>
        <table></table>
      </div>
      <div className="flex flex-wrap">
        <DashboardCard
          percentage={-10}
          title="피드백 수집 누적 수"
          count={652148}
        />
      </div>

      {/* simple line chart */}
      <SimpleLineChart
        data={Array.from({ length: 10 }).map((_, i) => ({
          date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
          issuedFeedbackCount: faker.number.int(1000),
          feedbackCount: faker.number.int(1000),
        }))}
      />
      {/* simple bar chart */}
      <SimpleBarChart
        data={Array.from({ length: 10 }).map((_, i) => ({
          name: dayjs().add(i, 'day').format('YYYY-MM-DD'),
          value: faker.number.int(1000),
        }))}
      />
      {/* stacked bar chart */}
      <StackedBarChart
        data={Array.from({ length: 10 }).map((_, i) => ({
          date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
          issuedFeedbackCount: faker.number.int(100),
          feedbackCount: faker.number.int(100),
        }))}
      />
    </>
  );
};

DashboardPage.getLayout = function getLayout(page) {
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
    `${env.API_BASE_URL}/api/projects/${projectId}`,
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

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default DashboardPage;
