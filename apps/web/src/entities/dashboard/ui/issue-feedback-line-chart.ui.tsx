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
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useThrottle } from 'react-use';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  Icon,
  toast,
} from '@ufb/react';

import {
  client,
  commandFilter,
  getDayCount,
  InfiniteScrollArea,
  SimpleLineChart,
  useOAIQuery,
} from '@/shared';
import type { Issue } from '@/entities/issue';
import { IssueBadge, useIssueSearchInfinite } from '@/entities/issue';

import { useLineChartData } from '../lib';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueFeedbackLineChart: React.FC<IProps> = ({ from, projectId, to }) => {
  const { t } = useTranslation();

  const [searchName, setSearchName] = useState('');
  const throttledSearchName = useThrottle(searchName, 1000);
  const [currentIssues, setCurrentIssues] = useState<Issue[]>([]);

  const { data } = useOAIQuery({
    path: '/api/admin/statistics/feedback-issue',
    variables: {
      startDate: dayjs(from).startOf('day').format('YYYY-MM-DD'),
      endDate: dayjs(to).endOf('day').format('YYYY-MM-DD'),
      issueIds: currentIssues.map((issue) => issue.id).join(','),
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
    void client
      .post({
        path: '/api/admin/projects/{projectId}/issues/search',
        body: { sort: { feedbackCount: 'DESC' }, limit: 5 },
        pathParams: { projectId },
      })
      .then(({ data }) => setCurrentIssues(data?.items ?? []));
  }, [projectId]);

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

  const {
    data: allIssueData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIssueSearchInfinite(Number(projectId), {
    limit: 10,
    queries: [
      { key: 'name', value: throttledSearchName, condition: 'CONTAINS' },
    ],
    sort: { name: 'ASC' },
  });

  const allIssues = useMemo(() => {
    return allIssueData.pages
      .map((v) => v?.items)
      .filter((v) => !!v)
      .flat();
  }, [allIssueData]);

  const handleIssueCheck = (issue: Issue) => {
    if (currentIssues.length === 5) {
      toast.error(t('popover.select-issue.max-issue-count'));
      return;
    }
    setCurrentIssues((prev) => [...prev, issue]);
    setSearchName('');
  };
  const handleIssueUncheck = (issue: Issue) => {
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
        <Combobox>
          <ComboboxTrigger>
            <Icon name="RiFilter3Line" />
            Filter
          </ComboboxTrigger>
          <ComboboxContent options={{ filter: commandFilter }}>
            <ComboboxInput
              onValueChange={(value) => setSearchName(value)}
              value={searchName}
            />
            <ComboboxList maxHeight="200px">
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Selected Issue
                  </span>
                }
              >
                {currentIssues.map((issue) => (
                  <ComboboxItem
                    key={issue.id}
                    onSelect={() => handleIssueUncheck(issue)}
                  >
                    <IssueBadge name={issue.name} status={issue.status} />
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
              {allIssues.length > 0 && (
                <ComboboxGroup
                  heading={
                    <span className="text-neutral-tertiary text-base-normal">
                      Issue List
                    </span>
                  }
                >
                  {allIssues
                    .filter(
                      (v) => !currentIssues.some((issue) => issue.id === v.id),
                    )
                    .map((issue) => (
                      <ComboboxItem
                        key={issue.id}
                        value={issue.name}
                        onSelect={() => handleIssueCheck(issue)}
                      >
                        <IssueBadge name={issue.name} status={issue.status} />
                      </ComboboxItem>
                    ))}
                  <InfiniteScrollArea
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      }
    />
  );
};

export default IssueFeedbackLineChart;
