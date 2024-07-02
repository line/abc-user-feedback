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
import { useTranslation } from 'react-i18next';

import { ISSUES, Path, SimpleBarChart } from '@/shared';

import { useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueBarChart: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

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
    <SimpleBarChart
      data={ISSUES(t).map(({ key, name }) => ({
        name,
        value: +(data?.statistics.find((v) => v.status === key)?.count ?? 0),
      }))}
      title={t('chart.issue-status-count.title')}
      description={t('chart.issue-status-count.description')}
      height={400}
      onClick={(data) => {
        if (!data) return;
        const issue = ISSUES(t).find((v) => v.name === data.name);
        window.open(
          Path.ISSUE.replace('[projectId]', projectId.toString()) +
            '?status=' +
            issue?.key,
          '_blank',
        );
      }}
    />
  );
};

export default IssueBarChart;
