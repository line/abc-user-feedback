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
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { randLightColor } from '@/utils/rand-light-color';

interface IProps {
  data: any[];
}

const SimpleLineChart: React.FC<IProps> = (props) => {
  const { data } = props;
  const dataKeys = useMemo(() => {
    if (!data[0]) return [];
    return Object.keys(data[0]).filter((v) => v !== 'date');
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <Tooltip />
        <XAxis dataKey="date" />
        <YAxis />
        {dataKeys.map((v) => (
          <Line
            key={v}
            type="monotone"
            dataKey={v}
            stroke={randLightColor()}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleLineChart;
