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
import dayjs from 'dayjs';

import { PopoverCloseButton } from '@ufb/ui';

import { SimpleLineChart } from '@/components/charts';
import { CHART_COLORS } from '@/constants/chart-colors';
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
  return <FeedbackLineChart from={from} to={to} channels={data.items} />;
};

interface IFeedbackLineChartProps {
  channels: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
  from: Date;
  to: Date;
}

const FeedbackLineChart: React.FC<IFeedbackLineChartProps> = (props) => {
  const { channels, from, to } = props;

  const [currentChannels, setCurrentChannels] = useState(channels.slice(0, 5));

  const dayCount = useMemo(() => dayjs(to).diff(from, 'day'), [from, to]);

  const { data } = useOAIQuery({
    path: '/api/statistics/feedback',
    variables: {
      from: dayjs(from).startOf('day').toISOString(),
      to: dayjs(to).endOf('day').toISOString(),
      channelIds: currentChannels.map(({ id }) => id).join(','),
      interval: dayCount > 50 ? 'week' : 'day',
    },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  const dataKeys = useMemo(() => {
    return (
      channels.map((v, i) => ({
        color: CHART_COLORS[i] ?? getDarkColor(),
        name: v.name,
      })) ?? []
    );
  }, [channels]);

  const newData = useMemo(() => {
    if (!data) return [];

    const result = [];
    let currentDate = dayjs(to).endOf('day');
    const startDate = dayjs(from).startOf('day');

    while (currentDate.isAfter(startDate)) {
      const prevDate = currentDate.subtract(dayCount > 50 ? 7 : 1, 'day');

      const channelData = channels.reduce(
        (acc, cur) => {
          const count =
            data.channels
              .find((v) => v.id === cur.id)
              ?.statistics.find(
                (v) => v.date === currentDate.format('YYYY-MM-DD'),
              )?.count ?? 0;
          return { ...acc, [cur.name]: count };
        },
        {
          date:
            dayCount > 50
              ? `${prevDate.format('MM/DD')} - ${currentDate.format('MM/DD')}`
              : currentDate.format('MM/DD'),
        },
      );
      result.push(channelData);

      currentDate = prevDate;
    }
    return result.reverse();
  }, [data, dayCount, channels]);

  return (
    <SimpleLineChart
      title="전체 피드백 추이"
      description={`특정 기간의 피드백 수집 추이를 나타냅니다. (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      height={400}
      dataKeys={dataKeys}
      data={newData}
      filterContent={
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex justify-between">
            <h1 className="font-16-bold">
              채널{' '}
              <span>
                {currentChannels.length}
                <span className="text-tertiary">/{channels.length}</span>
              </span>
            </h1>
            <PopoverCloseButton />
          </div>
          <ul>
            {channels.map((channel) => (
              <li key={channel.id} className="py-1">
                <label className="flex cursor-pointer items-center gap-2 py-1">
                  <input
                    className="checkbox checkbox-sm"
                    type="checkbox"
                    checked={currentChannels.some(
                      ({ id }) => id === channel.id,
                    )}
                    onChange={(e) =>
                      e.currentTarget.checked
                        ? setCurrentChannels((prev) => [...prev, channel])
                        : setCurrentChannels((prev) =>
                            prev.filter((v) => v.id !== channel.id),
                          )
                    }
                  />
                  <p className="font-12-regular flex-1">{channel.name}</p>
                </label>
              </li>
            ))}
          </ul>
        </div>
      }
      showLegend
    />
  );
};

export default FeedbackLineChartWrapper;
