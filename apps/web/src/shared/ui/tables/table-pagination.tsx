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
import type { Table } from '@tanstack/react-table';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
} from '@ufb/react';

import { cn } from '@/shared/utils';

const PAGE_SIZES = [20, 30, 40, 50];

interface IProps<T> {
  table: Table<T>;
  disableRowSelect?: boolean;
  disableLimit?: boolean;
}

const TablePagination = <T,>(props: IProps<T>) => {
  const { table, disableRowSelect, disableLimit } = props;
  const { pagination } = table.getState();

  return (
    <div
      className={cn('flex w-full items-center justify-between', {
        'justify-end': disableRowSelect,
      })}
    >
      {!disableRowSelect && (
        <p className="text-neutral-tertiary">
          {table.getSelectedRowModel().rows.length} of {table.getRowCount()}{' '}
          row(s) selected.
        </p>
      )}
      <div className="text-neutral-tertiary flex items-center gap-2">
        {!disableLimit && (
          <>
            <p>Rows per page</p>
            <Dropdown>
              <DropdownTrigger variant="outline">
                {pagination.pageSize}
                <Icon name="RiExpandUpDownFill" />
              </DropdownTrigger>
              <DropdownContent>
                {PAGE_SIZES.map((pageSize) => (
                  <DropdownItem
                    key={pageSize}
                    onClick={() =>
                      table.setPagination({ pageIndex: 0, pageSize })
                    }
                  >
                    {pageSize}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </>
        )}
        <p>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <Button
          size="small"
          variant="outline"
          onClick={table.firstPage}
          disabled={!table.getCanPreviousPage()}
        >
          <Icon name="RiArrowLeftDoubleFill" />
        </Button>
        <Button
          size="small"
          variant="outline"
          onClick={table.previousPage}
          disabled={!table.getCanPreviousPage()}
        >
          <Icon name="RiArrowLeftSLine" />
        </Button>
        <Button
          size="small"
          variant="outline"
          onClick={table.nextPage}
          disabled={!table.getCanNextPage()}
        >
          <Icon name="RiArrowRightSLine" />
        </Button>
        <Button
          size="small"
          variant="outline"
          onClick={table.lastPage}
          disabled={!table.getCanNextPage()}
        >
          <Icon name="RiArrowRightDoubleFill" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
