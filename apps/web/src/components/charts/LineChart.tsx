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
import {
  Line,
  LineChart as LineRechart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface IProps {
  dataKeys: { color: string; name: string }[];
  height?: number;
  data: any[];
}

const LineChart: React.FC<IProps> = ({ dataKeys, height, data }) => {
  return (
    <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
      <LineRechart width={500} height={300} data={data}>
        <Tooltip
          contentStyle={{ background: 'var(--background-color-primary)' }}
          formatter={(value) => value.toLocaleString()}
        />
        <XAxis dataKey="date" interval="equidistantPreserveStart" />
        <YAxis tickFormatter={(v) => v.toLocaleString()} />
        {dataKeys.map(({ color, name }) => (
          <Line
            key={name}
            type="linear"
            dataKey={name}
            stroke={color}
            activeDot={{ r: 8 }}
            dot={{ fill: color }}
          />
        ))}
      </LineRechart>
    </ResponsiveContainer>
  );
};

export default LineChart;
