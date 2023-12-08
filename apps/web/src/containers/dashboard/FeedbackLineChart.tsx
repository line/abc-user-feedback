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

const FeedbackLineChartWrapper: React.FC<IProps> = ({
  from,
  projectId,
  to,
}) => {
  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}/channels',
    variables: { projectId },
  });

  if (!data) return null;
  return (
    <FeedbackLineChart
      from={from}
      to={to}
      channelIds={data.items.map((v) => v.id)}
    />
  );
};

interface IFeedbackLineChartProps {
  channelIds: number[];
  from: Date;
  to: Date;
}

const FeedbackLineChart: React.FC<IFeedbackLineChartProps> = ({
  channelIds,
  from,
  to,
}) => {
  const { data } = useOAIQuery({
    path: '/api/statistics/feedback',
    variables: {
      from: dayjs(from).startOf('day').toISOString(),
      to: dayjs(to).endOf('day').toISOString(),
      channelIds: channelIds.join(','),
      interval: 'day',
    },
  });

  return (
    <SimpleLineChart
      title="전체 피드백 추이"
      description={`특정 기간의 피드백 수집 추이를 나타냅니다. (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      height={400}
      data={
        data?.channels.map((v) => ({
          color: getDarkColor(),
          name: v.name,
          data: v.statistics.map((v) => ({ date: v.date, count: v.count })),
        })) ?? []
      }
      from={from}
      to={to}
      showLegend
      showFilter
    />
  );
};

export default FeedbackLineChartWrapper;
