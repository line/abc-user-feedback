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
  CartesianGrid,
  Cell,
  BarChart as RechartBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { PayloadItem } from '@/shared/types';

interface Data {
  name: string;
  value: number;
  color: string;
}

interface IProps {
  height?: number;
  data: Data[];
  onClick?: (name?: string) => void;
}

const BarChart: React.FC<IProps> = (props) => {
  const { data, height, onClick } = props;
  return (
    <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
      <RechartBarChart
        width={500}
        height={300}
        data={data}
        margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
        barSize={80}
        onClick={(nextState) => onClick?.(nextState.activeLabel)}
      >
        <CartesianGrid
          vertical={false}
          stroke="var(--border-neutral-tertiary)"
        />
        <Tooltip
          cursor={{ fill: 'var(--bg-neutral-tertiary)' }}
          content={({ payload }) => (
            <div className="bg-neutral-primary border-neutral-tertiary max-w-[240px] rounded border px-4 py-3 shadow-lg">
              {payload.map(
                ({ value, payload: itemPayload }: PayloadItem, i) => (
                  <div
                    key={i}
                    className="text-neutral-secondary text-small-normal flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: itemPayload.color,
                        }}
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                      />
                      <p className="text-small-normal break-all">
                        {itemPayload.name}
                      </p>
                    </div>
                    <p>
                      {typeof value === 'number' ?
                        value.toLocaleString()
                      : value}
                    </p>
                  </div>
                ),
              )}
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
      </RechartBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
