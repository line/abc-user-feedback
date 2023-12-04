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
import { Icon, Input, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

interface IProps {
  items: string[];
  checkedList: string[];
  onChecked?: (name: string, checked: boolean) => void;
  search?: {
    value: string;
    onChange: (value: string) => void;
  };
}

const ChartFilter: React.FC<IProps> = (props) => {
  const { checkedList, items, onChecked, search } = props;

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <button className="icon-btn icon-btn-secondary icon-btn-sm">
          <Icon name="FilterCircleStroke" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        {search && (
          <Input
            value={search.value}
            onChange={(e) => search.onChange(e.currentTarget.value)}
            placeholder="Search"
            className="mb-3"
          />
        )}
        <div className="space-y-1">
          {items.map((name) => (
            <label className="flex items-center gap-2 py-1" key={name}>
              <input
                className="checkbox checkbox-sm"
                type="checkbox"
                checked={checkedList ? checkedList.includes(name) : true}
                onChange={(e) => onChecked?.(name, e.currentTarget.checked)}
              />
              <p className="font-12-regular flex-1">{name}</p>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChartFilter;
