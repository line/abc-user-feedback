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
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartContainer from './chart-container';

interface IProps {
  title: string;
  description?: string;
  height?: number;
  data: { name: string; value: number }[];
  showLegend?: boolean;
  onClick?: (data?: { name: string; value: number }) => void;
}

const SimpleBarChart: React.FC<IProps> = (props) => {
  const { data, title, description, height, showLegend, onClick } = props;
  return (
    <ChartContainer
      description={description}
      title={title}
      showLegend={showLegend}
    >
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ left: -5, right: 10, top: 10, bottom: 10 }}
          barSize={16}
          onClick={(e) => onClick?.(e.activePayload?.[0].payload)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--fill-color-secondary)"
            vertical={false}
          />
          <Tooltip
            cursor={<Rectangle fill="#5D7BE729" />}
            formatter={(value) => value.toLocaleString()}
            content={({ payload, label }) => (
              <div
                className="bg-tertiary border-fill-secondary max-w-[240px] rounded border px-4 py-3"
                style={{ boxShadow: '0px 4px 8px 0px #0000004D' }}
              >
                <p className="mb-2">{label}</p>
                <p>{payload?.[0]?.value?.toLocaleString()}</p>
              </div>
            )}
          />
          <XAxis
            dataKey="name"
            className="font-10-regular text-secondary"
            tickSize={15}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => v.toLocaleString()}
            className="font-10-regular text-secondary"
            tickSize={15}
            tickLine={false}
          />
          <Bar dataKey="value" fill="#5D7BE7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SimpleBarChart;
