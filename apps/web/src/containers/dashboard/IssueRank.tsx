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
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { Icon, PopoverCloseButton } from '@ufb/ui';

import { DescriptionTooltip } from '@/components';
import DashboardTable from '@/components/etc/DashboardTable';
import { ISSUES } from '@/constants/issues';
import { Path } from '@/constants/path';
import { useIssueSearch, useOAIQuery } from '@/hooks';

interface IssueTableData {
  id: number;
  no: number;
  status: string;
  name: string;
  count: number;
  growth: number;
}

const columnHelper = createColumnHelper<IssueTableData>();
const columns = (t: TFunction) => [
  columnHelper.accessor('no', { header: 'No', enableSorting: false, size: 30 }),
  columnHelper.accessor('name', {
    header: 'Issue',
    enableSorting: false,
    cell({ getValue, row }) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <div className="flex items-center gap-1">
          <p>{getValue()}</p>
          <Link
            href={{
              pathname: Path.ISSUE,
              query: { projectId: router.query.projectId, id: row.original.id },
            }}
            target="_blank"
            rel="noreferrer"
          >
            <Icon
              name="RightCircleStroke"
              size={16}
              className="text-tertiary cursor-pointer"
            />
          </Link>
        </div>
      );
    },
  }),
  columnHelper.accessor('count', {
    header: () => (
      <>
        Count
        <DescriptionTooltip description={t('tooltip.issue-feedback-count')} />
      </>
    ),
    cell: ({ getValue }) => getValue().toLocaleString(),
  }),
  columnHelper.accessor('status', { header: 'Status', enableSorting: false }),
  columnHelper.accessor('growth', {
    header: () => (
      <>
        Growth
        <DescriptionTooltip description={t('tooltip.issue-feedback-growth')} />
      </>
    ),
    enableSorting: false,
    cell({ getValue }) {
      const percentage = getValue();
      return isNaN(percentage) ? (
        <p>-</p>
      ) : (
        <div className="flex items-center">
          {percentage === 0 ? (
            <Icon name="Minus" className="text-secondary" />
          ) : percentage > 0 ? (
            <Icon name="TriangleUp" className="text-blue-primary" />
          ) : (
            <Icon name="TriangleDown" className="text-red-primary" />
          )}
          <p
            className={
              percentage === 0
                ? 'text-secondary'
                : percentage > 0
                ? 'text-blue-primary'
                : 'text-red-primary'
            }
          >
            {parseFloat(Math.abs(percentage).toFixed(1))}%
          </p>
        </div>
      );
    },
  }),
];
interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueRank: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const issues = useMemo(() => ISSUES(t), [t]);
  const [limit, setLimit] = useState(5);
  const [currentIssueStatusList, setCurrentIssueStatusList] = useState(issues);

  const { data } = useIssueSearch(projectId, {
    sort: { feedbackCount: 'DESC' } as any,
    limit,
    query: { statuses: currentIssueStatusList.map((v) => v.key) },
  });

  const enabled = (data?.items ?? []).length > 0;

  const { data: currentData } = useOAIQuery({
    path: '/api/statistics/feedback-issue',
    variables: {
      from: dayjs().subtract(7, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(1, 'day').endOf('day').toISOString(),
      interval: 'day',
      issueIds: (data?.items.map((issue) => issue.id) ?? []).join(','),
    },
    queryOptions: {
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  const { data: previousData } = useOAIQuery({
    path: '/api/statistics/feedback-issue',
    variables: {
      from: dayjs().subtract(14, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(8, 'day').endOf('day').toISOString(),
      interval: 'day',
      issueIds: (data?.items.map((issue) => issue.id) ?? []).join(','),
    },
    queryOptions: {
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  const newData = useMemo(() => {
    if (!data || !currentData || !previousData) return [];

    return data.items.map((item, i) => {
      const thisWeekCount =
        currentData.issues
          .find((v) => v.name === item.name)
          ?.statistics.reduce((acc, cur) => acc + cur.feedbackCount, 0) ?? 0;

      const lastWeekCount =
        previousData.issues
          .find((v) => v.name === item.name)
          ?.statistics.reduce((acc, cur) => acc + cur.feedbackCount, 0) ?? 0;

      return {
        id: item.id,
        no: i + 1,
        count: item.feedbackCount,
        name: item.name,
        status: ISSUES(t).find((v) => v.key === item.status)?.name ?? '',
        growth: ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100,
      };
    });
  }, [data, currentData, previousData, t]);

  return (
    <DashboardTable
      title={t('chart.issue-rank.title')}
      description={t('chart.issue-rank.description')}
      columns={columns(t)}
      data={newData}
      select={{
        options: [
          { name: '5', key: 5 },
          { name: '10', key: 10 },
          { name: '15', key: 15 },
          { name: '20', key: 20 },
        ],
        defaultValue: { name: '5', key: 5 },
        onChange: (v) => setLimit(v?.key),
      }}
      filterContent={
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex justify-between">
            <h1 className="font-16-bold">
              {t('popover.select-issue-status.issue-status')}{' '}
              <span>
                {currentIssueStatusList.length}
                <span className="text-tertiary">/5</span>
              </span>
            </h1>
            <PopoverCloseButton />
          </div>
          <ul>
            {issues.map((issue) => (
              <li key={issue.key} className="py-1">
                <label className="flex cursor-pointer items-center gap-2 py-1">
                  <input
                    className="checkbox checkbox-sm"
                    type="checkbox"
                    checked={currentIssueStatusList.some(
                      ({ key }) => key === issue.key,
                    )}
                    onChange={(e) =>
                      e.currentTarget.checked
                        ? setCurrentIssueStatusList((prev) => [...prev, issue])
                        : setCurrentIssueStatusList((prev) =>
                            prev.filter((v) => v.key !== issue.key),
                          )
                    }
                  />
                  <p className="font-12-regular flex-1">{issue.name}</p>
                </label>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
};

export default IssueRank;
