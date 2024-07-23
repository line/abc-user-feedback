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
import { useTranslation } from 'react-i18next';
import type { TooltipProps } from 'recharts';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import ChartContainer from './chart-container';

interface IProps {
  title: string;
  description?: string;
  height?: number;
  data: unknown[];
  dataKeys: { color: string; name: string }[];
  showLegend?: boolean;
  filterContent?: React.ReactNode;
  noLabel?: boolean;
}

const SimpleLineChart: React.FC<IProps> = (props) => {
  const {
    title,
    description,
    height,
    data,
    dataKeys,
    showLegend,
    filterContent,
    noLabel = false,
  } = props;

  return (
    <ChartContainer
      dataKeys={dataKeys}
      description={description}
      title={title}
      showLegend={showLegend}
      filterContent={filterContent}
    >
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{ left: -5, right: 10, top: 10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--fill-color-secondary)"
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} noLabel={noLabel} />}
            formatter={(value) => value.toLocaleString()}
          />
          <XAxis
            dataKey="date"
            className="font-10-regular text-secondary"
            tickSize={15}
            tickLine={false}
            interval="equidistantPreserveStart"
          />
          <YAxis
            tickFormatter={(v: string) => v.toLocaleString()}
            className="font-10-regular text-secondary"
            tickSize={15}
            tickLine={false}
            min={0}
          />
          {dataKeys.map(({ color, name }) => (
            <Line
              key={name}
              type="linear"
              dataKey={name}
              stroke={color}
              activeDot={{ r: 8, stroke: 'var(--background-color-tertiary)' }}
              dot={{
                fill: color,
                r: 4,
                strokeWidth: 2,
                stroke: 'var(--background-color-tertiary)',
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

interface ICustomTooltipProps
  extends Omit<TooltipProps<ValueType, NameType>, 'label'> {
  noLabel: boolean;
  label?: string;
}

const CustomTooltip: React.FC<ICustomTooltipProps> = (props) => {
  const { active, payload, label, noLabel } = props;
  const { t } = useTranslation();
  const days = useMemo(() => {
    if (!label || typeof label !== 'string' || !label.includes('-')) {
      return null;
    }
    const [start, end] = label.split(' - ');
    const dates = dayjs(end).diff(dayjs(start), 'day') + 1;
    return dates > 0 ? dates : 365 + dates;
  }, [label]);

  if (!active || !payload) return null;

  return (
    <div
      className="bg-tertiary border-fill-secondary max-w-[240px] rounded border px-4 py-3"
      style={{ boxShadow: '0px 4px 8px 0px #0000004D' }}
    >
      <h1 className="font-12-bold mb-3">
        {label}
        {days && (
          <span className="text-secondary ml-1">
            ({t('text.days', { days })})
          </span>
        )}
      </h1>
      <div className="flex flex-col gap-1">
        {payload.map(({ color, name, value }, i) => (
          <div className="flex items-center justify-between gap-4" key={i}>
            {!noLabel && (
              <div className="flex items-center gap-2">
                <div
                  style={{ background: color }}
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                />
                <p className="font-12-regular break-all">{name}</p>
              </div>
            )}
            <p className="font-12-regular">{value?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleLineChart;
