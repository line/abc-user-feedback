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
import type { Header, Table } from '@tanstack/react-table';

import { cn } from '@/shared';

interface IProps<T> {
  table: Table<T>;
  header: Header<T, unknown>;
}

const TableResizer = <T,>({ table, header }: IProps<T>) => {
  return (
    <div
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn([
        'resizer hover:bg-neutral-secondary z-auto',
        {
          'bg-neutral-secondary': header.column.getIsResizing(),
        },
      ])}
      style={{
        transform:
          header.column.getIsResizing() ?
            `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
          : 'translateX(0px)',
      }}
    />
  );
};

export default TableResizer;
