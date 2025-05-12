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
  ISSUES,
  Path,
  SimpleBarChart,
  SimplePieChart,
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

  const { data } = useOAIQuery({
    path: '/api/admin/statistics/issue/count-by-status',
    variables: { projectId },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  return (
    <>
      {type === 'pie' && (
        <SimplePieChart
          data={ISSUES(t).map(({ key, name }) => ({
            name,
            value: +(
              data?.statistics.find((v) => v.status === key)?.count ?? 0
            ),
            color: COLOR_MAP[key],
          }))}
          title={t('chart.issue-status-count.title')}
          description={t('chart.issue-status-count.description')}
          height={415}
          filterContent={
            <ToggleGroup type="single" value={type} onValueChange={setType}>
              <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
              <ToggleGroupItem value="pie">Pie</ToggleGroupItem>
            </ToggleGroup>
          }
          onClick={(data) => {
            if (!data) return;
            const issue = ISSUES(t).find((v) => v.name === data.name);
            window.open(
              Path.ISSUE.replace('[projectId]', projectId.toString()) +
                '?queries=' +
                JSON.stringify([
                  { key: 'status', value: issue?.key, condition: 'IS' },
                ]),
              '_blank',
            );
          }}
        />
      )}
      {type === 'bar' && (
        <SimpleBarChart
          data={ISSUES(t).map(({ key, name }) => ({
            name,
            value: +(
              data?.statistics.find((v) => v.status === key)?.count ?? 0
            ),
            color: COLOR_MAP[key],
          }))}
          title={t('chart.issue-status-count.title')}
          description={t('chart.issue-status-count.description')}
          height={415}
          filterContent={
            <ToggleGroup type="single" value={type} onValueChange={setType}>
              <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
              <ToggleGroupItem value="pie">Pie</ToggleGroupItem>
            </ToggleGroup>
          }
          onClick={(data) => {
            if (!data) return;
            const issue = ISSUES(t).find((v) => v.name === data.name);
            window.open(
              Path.ISSUE.replace('[projectId]', projectId.toString()) +
                '?queries=' +
                JSON.stringify([
                  { key: 'status', value: issue?.key, condition: 'IS' },
                ]),
              '_blank',
            );
          }}
        />
      )}
    </>
  );
  // return (
  //   <SimpleBarChart
  //     data={ISSUES(t).map(({ key, name }) => ({
  //       name,
  //       value: +(data?.statistics.find((v) => v.status === key)?.count ?? 0),
  //     }))}
  //     title={t('chart.issue-status-count.title')}
  //     description={t('chart.issue-status-count.description')}
  //     height={415}
  //     filterContent={
  //       <ToggleGroup type="single" value={type} onValueChange={setType}>
  //         <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
  //         <ToggleGroupItem value="pie">Pie</ToggleGroupItem>
  //       </ToggleGroup>
  //     }
  //     onClick={(data) => {
  //       if (!data) return;
  //       const issue = ISSUES(t).find((v) => v.name === data.name);
  //       window.open(
  //         Path.ISSUE.replace('[projectId]', projectId.toString()) +
  //           '?queries=' +
  //           JSON.stringify([
  //             { key: 'status', value: issue?.key, condition: 'IS' },
  //           ]),
  //         '_blank',
  //       );
  //     }}
  //   />
  // );
};

export default IssueBarChart;
