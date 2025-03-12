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
import type { Column } from '@tanstack/react-table';

import {
  Badge,
  Divider,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
  Icon,
} from '@ufb/react';

interface Props<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

const TableFacetedFilter = <TData, TValue>(props: Props<TData, TValue>) => {
  const { column, title, options } = props;

  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Dropdown>
      <DropdownTrigger className="min-w-[88px]">
        <Icon name="RiAddLine" size={16} />
        {title}
        {selectedValues.size > 0 && (
          <>
            <Divider
              orientation="vertical"
              className="mx-2 h-4"
              variant="subtle"
            />
            <div className="flex gap-2">
              {selectedValues.size > 2 ?
                <Badge variant="subtle">{selectedValues.size} selected</Badge>
              : options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      key={option.value}
                      variant="subtle"
                      className="font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))
              }
            </div>
          </>
        )}
      </DropdownTrigger>
      <DropdownContent>
        <DropdownGroup>
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);
            return (
              <DropdownItem
                key={option.value}
                onClick={() => {
                  if (isSelected) {
                    selectedValues.delete(option.value);
                  } else {
                    selectedValues.add(option.value);
                  }
                  const filterValues = Array.from(selectedValues);

                  column?.setFilterValue(
                    filterValues.length ? filterValues : undefined,
                  );
                }}
              >
                <div className="mr-2 flex h-4 w-4 items-center justify-center">
                  {isSelected && <Icon name="RiCheckFill" size={16} />}
                </div>
                {option.label}
              </DropdownItem>
            );
          })}
        </DropdownGroup>
      </DropdownContent>
    </Dropdown>
  );
};

export default TableFacetedFilter;
