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
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import dayjs from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import type { NextPageWithLayout } from '@/shared/types';
import { MainLayout } from '@/widgets';

import { DateRangePicker } from '@/components';
import { DATE_FORMAT } from '@/constants/dayjs-format';
import { DEFAULT_LOCALE } from '@/constants/i18n';
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
import useQueryParamsState from '@/hooks/useQueryParamsState';
import type { DateRangeType } from '@/types/date-range.type';

interface IProps {
  projectId: number;
}
const DEFAULT_DATE_RANGE: DateRangeType = {
  startDate: dayjs().subtract(31, 'day').startOf('day').toDate(),
  endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
};
const DEFAULT_DATE_RANGE_STRING = {
  createdAt: `${dayjs(DEFAULT_DATE_RANGE.startDate).format(
    'YYYY-MM-DD',
  )}~${dayjs(DEFAULT_DATE_RANGE.endDate).format('YYYY-MM-DD')}`,
};

const DashboardPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const { query, setQuery } = useQueryParamsState(
    { projectId },
    DEFAULT_DATE_RANGE_STRING,
    (input) => {
      if (!input.createdAt) return false;
      const [starDate, endDate] = input.createdAt.split('~');
      if (dayjs(endDate).isAfter(dayjs(), 'day')) return false;
      if (dayjs(endDate).isBefore(dayjs(starDate), 'day')) return false;
      return true;
    },
  );

  const dateRange = useMemo(() => {
    const queryStr =
      query['createdAt'] ?? DEFAULT_DATE_RANGE_STRING['createdAt'];

    const [startDateStr, endDateStr] = queryStr.split('~');

    return {
      startDate: dayjs(startDateStr).toDate(),
      endDate: dayjs(endDateStr).toDate(),
    };
  }, [query]);

  const setDateRange = useCallback(
    (dateRange: DateRangeType) => {
      setQuery({
        ...query,
        createdAt:
          dateRange ?
            `${dayjs(dateRange.startDate).format(DATE_FORMAT)}~${dayjs(
              dateRange.endDate,
            ).format(DATE_FORMAT)}`
          : undefined,
      });
    },
    [query],
  );

  const currentDate = useMemo(
    () => dayjs().format('YYYY-MM-DD HH:mm'),
    [dateRange],
  );

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
            onChange={setDateRange}
            maxDate={dayjs().subtract(1, 'day').toDate()}
            options={options}
            maxDays={365}
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

interface ICardSliderProps extends React.PropsWithChildren {}

const CardSlider: React.FC<ICardSliderProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [showRightButton, setShowRightButton] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width } = entry.contentRect;
      setShowRightButton(width < 1380);
    });
    observer.observe(containerRef.current);
    return () => {
      if (!containerRef.current) return;
      observer.unobserve(containerRef.current);
    };
  }, [containerRef.current]);

  const scrollLeft = () => {
    if (!containerRef.current) return;
    setShowLeftButton(false);
    setShowRightButton(true);
    containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (!containerRef.current) return;
    setShowLeftButton(true);
    setShowRightButton(false);
    containerRef.current.scrollTo({ left: 1380, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="scrollbar-hide overflow-auto" ref={containerRef}>
        <div className="flex min-w-[1380px] flex-wrap gap-3">{children}</div>
      </div>
      {showRightButton && (
        <button
          onClick={scrollRight}
          className="icon-btn icon-btn-secondary icon-btn-sm icon-btn-rounded absolute-y-center absolute right-0"
        >
          <Icon name="ArrowRight" />
        </button>
      )}
      {showLeftButton && (
        <button
          onClick={scrollLeft}
          className="icon-btn icon-btn-secondary icon-btn-sm icon-btn-rounded absolute-y-center absolute left-0"
        >
          <Icon name="ArrowLeft" />
        </button>
      )}
    </div>
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
DashboardPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export default DashboardPage;
