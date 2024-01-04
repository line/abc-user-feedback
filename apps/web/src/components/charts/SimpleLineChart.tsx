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

import ChartContainer from './ChartContainer';
import LineChart from './LineChart';

interface IProps {
  title: string;
  description?: string;
  height?: number;
  data: any[];
  dataKeys: { color: string; name: string }[];
  showLegend?: boolean;
  filterContent?: React.ReactNode;
  noColor?: boolean;
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
    noColor,
  } = props;

  return (
    <ChartContainer
      dataKeys={dataKeys}
      description={description}
      title={title}
      showLegend={showLegend}
      filterContent={filterContent}
    >
      <LineChart
        data={data}
        dataKeys={dataKeys}
        height={height}
        noColor={noColor}
      />
    </ChartContainer>
  );
};

export default SimpleLineChart;
