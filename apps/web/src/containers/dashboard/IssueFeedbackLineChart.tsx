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
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useThrottle } from 'react-use';

import { SimpleLineChart } from '@/components/charts';
import { CHART_COLORS } from '@/constants/chart-colors';
import { useIssueSearch, useOAIQuery } from '@/hooks';
import client from '@/libs/client';

const getDarkColor = () => {
  return (
    '#' +
    Array.from({ length: 6 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
  );
};

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueFeedbackLineChart: React.FC<IProps> = ({ from, projectId, to }) => {
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
      limit: 10,
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
    path: '/api/statistics/feedback-issue',
    variables: {
      from: dayjs(from).startOf('day').toISOString(),
      to: dayjs(to).endOf('day').toISOString(),
      issueIds: (currentIssues.map((issue) => issue.id) ?? []).join(','),
      interval: 'day',
    },
    queryOptions: {
      enabled: currentIssues.length > 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  useEffect(() => {
    client
      .post({
        path: '/api/projects/{projectId}/issues/search',
        body: { sort: { feedbackCount: 'DESC' } as any, limit: 5 },
        pathParams: { projectId },
      })
      .then(({ data }) => setCurrentIssues(data?.items ?? []));
  }, []);

  const dataKeys = useMemo(() => {
    return (
      data?.issues.map((v, i) => ({
        color: CHART_COLORS[i] ?? getDarkColor(),
        name: v.name,
      })) ?? []
    );
  }, [data]);

  const newData = useMemo(() => {
    if (!data) return [];

    const result = [];
    let currentDate = dayjs(from).startOf('day');
    const endDate = dayjs(to).endOf('day');
    while (currentDate.isBefore(endDate)) {
      let total = 0;

      const channelData = data.issues.reduce(
        (acc, cur) => {
          const count =
            cur.statistics.find(
              (v) => v.date === currentDate.format('YYYY-MM-DD'),
            )?.feedbackCount ?? 0;
          total += count;
          return { ...acc, [cur.name]: count };
        },
        { date: currentDate.format('MM/DD') },
      );

      result.push({ ...channelData, total });
      currentDate = currentDate.add(1, 'day');
    }
    return result;
  }, [data]);
  console.log('newData: ', newData);

  return (
    <SimpleLineChart
      title="전체 이슈 추이"
      description={`특정 기간의 이슈 생성 추이를 나타냅니다 (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      height={400}
      dataKeys={dataKeys}
      data={newData}
      showLegend
      filterContent={
        <>
          <input
            className="border-b-fill-tertiary w-full border-b-[1px] px-3 py-2"
            onChange={(e) => setSearchName(e.target.value)}
            value={searchName}
          />
          <p className="font-14-regular text-secondary px-3 py-2">이슈 목록</p>
          <ul className="max-h-[150px] overflow-auto">
            {searchedIssues?.items.map((issue) => (
              <li key={issue.id} className="px-3 py-2">
                <label className="flex cursor-pointer items-center gap-2 py-1">
                  <input
                    className="checkbox checkbox-sm"
                    type="checkbox"
                    checked={currentIssues.some(({ id }) => id === issue.id)}
                    onChange={(e) =>
                      e.currentTarget.checked
                        ? setCurrentIssues((prev) => [...prev, issue])
                        : setCurrentIssues((prev) =>
                            prev.filter((v) => v.id !== issue.id),
                          )
                    }
                  />
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
