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
import { useMemo } from 'react';
import {
  Cell,
  Label,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import type { PayloadItem } from '@/shared';

interface Data {
  name: string;
  value: number;
  color?: string;
  [key: string]: unknown;
}

interface IProps {
  height?: number;
  data: Data[];
  onClick?: (name?: string) => void;
}

const PieChart: React.FC<IProps> = (props) => {
  const { data, height, onClick } = props;

  const total = useMemo(
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data],
  );

  return (
    <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
      <RechartPieChart width={500} height={300}>
        <Pie data={data} dataKey="value" innerRadius={95} strokeWidth={0}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              onClick={() => onClick?.(entry.name)}
              className="focus:outline-none"
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-neutral-primary text-3xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 24}
                      className="fill-neutral-secondary"
                    >
                      Total Issues
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <Tooltip
          cursor={{ fill: 'var(--bg-neutral-tertiary)' }}
          content={({ payload }) => (
            <div className="bg-neutral-primary border-neutral-tertiary max-w-[240px] rounded border px-4 py-3 shadow-lg">
              {payload.map(({ payload, value }: PayloadItem, i) => (
                <div
                  key={i}
                  className="text-neutral-secondary text-small-normal flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        backgroundColor: payload.fill,
                      }}
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                    />
                    <p className="text-small-normal break-all">
                      {payload.name}
                    </p>
                  </div>
                  <p>{value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        />
      </RechartPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
