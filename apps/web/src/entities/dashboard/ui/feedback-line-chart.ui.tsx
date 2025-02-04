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

import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

import { SimpleLineChart, useOAIQuery } from '@/shared';

import { useLineChartData } from '../lib';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const FeedbackLineChartWrapper: React.FC<IProps> = (props) => {
  const { from, projectId, to } = props;

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  if (!data) return <></>;
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
    path: '/api/admin/statistics/feedback',
    variables: {
      startDate: dayjs(from).startOf('day').format('YYYY-MM-DD'),
      endDate: dayjs(to).endOf('day').format('YYYY-MM-DD'),
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

  return (
    <SimpleLineChart
      title={t('chart.feedback-trend.title')}
      description={`${t('chart.feedback-trend.description')} (${dayjs(
        from,
      ).format('YYYY/MM/DD')} - ${dayjs(to).format('YYYY/MM/DD')})`}
      height={400}
      dataKeys={dataKeys}
      data={chartData}
      filterContent={
        <Combobox>
          <ComboboxTrigger>
            <Icon name="RiFilter3Line" />
            Filter
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxList>
              {channels.map((channel) => (
                <ComboboxSelectItem
                  key={channel.id}
                  value={String(channel.id)}
                  checked={currentChannels.some(({ id }) => id === channel.id)}
                  onSelect={() => {
                    const isChecked = currentChannels.some(
                      ({ id }) => id === channel.id,
                    );
                    setCurrentChannels((prev) =>
                      isChecked ? prev.filter(({ id }) => id !== channel.id)
                      : prev.length === 5 ? prev
                      : [...prev, channel],
                    );
                  }}
                >
                  {channel.name}
                </ComboboxSelectItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      }
      showLegend
    />
  );
};

export default FeedbackLineChartWrapper;
