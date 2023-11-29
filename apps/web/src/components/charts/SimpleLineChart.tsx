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
import { useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Icon } from '@ufb/ui';

import { DescriptionTooltip } from '../etc';

interface IProps {
  title?: string;
  description?: string;
  height?: number;
  data: {
    color: string;
    name: string;
    data: { date: string; count: number }[];
  }[];
  from: Date;
  to: Date;
}

const SimpleLineChart: React.FC<IProps> = (props) => {
  const { title, description, height } = props;
  const { data, from, to } = props;

  const dataKeys = useMemo(
    () => [{ name: 'total', color: 'black' }, ...data],
    [data],
  );

  const newData = useMemo(() => {
    if (!data) return [];

    const result = [];
    let currentDate = dayjs(from).startOf('day');
    const endDate = dayjs(to).endOf('day');
    while (currentDate.isBefore(endDate)) {
      let total = 0;

      const channelData = data.reduce(
        (acc, cur) => {
          const count =
            cur.data.find((v) => v.date === currentDate.format('YYYY-MM-DD'))
              ?.count ?? 0;
          total += count;
          return { ...acc, [cur.name]: count };
        },
        { date: currentDate.format('YYYY-MM-DD') },
      );

      result.push({ ...channelData, total });
      currentDate = currentDate.add(1, 'day');
    }
    return result;
  }, [data]);

  return (
    <div className="border-fill-tertiary rounded border p-4">
      <div className="flex h-[72px] items-center justify-between">
        <div>
          <span className="font-20-bold">{title}</span>
          {description && <DescriptionTooltip description={description} />}
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2">
            {dataKeys.map((v, i) => (
              <div className="flex items-center gap-2" key={i}>
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <p>{v.name}</p>
              </div>
            ))}
          </div>
          <button className="icon-btn icon-btn-secondary icon-btn-sm">
            <Icon name="FilterCircleStroke" />
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <LineChart width={500} height={300} data={newData}>
          <Tooltip />
          <XAxis dataKey="date" />
          <YAxis />
          {dataKeys.map(({ color, name }) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={color}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;
