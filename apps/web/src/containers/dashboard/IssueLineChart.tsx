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
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { SimpleLineChart } from '@/components/charts';
import { useDayCount, useLineChartData, useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueLineChart: React.FC<IProps> = ({ from, projectId, to }) => {
  const { t } = useTranslation();

  const dayCount = useDayCount(from, to);

  const { data } = useOAIQuery({
    path: '/api/statistics/issue/count-by-date',
    variables: {
      projectId,
      from: dayjs(from).startOf('day').toISOString(),
      to: dayjs(to).endOf('day').toISOString(),
      interval: dayCount > 50 ? 'week' : 'day',
    },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  const { chartData, dataKeys } = useLineChartData(
    from,
    to,
    [{ id: 1, name: t('chart.total-issue-trend.issue-count') }],
    [{ id: 1, statistics: data?.statistics ?? [] }],
  );

  return (
    <SimpleLineChart
      title={t('chart.total-issue-trend.title')}
      description={`${t('chart.total-issue-trend.description')} (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      height={400}
      data={chartData}
      dataKeys={dataKeys}
      noColor
    />
  );
};

export default IssueLineChart;
