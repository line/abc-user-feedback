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
  Rectangle,
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
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barSize={16}
          onClick={(e) => {
            onClick?.(e.activePayload?.[0].payload);
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            cursor={<Rectangle fill="#5D7BE729" />}
            contentStyle={{ background: 'var(--background-color-primary)' }}
          />
          <Bar dataKey="value" fill="#5D7BE7" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SimpleBarChart;
