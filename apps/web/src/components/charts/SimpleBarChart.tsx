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
  showFilter?: boolean;
}

const SimpleBarChart: React.FC<IProps> = (props) => {
  const { data, title, description, height, showLegend, showFilter } = props;
  return (
    <ChartContainer
      description={description}
      title={title}
      showLegend={showLegend}
      showFilter={showFilter}
    >
      <ResponsiveContainer width="100%" height={height ? height - 72 : '100%'}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#007AFF" activeBar={<Rectangle />} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SimpleBarChart;
