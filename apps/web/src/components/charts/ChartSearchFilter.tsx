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
  items: { id: number; name: string }[];
  checkedList: { id: number; name: string }[];
  onChecked: (item: { id: number; name: string }, checked: boolean) => void;
  onChange: (value: string) => void;
}

const ChartSearchFilter: React.FC<IProps> = (props) => {
  const { checkedList, items, onChecked, onChange } = props;

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger asChild>
        <button className="icon-btn icon-btn-secondary icon-btn-sm">
          <Icon name="FilterCircleStroke" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <Input
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="Search"
          className="mb-3"
        />
        <div className="space-y-1">
          {items.map((item) => (
            <label className="flex items-center gap-2 py-1" key={item.id}>
              <input
                className="checkbox checkbox-sm"
                type="checkbox"
                checked={checkedList.some(
                  (checkedItem) => checkedItem.id === item.id,
                )}
                onChange={(e) => onChecked(item, e.currentTarget.checked)}
              />
              <p className="font-12-regular flex-1">{item.name}</p>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChartSearchFilter;
