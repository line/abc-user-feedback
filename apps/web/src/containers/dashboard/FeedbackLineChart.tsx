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
import { useTranslation } from 'react-i18next';

import { PopoverCloseButton } from '@ufb/ui';

import { SimpleLineChart } from '@/components/charts';
import { useLineChartData, useOAIQuery } from '@/hooks';

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

  const { t } = useTranslation();

  const [currentChannels, setCurrentChannels] = useState(channels.slice(0, 5));
  const dayCount = useMemo(() => dayjs(to).diff(from, 'day') + 1, [from, to]);

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
  const { chartData, dataKeys } = useLineChartData(
    from,
    to,
    currentChannels,
    data?.channels ?? [],
  );
  console.log('data: ', data);

  return (
    <SimpleLineChart
      title={t('chart.total-feedback-trend.title')}
      description={`${t('chart.total-feedback-trend.description')} (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      height={400}
      dataKeys={dataKeys}
      data={chartData}
      filterContent={
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex justify-between">
            <h1 className="font-16-bold">
              Channel{' '}
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
