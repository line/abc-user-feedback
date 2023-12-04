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

import { SimpleLineChart } from '@/components/charts';
import { useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueLineChart: React.FC<IProps> = ({ from, projectId, to }) => {
  const { data } = useOAIQuery({
    path: '/api/statistics/issue/count-by-date',
    variables: {
      from: dayjs(from).startOf('day').toISOString(),
      to: dayjs(to).endOf('day').toISOString(),
      projectId,
      interval: 'day',
    },
  });

  return (
    <SimpleLineChart
      title="전체 이슈 추이"
      description={`특정 기간의 이슈 생성 추이를 나타냅니다 (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      height={400}
      data={
        data
          ? [{ color: 'black', name: '피드백 수', data: data.statistics }]
          : []
      }
      from={from}
      to={to}
    />
  );
};

export default IssueLineChart;
