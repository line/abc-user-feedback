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
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

import {
  ChartCard,
  Legend,
  LineChart,
  useAllChannels,
  useOAIQuery,
} from '@/shared';
import type { Channel } from '@/entities/channel';

import { useLineChartData } from '../lib';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}
const FeedbackLineChartWrapper: React.FC<IProps> = (props) => {
  const { from, projectId, to } = props;
  const { data: channels } = useAllChannels(projectId);

  const { t } = useTranslation();

  const [currentChannels, setCurrentChannels] = useState<Channel[]>([]);
  const dayCount = useMemo(() => dayjs(to).diff(from, 'day') + 1, [from, to]);

  useEffect(() => {
    setCurrentChannels(channels?.items.slice(0, 5) ?? []);
  }, [channels]);

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
    <ChartCard
      title={t('chart.feedback-trend.title')}
      description={`${t('chart.feedback-trend.description')} (${dayjs(
        from,
      ).format('YYYY/MM/DD')} - ${dayjs(to).format('YYYY/MM/DD')})`}
      extra={
        <div className="flex gap-3">
          <Legend dataKeys={dataKeys} />
          <ChannelSelectCombobox
            currentChannels={currentChannels}
            setCurrentChannels={setCurrentChannels}
            channels={channels}
          />
        </div>
      }
    >
      <LineChart height={400} dataKeys={dataKeys} data={chartData} />
    </ChartCard>
  );
};

interface ChannelSelectComboboxProps {
  channels?: { items: Channel[] };
  currentChannels: Channel[];
  setCurrentChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
}

const ChannelSelectCombobox = (props: ChannelSelectComboboxProps) => {
  const { channels, currentChannels, setCurrentChannels } = props;
  return (
    <Combobox>
      <ComboboxTrigger>
        <Icon name="RiFilter3Line" />
        Filter
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList maxHeight="200px">
          {channels?.items.map((channel) => (
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
                  : prev.length === 5 ? [...prev.slice(1), channel]
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
  );
};

export default FeedbackLineChartWrapper;
