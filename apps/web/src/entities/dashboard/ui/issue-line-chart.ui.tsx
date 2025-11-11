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
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { ChartCard, getDayCount, LineChart, useOAIQuery } from '@/shared';

import { useLineChartData } from '../lib';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueLineChart: React.FC<IProps> = ({ from, projectId, to }) => {
  const { t } = useTranslation();

  const { data } = useOAIQuery({
    path: '/api/admin/statistics/issue/count-by-date',
    variables: {
      projectId,
      startDate: dayjs(from).startOf('day').format('YYYY-MM-DD'),
      endDate: dayjs(to).endOf('day').format('YYYY-MM-DD'),
      interval: getDayCount(from, to) > 50 ? 'week' : 'day',
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
    [{ id: 1, name: '' }],
    [{ id: 1, statistics: data?.statistics ?? [] }],
  );

  return (
    <ChartCard
      title={t('chart.issue-trend.title')}
      description={`${t('chart.issue-trend.description')} (${dayjs(from).format(
        'YYYY/MM/DD',
      )} - ${dayjs(to).format('YYYY/MM/DD')})`}
    >
      <LineChart height={400} data={chartData} dataKeys={dataKeys} />
    </ChartCard>
  );
};

export default IssueLineChart;
