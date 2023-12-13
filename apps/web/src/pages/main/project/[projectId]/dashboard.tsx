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
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import dayjs from 'dayjs';
import { getIronSession } from 'iron-session';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { DateRangePicker, MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { ironOption } from '@/constants/iron-option';
import {
  CreateFeedbackPerIssueCard,
  IssueBarChart,
  IssueFeedbackLineChart,
  IssueLineChart,
  IssueRank,
  SevenDaysFeedbackCard,
  SevenDaysIssueCard,
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
  const currentDate = useMemo(() => dayjs().format('YYYY-MM-DD HH:mm'), []);

  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
  });

  const options = useMemo(() => {
    return [
      {
        label: t('text.date.yesterday'),
        startDate: dayjs().subtract(1, 'days').startOf('day').toDate(),
        endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 7 }),
        startDate: dayjs().subtract(8, 'days').toDate(),
        endDate: dayjs().subtract(1, 'days').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 30 }),
        startDate: dayjs().subtract(31, 'days').toDate(),
        endDate: dayjs().subtract(1, 'days').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 90 }),
        startDate: dayjs().subtract(91, 'days').toDate(),
        endDate: dayjs().subtract(1, 'days').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 180 }),
        startDate: dayjs().subtract(181, 'days').toDate(),
        endDate: dayjs().subtract(1, 'days').toDate(),
      },
      {
        label: t('text.date.before-days', { day: 365 }),
        startDate: dayjs().subtract(366, 'days').toDate(),
        endDate: dayjs().subtract(1, 'days').toDate(),
      },
    ];
  }, [t]);

  if (!dateRange || !dateRange.startDate || !dateRange.endDate) return <></>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h1 className="font-20-bold mb-3">
          {t('main.dashboard.title')}
          <span className="font-12-regular text-secondary ml-2">
            Update: {currentDate}
          </span>
        </h1>
        <div>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            maxDate={dayjs().subtract(1, 'day').toDate()}
            options={options}
          />
        </div>
      </div>
      <CardSlider>
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

        <TodayIssueCard projectId={projectId} />
        <YesterdayIssueCard projectId={projectId} />
        <SevenDaysIssueCard projectId={projectId} />
        <ThirtyDaysIssueCard projectId={projectId} />
      </CardSlider>
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

      <div className="flex gap-5">
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

const CardSlider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { height } = entry.contentRect;
      setShowButton(height === 220);
    });

    // 2. 감지할 요소 추가하기
    observer.observe(ref.current);
    return () => {
      if (!ref.current) return;
      observer.unobserve(ref.current);
    };
  }, [ref.current]);

  const scroll = (scrollOffset: number) => {
    if (!ref.current) return;
    ref.current.scrollTo({ left: scrollOffset, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="scrollbar-hide flex max-h-[220px] flex-wrap gap-3 overflow-x-auto"
        ref={ref}
      >
        {children}
      </div>
      {showButton && (
        <>
          <button
            onClick={() => scroll(220)}
            className="icon-btn icon-btn-secondary icon-btn-md icon-btn-rounded absolute-y-center absolute right-0"
          >
            <Icon name="ArrowRight" />
          </button>
          <button
            onClick={() => scroll(-220)}
            className="icon-btn icon-btn-secondary icon-btn-md icon-btn-rounded absolute-y-center absolute left-0"
          >
            <Icon name="ArrowLeft" />
          </button>
        </>
      )}
    </div>
  );
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
DashboardPage.getLayout = function getLayout(page) {
  return <MainTemplate>{page}</MainTemplate>;
};

export default DashboardPage;
