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
import type { Table } from '@tanstack/react-table';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  IconButton,
} from '@ufb/react';

const PAGE_SIZES = [10, 20, 30, 40, 50];

interface IProps<T> {
  table: Table<T>;
}

const TablePagination = <T,>(props: IProps<T>) => {
  const { table } = props;
  const { pagination } = table.getState();

  return (
    <div className="text-neutral-tertiary flex items-center gap-2">
      <p>Rows per page</p>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="outline"
            size="small"
            iconR="RiExpandUpDownFill"
            className="!min-w-0"
          >
            {pagination.pageSize}
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          {PAGE_SIZES.map((pageSize) => (
            <DropdownItem
              key={pageSize}
              onClick={() => table.setPageSize(pageSize)}
            >
              {pageSize}
            </DropdownItem>
          ))}
        </DropdownContent>
      </Dropdown>
      <p>
        Page {pagination.pageIndex + 1} of {table.getPageCount()}
      </p>
      <IconButton
        size="small"
        variant="outline"
        icon="RiArrowLeftDoubleFill"
        onClick={table.firstPage}
        disabled={!table.getCanPreviousPage()}
      />
      <IconButton
        size="small"
        variant="outline"
        icon="RiArrowLeftSLine"
        onClick={table.previousPage}
        disabled={!table.getCanPreviousPage()}
      />
      <IconButton
        size="small"
        variant="outline"
        icon="RiArrowRightSLine"
        onClick={table.nextPage}
        disabled={!table.getCanNextPage()}
      />
      <IconButton
        size="small"
        variant="outline"
        icon="RiArrowRightDoubleFill"
        onClick={table.lastPage}
        disabled={!table.getCanNextPage()}
      />
    </div>
  );
};

export default TablePagination;
