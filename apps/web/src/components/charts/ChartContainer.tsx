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

import { DescriptionTooltip } from '../etc';
import ChartFilter from './ChartFilter';
import Legend from './Legend';

interface IProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  dataKeys?: { name: string; color: string }[];
  showLegend?: boolean;
  filterContent?: React.ReactNode;
}

const ChartContainer: React.FC<IProps> = (props) => {
  const { children, description, title, dataKeys, filterContent, showLegend } =
    props;
  return (
    <div className="border-fill-tertiary rounded border p-4">
      <div className="flex h-[72px] items-center justify-between">
        <div className="flex items-center">
          <span className="font-20-bold">{title}</span>
          {description && (
            <DescriptionTooltip description={description} placement="bottom" />
          )}
        </div>
        <div className="flex gap-3">
          {showLegend && <Legend dataKeys={dataKeys ?? []} />}
          {filterContent && <ChartFilter>{filterContent}</ChartFilter>}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartContainer;
