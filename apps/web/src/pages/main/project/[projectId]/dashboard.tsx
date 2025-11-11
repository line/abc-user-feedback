/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import dayjs from 'dayjs';
import { Trans, useTranslation } from 'next-i18next';
import { useQueryState } from 'nuqs';

import {
  Badge,
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

import { DateRangePicker, parseAsDateRange } from '@/shared';
import type { DateRangeType, NextPageWithLayout } from '@/shared/types';
import {
  FeedbackLineChart,
  IssueBarChart,
  IssueFeedbackLineChart,
  IssueLineChart,
  IssueRank,
} from '@/entities/dashboard';
import { ProjectGuard } from '@/entities/project';
import { DashboardCardList } from '@/widgets/dashboard-card-list';
import { Layout } from '@/widgets/layout';

import serverSideTranslations from '@/server-side-translations';

interface IProps {
  projectId: number;
}

const options = [
  {
    label: <Trans i18nKey="text.date.yesterday" />,
    dateRange: {
      startDate: dayjs().subtract(1, 'days').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
    },
  },
  {
    label: <Trans i18nKey="text.date.last-days" tOptions={{ day: 7 }} />,
    dateRange: {
      startDate: dayjs().subtract(7, 'days').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
    },
  },
  {
    label: <Trans i18nKey="text.date.last-days" tOptions={{ day: 30 }} />,
    dateRange: {
      startDate: dayjs().subtract(30, 'days').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
    },
  },
  {
    label: <Trans i18nKey="text.date.last-days" tOptions={{ day: 90 }} />,
    dateRange: {
      startDate: dayjs().subtract(90, 'days').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
    },
  },
  {
    label: <Trans i18nKey="text.date.last-days" tOptions={{ day: 180 }} />,
    dateRange: {
      startDate: dayjs().subtract(180, 'days').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
    },
  },
  {
    label: <Trans i18nKey="text.date.last-days" tOptions={{ day: 365 }} />,
    dateRange: {
      startDate: dayjs().subtract(365, 'days').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'days').endOf('day').toDate(),
    },
  },
];

const DashboardPage: NextPageWithLayout<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useQueryState(
    'dateRange',
    parseAsDateRange.withDefault({
      startDate: dayjs().subtract(1, 'y').startOf('day').toDate(),
      endDate: dayjs().subtract(1, 'day').endOf('day').toDate(),
    }),
  );
  const [invisibles, setInvisibles] = useState<Record<string, boolean>>({});

  const onChangeDateRange = async (v: DateRangeType) => {
    if (!v?.startDate || !v.endDate) return;
    await setDateRange({ startDate: v.startDate, endDate: v.endDate });
  };

  const viewItems = [
    {
      label: t('dashboard-card.total-feedback.title'),
      value: 'TotalFeedbackCard',
    },
    {
      label: t('dashboard-card.today-feedback.title'),
      value: 'TodayFeedbackCard',
    },
    {
      label: t('dashboard-card.yesterday-feedback.title'),
      value: 'YesterdayFeedbackCard',
    },
    {
      label: t('dashboard-card.n-days-feedback.title', { n: 7 }),
      value: 'SevenDaysFeedbackCard',
    },
    {
      label: t('dashboard-card.n-days-feedback.title', { n: 30 }),
      value: 'ThirtyDaysFeedbackCard',
    },
    { label: t('dashboard-card.total-issue.title'), value: 'TotalIssueCard' },
    {
      label: t('dashboard-card.issue-ratio.title'),
      value: 'CreateFeedbackPerIssueCard',
    },
    { label: t('dashboard-card.today-issue.title'), value: 'TodayIssueCard' },
    {
      label: t('dashboard-card.yesterday-issue.title'),
      value: 'YesterdayIssueCard',
    },
    {
      label: t('dashboard-card.n-days-issue.title', { n: 7 }),
      value: 'SevenDaysIssueCard',
    },
    {
      label: t('dashboard-card.n-days-issue.title', { n: 30 }),
      value: 'ThirtyDaysIssueCard',
    },
  ];

  const viewCount = useMemo(
    () =>
      viewItems.reduce(
        (acc, { value }) => (invisibles[value] ? acc : acc + 1),
        0,
      ),
    [invisibles],
  );

  return (
    <div className="flex flex-col gap-5 pb-14">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={onChangeDateRange}
            maxDate={dayjs().subtract(1, 'day').toDate()}
            options={options}
            maxDays={365}
            tooltipContent={t('tooltip.dashboard-date-picker-button')}
          />
          <Combobox>
            <ComboboxTrigger>
              <Icon name="RiEyeLine" />
              View
              <Badge variant="subtle">{viewCount}</Badge>
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxList>
                {viewItems.map(({ label, value }) => (
                  <ComboboxSelectItem
                    key={value}
                    value={value}
                    onSelect={() => {
                      setInvisibles((prev) => ({
                        ...prev,
                        [value]: !prev[value],
                      }));
                    }}
                    checked={!invisibles[value]}
                  >
                    {label}
                  </ComboboxSelectItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
      <DashboardCardList
        projectId={projectId}
        from={dateRange.startDate}
        to={dateRange.endDate}
        invisible={invisibles}
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
      <div className="flex items-stretch gap-5">
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
  const currentDate = dayjs().format('YYYY-MM-DD HH:mm');

  return (
    <Layout
      projectId={page.props.projectId}
      title="Dashboard"
      extra={
        <span className="text-neutral-tertiary text-small-normal flex items-center gap-1">
          <Icon name="RiRefreshLine" size={12} />
          Updated: {currentDate}
        </span>
      }
    >
      <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      projectId,
    },
  };
};

export default DashboardPage;
