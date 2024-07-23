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

import { Icon } from '@ufb/ui';

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
        'resizer hover:text-primary z-auto',
        header.column.getIsResizing() ?
          'text-primary bg-secondary'
        : 'text-tertiary',
      ])}
      style={{
        transform:
          header.column.getIsResizing() ?
            `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
          : 'translateX(0px)',
      }}
    >
      <Icon
        name="Handle"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"
        size={16}
      />
    </div>
  );
};

export default TableResizer;
