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
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useThrottle } from 'react-use';

import { Badge, Icon, toast } from '@ufb/ui';

import { getDayCount, SimpleLineChart, useOAIQuery } from '@/shared';
import { useIssueSearch } from '@/entities/issue';

import { useLineChartData } from '../lib';

import client from '@/libs/client';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueFeedbackLineChart: React.FC<IProps> = ({ from, projectId, to }) => {
  const { t } = useTranslation();

  const [showInput, setShowInput] = useState(false);

  const [searchName, setSearchName] = useState('');
  const throttledSearchName = useThrottle(searchName, 1000);
  const [currentIssues, setCurrentIssues] = useState<
    { id: number; name: string }[]
  >([]);

  const { data: searchedIssues } = useIssueSearch(
    projectId,
    {
      query: { name: throttledSearchName },
      page: 0,
      limit: 1000,
      sort: { feedbackCount: 'desc' } as any,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  );

  const { data } = useOAIQuery({
    path: '/api/admin/statistics/feedback-issue',
    variables: {
      startDate: dayjs(from).startOf('day').format('YYYY-MM-DD'),
      endDate: dayjs(to).endOf('day').format('YYYY-MM-DD'),
      issueIds: (currentIssues.map((issue) => issue.id) ?? []).join(','),
      interval: getDayCount(from, to) > 50 ? 'week' : 'day',
    },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  useEffect(() => {
    client
      .post({
        path: '/api/admin/projects/{projectId}/issues/search',
        body: { sort: { feedbackCount: 'DESC' } as any, limit: 5 },
        pathParams: { projectId },
      })
      .then(({ data }) => setCurrentIssues(data?.items ?? []));
  }, []);

  const { chartData, dataKeys } = useLineChartData(
    from,
    to,
    currentIssues,
    data?.issues.map((v) => ({
      id: v.id,
      statistics: v.statistics.map(({ startDate, endDate, feedbackCount }) => ({
        startDate,
        endDate,
        count: feedbackCount,
      })),
    })),
  );

  const handleIssueCheck = (issue: { id: number; name: string }) => {
    if (currentIssues.length === 5) {
      toast.negative({ title: t('popover.select-issue.max-issue-count') });
      return;
    }
    setCurrentIssues((prev) => [...prev, issue]);
    setSearchName('');
  };
  const handleIssueUncheck = (issue: { id: number; name: string }) => {
    setCurrentIssues((prev) => prev.filter((v) => v.id !== issue.id));
  };

  return (
    <SimpleLineChart
      title={t('chart.issue-comparison.title')}
      description={`${t('chart.issue-comparison.description')} (${dayjs(
        from,
      ).format('YYYY/MM/DD')} - ${dayjs(to).format('YYYY/MM/DD')})`}
      height={400}
      dataKeys={dataKeys}
      data={chartData}
      showLegend
      filterContent={
        <>
          <div className="border-b-fill-tertiary flex flex-wrap gap-2 border-b-[1px] px-3 py-2">
            {currentIssues.map((v) => (
              <Badge key={v.id} type="tertiary">
                <span className="font-12-regular">{v.name}</span>
                <Icon
                  className="ml-1 cursor-pointer"
                  name="Close"
                  size={12}
                  onClick={() => handleIssueUncheck(v)}
                />
              </Badge>
            ))}
            {showInput ?
              <input
                className="input-sm h-[28px] w-[90px]"
                onChange={(e) => setSearchName(e.target.value)}
                value={searchName}
                onBlur={() => setShowInput(false)}
                autoFocus
              />
            : <div
                className="border-fill-tertiary flex cursor-pointer items-center gap-1 rounded-[20px] border px-3 py-1"
                onClick={() => setShowInput(true)}
              >
                <Icon name="Search" size={12} />
                <span className="font-12-regular">
                  {t('popover.select-issue.search-issue')}
                </span>
              </div>
            }
          </div>
          <p className="font-14-regular text-secondary px-3 py-2">
            {t('popover.select-issue.issue-list')}
          </p>
          <ul className="max-h-[150px] overflow-auto">
            {searchedIssues?.items
              .filter(
                (issue) => !currentIssues.some(({ id }) => id === issue.id),
              )
              .map((issue) => (
                <li key={issue.id} className="px-3 py-2">
                  <label
                    className="flex cursor-pointer items-center gap-2 py-1"
                    onClick={() => handleIssueCheck(issue)}
                  >
                    <p className="font-12-regular flex-1">{issue.name}</p>
                  </label>
                </li>
              ))}
          </ul>
        </>
      }
    />
  );
};

export default IssueFeedbackLineChart;
