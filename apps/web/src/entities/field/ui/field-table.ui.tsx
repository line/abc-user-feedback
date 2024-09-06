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
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@ufb/react';

import { BasicTable, TableFacetedFilter } from '@/shared';

import { getFieldColumns } from '../field-columns';
import type { FieldInfo } from '../field.type';

interface IProps {
  fields: FieldInfo[];
  onClickRow: (rowId: number, field: FieldInfo) => void;
}

const FieldTable: React.FC<IProps> = (props) => {
  const { fields, onClickRow } = props;

  const columns = useMemo(() => getFieldColumns(), []);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: fields,
    enableColumnFilters: true,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(_, index) {
      return String(index);
    },
  });

  return (
    <div>
      <div className="mb-4 flex gap-3">
        {table.getColumn('status') && (
          <TableFacetedFilter
            column={table.getColumn('status')}
            options={[
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Active', value: 'ACTIVE' },
            ]}
            title="Status"
          />
        )}
        {table.getColumn('property') && (
          <TableFacetedFilter
            column={table.getColumn('property')}
            options={[
              { label: 'Editable', value: 'EDITABLE' },
              { label: 'Read Only', value: 'READ_ONLY' },
            ]}
            title="Property"
          />
        )}
        {table.getState().columnFilters.length > 0 && (
          <Button
            variant="ghost"
            iconL="RiCloseLine"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
          </Button>
        )}
      </div>
      <BasicTable
        table={table}
        onClickRow={(rowId, row) => onClickRow(Number(rowId), row)}
        createButton
      />
    </div>
  );
};

export default FieldTable;
