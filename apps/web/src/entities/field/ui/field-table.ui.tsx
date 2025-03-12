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

import { useMemo } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button, Icon } from '@ufb/react';

import { BasicTable, TableFacetedFilter } from '@/shared';

import { getFieldColumns } from '../field-columns';
import type { FieldInfo } from '../field.type';

interface IProps {
  fields: FieldInfo[];
  onClickRow?: (index: number, field: FieldInfo) => void;
  reorder?: (data: FieldInfo[]) => void;
  disableFilter?: boolean;
}

const FieldTable: React.FC<IProps> = (props) => {
  const { fields, onClickRow, reorder, disableFilter } = props;

  const columns = useMemo(() => getFieldColumns(reorder), []);

  const table = useReactTable({
    columns,
    data: fields.sort((a, b) => a.order - b.order),
    enableColumnFilters: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row.key),
  });

  return (
    <div className="flex h-full flex-col gap-4">
      {!disableFilter && (
        <div className="flex gap-3">
          <TableFacetedFilter
            column={table.getColumn('status')}
            options={[
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Active', value: 'ACTIVE' },
            ]}
            title="Status"
          />
          <TableFacetedFilter
            column={table.getColumn('property')}
            options={[
              { label: 'Editable', value: 'EDITABLE' },
              { label: 'Read Only', value: 'READ_ONLY' },
            ]}
            title="Property"
          />
          {table.getState().columnFilters.length > 0 && (
            <Button variant="ghost" onClick={() => table.resetColumnFilters()}>
              <Icon name="RiCloseLine" />
              Reset
            </Button>
          )}
        </div>
      )}
      <BasicTable
        table={table}
        onClickRow={(index, row) => onClickRow?.(index, row)}
        reorder={(data) =>
          reorder?.(
            data.map((field, index) => ({ ...field, order: index + 1 })),
          )
        }
      />
    </div>
  );
};

export default FieldTable;
