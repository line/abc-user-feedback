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
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '@ufb/react';

interface Props<T> extends React.PropsWithChildren {
  column: Column<T, unknown>;
}

const SortingTableHead = <T,>({ column, children }: Props<T>) => {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="ghost"
          size="small"
          iconR="RiArrowUpDownFill"
          className="!min-w-0 font-normal text-[var(--table-text-header)]"
          data-state="open"
        >
          {children}
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem
          onClick={() => column.toggleSorting(false)}
          iconL="RiArrowUpLine"
        >
          Ascending
        </DropdownItem>
        <DropdownItem
          onClick={() => column.toggleSorting(true)}
          iconL="RiArrowDownLine"
        >
          Descending
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default SortingTableHead;
