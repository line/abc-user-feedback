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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartCard from './chart-card';

interface Data {
  name: string;
  value: number;
}

interface IProps {
  title: string;
  description: string;
  height?: number;
  data: Data[];
  showLegend?: boolean;
  onClick?: (data?: Data) => void;
}

const SimpleBarChart: React.FC<IProps> = (props) => {
  const { data, title, description, height, showLegend, onClick } = props;
  return (
    <ChartCard description={description} title={title} showLegend={showLegend}>
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
          barSize={80}
          onClick={(e: { activePayload?: { payload: Data }[] }) =>
            onClick?.(e.activePayload?.[0]?.payload)
          }
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border-neutral-tertiary)"
          />
          <Tooltip
            formatter={(value) => value.toLocaleString()}
            cursor={{ fill: 'var(--fg-neutral-tertiary)' }}
            content={({ payload }) => (
              <div className="bg-neutral-primary border-neutral-tertiary max-w-[240px] rounded border px-4 py-3 shadow-lg">
                {payload?.map(({ color, value, payload }, i) => (
                  <div
                    key={i}
                    className="text-neutral-secondary text-small-normal flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{ background: color }}
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                      />
                      <p className="text-small-normal break-all">
                        {(payload as { name: string | undefined }).name}
                      </p>
                    </div>
                    <p>{value?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          />
          <XAxis
            dataKey="name"
            className="text-neutral-tertiary text-small-normal"
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: string) => v.toLocaleString()}
            className="text-neutral-tertiary text-small-normal"
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="value" fill="var(--sky400)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SimpleBarChart;
