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
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartContainer from './ChartContainer';

interface IProps {
  title: string;
  description?: string;
  height?: number;
  data: {
    color: string;
    name: string;
    data: { date: string; count: number }[];
  }[];
  from: Date;
  to: Date;
  showLegend?: boolean;
  showFilter?: boolean;
}

const SimpleLineChart: React.FC<IProps> = (props) => {
  const { title, description, height, data, from, to, showLegend, showFilter } =
    props;

  const dataKeys = useMemo(() => data, [data]);

  const [checkedList, setCheckedList] = useState<string[]>([]);

  useEffect(() => {
    setCheckedList(dataKeys.map((v) => v.name));
  }, [dataKeys]);

  const newData = useMemo(() => {
    if (!data) return [];

    const result = [];
    let currentDate = dayjs(from).startOf('day');
    const endDate = dayjs(to).endOf('day');
    while (currentDate.isBefore(endDate)) {
      let total = 0;

      const channelData = data.reduce(
        (acc, cur) => {
          if (!checkedList.includes(cur.name)) return acc;
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
  }, [data, checkedList]);

  return (
    <ChartContainer
      dataKeys={dataKeys}
      description={description}
      title={title}
      chedkedList={checkedList}
      onChecked={(name, checked) => {
        if (checked) {
          setCheckedList([...checkedList, name]);
        } else {
          setCheckedList(checkedList.filter((v) => v !== name));
        }
      }}
      showLegend={showLegend}
      showFilter={showFilter}
    >
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
    </ChartContainer>
  );
};

export default SimpleLineChart;
