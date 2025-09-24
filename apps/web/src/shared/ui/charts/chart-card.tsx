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

import DescriptionTooltip from '../description-tooltip';
import Legend from './legend';

interface IProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  dataKeys?: { name: string; color: string }[];
  showLegend?: boolean;
  filterContent?: React.ReactNode;
}

const ChartCard: React.FC<IProps> = (props) => {
  const { children, description, title, dataKeys, filterContent, showLegend } =
    props;
  return (
    <div className="rounded-20 shadow-default border-neutral-tertiary bg-neutral-primary h-full border">
      <div className="border-neutral-tertiary flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center">
          <span className="text-title-h4">{title}</span>
          {description && (
            <DescriptionTooltip description={description} side="bottom" />
          )}
        </div>
        <div className="flex gap-3">
          {showLegend && <Legend dataKeys={dataKeys ?? []} />}
          {filterContent}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ChartCard;
