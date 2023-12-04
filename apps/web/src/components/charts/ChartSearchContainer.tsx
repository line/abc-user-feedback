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
import ChartSearchFilter from './ChartSearchFilter';
import Legend from './Legend';

interface IProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  dataKeys?: { name: string; color: string }[];
  onChecked: (item: { id: number; name: string }, checked: boolean) => void;
  chedkedList: { id: number; name: string }[];
  onChangeSearch: (v: string) => void;
  items: { id: number; name: string }[];
}

const ChartSearchContainer: React.FC<IProps> = (props) => {
  const {
    children,
    description,
    title,
    dataKeys,
    chedkedList,
    onChecked,
    onChangeSearch,
    items,
  } = props;

  return (
    <div className="border-fill-tertiary rounded border p-4">
      <div className="flex h-[72px] items-center justify-between">
        <div>
          <span className="font-20-bold">{title}</span>
          {description && <DescriptionTooltip description={description} />}
        </div>
        <div className="flex gap-3">
          <Legend dataKeys={dataKeys ?? []} />
          <ChartSearchFilter
            checkedList={chedkedList ?? []}
            items={items}
            onChecked={onChecked}
            onChange={onChangeSearch}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartSearchContainer;
