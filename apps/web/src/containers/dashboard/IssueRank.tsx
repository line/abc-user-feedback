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
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Line, LineChart } from 'recharts';

import DashboardTable from '@/components/etc/DashboardTable';
import { useIssueSearch, useOAIQuery } from '@/hooks';

interface IssueTableData {
  no: number;
  name: string;
  count: number;
  growth: number;
  trend: { date: string; value: number }[];
}

const columnHelper = createColumnHelper<IssueTableData>();
const columns = [
  columnHelper.accessor('no', { header: 'No', enableSorting: false }),
  columnHelper.accessor('name', { header: 'Issue' }),
  columnHelper.accessor('count', { header: 'Count' }),
  columnHelper.accessor('growth', {
    header: 'Growth',
    cell({ getValue }) {
      return (
        <p
          className={
            getValue() === 0
              ? 'text-primary'
              : getValue() > 0
              ? 'text-blue-primary'
              : 'text-red-primary'
          }
        >
          {parseFloat(Math.abs(getValue()).toFixed(1))}%
        </p>
      );
    },
  }),
  columnHelper.accessor('trend', {
    header: 'Trend',
    enableSorting: false,
    cell(props) {
      return (
        <LineChart width={100} height={40} data={props.getValue()}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#000000"
            dot={{ r: 0 }}
          />
        </LineChart>
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
  const [limit, setLimit] = useState(5);

  const { data } = useIssueSearch(projectId, {
    sort: { feedbackCount: 'DESC' } as any,
    limit,
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
    queryOptions: { enabled },
  });

  const { data: previousData } = useOAIQuery({
    path: '/api/statistics/feedback-issue',
    variables: {
      from: dayjs().subtract(14, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(8, 'day').endOf('day').toISOString(),
      interval: 'day',
      issueIds: (data?.items.map((issue) => issue.id) ?? []).join(','),
    },
    queryOptions: { enabled },
  });
  const { data: trendData } = useOAIQuery({
    path: '/api/statistics/feedback-issue',
    variables: {
      from: dayjs().subtract(90, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(1, 'day').endOf('day').toISOString(),
      interval: 'week',
      issueIds: (data?.items.map((issue) => issue.id) ?? []).join(','),
    },
    queryOptions: { enabled },
  });

  const newData = useMemo(() => {
    if (!data || !currentData || !previousData || !trendData) return [];

    return data.items.map((item, i) => {
      const thisWeekCount =
        currentData.issues
          .find((v) => v.name === item.name)
          ?.statistics.reduce((acc, cur) => acc + cur.feedbackCount, 0) ?? 0;

      const lastWeekCount =
        previousData.issues
          .find((v) => v.name === item.name)
          ?.statistics.reduce((acc, cur) => acc + cur.feedbackCount, 0) ?? 0;

      const trend =
        trendData.issues
          .find((v) => v.name === item.name)
          ?.statistics.map((v) => ({
            date: v.date,
            value: v.feedbackCount,
          })) ?? [];

      return {
        no: i + 1,
        count: item.feedbackCount,
        name: item.name,
        growth: ((lastWeekCount - thisWeekCount) / lastWeekCount) * 100,
        trend,
      };
    });
  }, [data, currentData, previousData, trendData]);

  return (
    <DashboardTable
      title="이슈 순위"
      columns={columns}
      data={newData}
      select={{
        options: [
          { name: '5개', key: 5 },
          { name: '10개', key: 10 },
          { name: '15개', key: 15 },
          { name: '20개', key: 20 },
        ],
        defaultValue: { name: '5개', key: 5 },
        onChange: (v) => {
          setLimit(v?.key);
        },
      }}
    />
  );
};

export default IssueRank;
