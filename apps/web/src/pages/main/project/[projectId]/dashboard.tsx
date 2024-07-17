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
import dayjs from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQueryState } from 'nuqs';
import { Trans, useTranslation } from 'react-i18next';

import { DateRangePicker, DEFAULT_LOCALE, parseAsDateRange } from '@/shared';
import type { DateRangeType, NextPageWithLayout } from '@/shared/types';
import {
  FeedbackLineChart,
  IssueBarChart,
  IssueFeedbackLineChart,
  IssueLineChart,
  IssueRank,
} from '@/entities/dashboard';
import { ProjectGuard } from '@/entities/project';
import { MainLayout } from '@/widgets';
import { DashbaordCardSlider } from '@/widgets/dashboard-card-slider';

interface IProps {
  projectId: number;
}

const DEFAULT_DATE_RANGE = {
  startDate: dayjs().subtract(31, 'day').startOf('day').toDate(),
  endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
};

const options = [
  {
    label: <Trans i18nKey="text.date.yesterday" />,
    startDate: dayjs().subtract(1, 'days').startOf('day').toDate(),
    endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
  },
  {
    label: <Trans i18nKey="text.date.before-days" tOptions={{ day: 7 }} />,
    startDate: dayjs().subtract(8, 'days').toDate(),
    endDate: dayjs().subtract(1, 'days').toDate(),
  },
  {
    label: <Trans i18nKey="text.date.before-days" tOptions={{ day: 30 }} />,
    startDate: dayjs().subtract(31, 'days').toDate(),
    endDate: dayjs().subtract(1, 'days').toDate(),
  },
  {
    label: <Trans i18nKey="text.date.before-days" tOptions={{ day: 90 }} />,
    startDate: dayjs().subtract(91, 'days').toDate(),
    endDate: dayjs().subtract(1, 'days').toDate(),
  },
  {
    label: <Trans i18nKey="text.date.before-days" tOptions={{ day: 180 }} />,
    startDate: dayjs().subtract(181, 'days').toDate(),
    endDate: dayjs().subtract(1, 'days').toDate(),
  },
  {
    label: <Trans i18nKey="text.date.before-days" tOptions={{ day: 365 }} />,
    startDate: dayjs().subtract(366, 'days').toDate(),
    endDate: dayjs().subtract(1, 'days').toDate(),
  },
];

const DashboardPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useQueryState(
    'dateRange',
    parseAsDateRange.withDefault(DEFAULT_DATE_RANGE),
  );

  const onChangeDateRange = async (v: DateRangeType) => {
    if (!v?.startDate || !v.endDate) return;
    await setDateRange({ startDate: v.startDate, endDate: v.endDate });
  };

  const currentDate = dayjs().format('YYYY-MM-DD HH:mm');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-20-bold">
          {t('main.dashboard.title')}
          <span className="font-12-regular text-secondary ml-2">
            Updated: {currentDate}
          </span>
        </h1>
        <div>
          <DateRangePicker
            value={dateRange}
            onChange={onChangeDateRange}
            maxDate={dayjs().subtract(1, 'day').toDate()}
            options={options}
            maxDays={365}
          />
        </div>
      </div>
      <DashbaordCardSlider
        projectId={projectId}
        from={dateRange.startDate}
        to={dateRange.endDate}
      />

      <FeedbackLineChart
        from={dateRange.startDate}
        to={dateRange.endDate}
        projectId={projectId}
      />
      <IssueLineChart
        from={dateRange.startDate}
        to={dateRange.endDate}
        projectId={projectId}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          <IssueBarChart
            from={dateRange.startDate}
            to={dateRange.endDate}
            projectId={projectId}
          />
        </div>
        <div className="flex-1">
          <IssueRank
            from={dateRange.startDate}
            to={dateRange.endDate}
            projectId={projectId}
          />
        </div>
      </div>
      <IssueFeedbackLineChart
        from={dateRange.startDate}
        to={dateRange.endDate}
        projectId={projectId}
      />
    </div>
  );
};

DashboardPage.getLayout = (page: React.ReactElement<IProps>) => {
  return (
    <MainLayout>
      <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default DashboardPage;
