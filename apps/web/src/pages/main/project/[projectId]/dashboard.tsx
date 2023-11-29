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
import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { getIronSession } from 'iron-session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { DateRangePicker, MainTemplate } from '@/components';
import { SimpleBarChart, StackedBarChart } from '@/components/charts';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { ironOption } from '@/constants/iron-option';
import {
  CreateFeedbackPerIssueCard,
  IssueRank,
  SevenDaysFeedbackCard,
  SevendaysIssueCard,
  ThirtyDaysFeedbackCard,
  ThirtyDaysIssueCard,
  TodayFeedbackCard,
  TodayIssueCard,
  TotalFeedbackCard,
  TotalIssueCard,
  YesterdayFeedbackCard,
  YesterdayIssueCard,
} from '@/containers/dashboard';
import FeedbackLineChart from '@/containers/dashboard/FeedbackLineChart';
import { env } from '@/env.mjs';
import type { NextPageWithLayout } from '@/pages/_app';
import type { DateRangeType } from '@/types/date-range.type';

interface IProps {
  projectId: number;
}

const DashboardPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
  });
  console.log('dateRange: ', dateRange?.endDate);

  if (!dateRange || !dateRange.startDate || !dateRange.endDate) return <></>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h1 className="font-20-bold mb-3">{t('main.dashboard.title')}</h1>
        <div>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            maxDate={dayjs().subtract(1, 'day').toDate()}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <TotalFeedbackCard
          projectId={projectId}
          from={dateRange.startDate}
          to={dateRange.endDate}
        />
        <TotalIssueCard
          projectId={projectId}
          from={dateRange.startDate}
          to={dateRange.endDate}
        />
        <CreateFeedbackPerIssueCard
          projectId={projectId}
          from={dateRange.startDate}
          to={dateRange.endDate}
        />
        <TodayFeedbackCard projectId={projectId} />
        <YesterdayFeedbackCard projectId={projectId} />
        <SevenDaysFeedbackCard projectId={projectId} />
        <ThirtyDaysFeedbackCard projectId={projectId} />

        <TodayIssueCard />
        <YesterdayIssueCard />
        <SevendaysIssueCard />
        <ThirtyDaysIssueCard />
      </div>
      <FeedbackLineChart
        from={dateRange.startDate}
        to={dateRange.endDate}
        projectId={projectId}
      />
      <div className="h-[400px]">
        <SimpleBarChart
          data={Array.from({ length: 10 }).map((_, i) => ({
            name: dayjs().add(i, 'day').format('YYYY-MM-DD'),
            value: faker.number.int(1000),
          }))}
        />
      </div>
      <div className="flex h-[400px]">
        <div className="flex-1">
          <StackedBarChart
            data={Array.from({ length: 10 }).map((_, i) => ({
              date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
              issuedFeedbackCount: faker.number.int(100),
              feedbackCount: faker.number.int(100),
            }))}
          />
        </div>
        <div className="flex-1">
          <IssueRank />
        </div>
      </div>
    </div>
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
