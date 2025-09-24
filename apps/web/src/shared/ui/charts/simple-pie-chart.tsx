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
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ContentType } from 'recharts/types/component/DefaultLegendContent';

import ChartCard from './chart-card';

interface Data {
  name: string;
  value: number;
  color?: string;
  [key: string]: unknown;
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

const SimplePieChart: React.FC<IProps> = (props) => {
  const {
    data,
    title,
    description,
    height,
    showLegend,
    onClick,
    filterContent,
  } = props;
  const total = useMemo(
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data],
  );
  return (
    <ChartCard
      description={description}
      title={title}
      showLegend={showLegend}
      filterContent={filterContent}
    >
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <PieChart width={500} height={300}>
          <Pie data={data} dataKey="value" innerRadius={95} strokeWidth={0}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                onClick={() => onClick?.(entry)}
                className="focus:outline-none"
              />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
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
          <Legend
            content={CustomLegend}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip
            formatter={(value: unknown) => {
              if (typeof value === 'number') {
                return value.toLocaleString();
              }
              return String(value);
            }}
            cursor={{ fill: 'var(--bg-neutral-tertiary)' }}
            content={({ payload }) => {
              return (
                <div className="bg-neutral-primary border-neutral-tertiary max-w-[240px] rounded border px-4 py-3 shadow-lg">
                  {payload.map((item, i) => {
                    const { value, payload: itemPayload } = item as {
                      value: unknown;
                      payload: unknown;
                    };
                    return (
                      <div
                        key={i}
                        className="text-neutral-secondary text-small-normal flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              backgroundColor: (itemPayload as { fill: string })
                                .fill,
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
                          : String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const CustomLegend: ContentType = ({ payload }) => {
  return (
    <div className="w-full">
      <table className="table">
        <thead>
          <tr>
            <th className="table-head !text-large-strong text-neutral-primary h-auto">
              Status
            </th>
            <th className="table-head !text-large-strong text-neutral-primary h-auto">
              Issue Count
            </th>
          </tr>
        </thead>
        <tbody>
          {payload?.map((entry, index) => (
            <tr key={`item-${index}`}>
              <td className="!text-large-normal text-neutral-primary table-cell py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.value}</span>
                </div>
              </td>
              <td className="!text-large-normal text-neutral-primary table-cell py-2">
                {entry.payload?.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimplePieChart;
