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
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { ToggleGroup, ToggleGroupItem } from '@ufb/react';

import {
  BarChart,
  ChartCard,
  ISSUES,
  Path,
  PieChart,
  useOAIQuery,
} from '@/shared';
import type { IssueStatus } from '@/entities/issue';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}
const COLOR_MAP: Record<IssueStatus, string> = {
  INIT: '#EAB308',
  IN_PROGRESS: '#0EA5E9',
  ON_REVIEW: '#22C55E',
  PENDING: '#6366F1',
  RESOLVED: '#71717A',
};

const IssueBarChart: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const [type, setType] = useState('bar');

  const { data: statisticsData } = useOAIQuery({
    path: '/api/admin/statistics/issue/count-by-status',
    variables: { projectId },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });
  const onChangeType = (type: 'bar' | 'pie') => (v: string) => {
    setType(v === '' ? type : v);
  };
  const data = ISSUES(t).map(({ key, name }) => ({
    name,
    value: +(
      statisticsData?.statistics.find((v) => v.status === key)?.count ?? 0
    ),
    color: COLOR_MAP[key],
  }));
  const onClickIssue = (name: string | undefined) => {
    if (!name) return;
    const issue = ISSUES(t).find((v) => v.name === name);
    window.open(
      Path.ISSUE.replace('[projectId]', projectId.toString()) +
        '?queries=' +
        JSON.stringify([{ key: 'status', value: issue?.key, condition: 'IS' }]),
      '_blank',
    );
  };

  return (
    <ChartCard
      title={t('chart.issue-status-count.title')}
      description={t('chart.issue-status-count.description')}
      extra={
        <ToggleGroup
          type="single"
          value={type}
          onValueChange={onChangeType('pie')}
        >
          <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
          <ToggleGroupItem value="pie">Pie</ToggleGroupItem>
        </ToggleGroup>
      }
    >
      {type === 'pie' && (
        <div className="flex items-center">
          <PieChart data={data} onClick={onClickIssue} height={415} />
          <IssueLegend data={data} />
        </div>
      )}
      {type === 'bar' && (
        <BarChart data={data} height={415} onClick={onClickIssue} />
      )}
    </ChartCard>
  );
};
interface IssueLegendProps {
  data?: { name: string; value: number; color: string }[];
}

const IssueLegend: React.FC<IssueLegendProps> = ({ data }) => {
  return (
    <div className="w-full">
      <table className="table">
        <thead>
          <tr>
            <th className="table-head !text-large-strong text-neutral-primary h-auto">
              Status
            </th>
            <th className="table-head !text-large-strong text-neutral-primary h-auto">
              Issue Count
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={`item-${index}`}>
              <td className="!text-large-normal text-neutral-primary table-cell py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              </td>
              <td className="!text-large-normal text-neutral-primary table-cell py-2">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueBarChart;
