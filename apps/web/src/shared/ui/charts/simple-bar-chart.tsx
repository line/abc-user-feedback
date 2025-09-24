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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartCard from './chart-card';

interface Data {
  name: string;
  value: number;
  color: string;
}

interface IProps {
  title: string;
  description: string;
  height?: number;
  data: Data[];
  showLegend?: boolean;
  onClick?: (data?: Data) => void;
  filterContent?: React.ReactNode;
}

const SimpleBarChart: React.FC<IProps> = (props) => {
  const {
    data,
    title,
    description,
    height,
    showLegend,
    onClick,
    filterContent,
  } = props;
  return (
    <ChartCard
      description={description}
      title={title}
      showLegend={showLegend}
      filterContent={filterContent}
    >
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
          barSize={80}
          onClick={(nextState) => {
            if (
              'activePayload' in nextState &&
              Array.isArray(nextState.activePayload) &&
              nextState.activePayload.length > 0
            ) {
              const payload = nextState.activePayload[0] as { payload: Data };
              onClick?.(payload.payload);
            }
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border-neutral-tertiary)"
          />
          <Tooltip
            formatter={(value: unknown) => {
              if (typeof value === 'number') {
                return value.toLocaleString();
              }
              return String(value);
            }}
            cursor={{ fill: 'var(--bg-neutral-tertiary)' }}
            content={({ payload }) => (
              <div className="bg-neutral-primary border-neutral-tertiary max-w-[240px] rounded border px-4 py-3 shadow-lg">
                {payload.map(({ value, payload: itemPayload }, i) => (
                  <div
                    key={i}
                    className="text-neutral-secondary text-small-normal flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: (itemPayload as { color: string })
                            .color,
                        }}
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                      />
                      <p className="text-small-normal break-all">
                        {(itemPayload as { name: string | undefined }).name}
                      </p>
                    </div>
                    <p>
                      {typeof value === 'number' ?
                        value.toLocaleString()
                      : value}
                    </p>
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
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SimpleBarChart;
