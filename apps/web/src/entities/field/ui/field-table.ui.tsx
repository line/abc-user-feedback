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

import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { BasicTable } from '@/shared';

import { getFieldColumns } from '../field-columns';
import type { FieldInfo, FieldStatus } from '../field.type';

interface IProps {
  isInputStep?: boolean;
  fields: FieldInfo[];
  onDeleteField?: (input: { index: number }) => void;
  onModifyField?: (input: { index: number; field: FieldInfo }) => void;
  fieldStatus?: FieldStatus;
}

const FieldTable: React.FC<IProps> = (props) => {
  const { isInputStep, fields, onDeleteField, onModifyField, fieldStatus } =
    props;

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns: getFieldColumns(fields, onDeleteField, onModifyField, isInputStep),
    data: fields,
    enableSorting: false,
    state: { globalFilter: fieldStatus },
    enableGlobalFilter: true,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _, value) =>
      fieldStatus ? row.original.status === value : true,
  });

  return <BasicTable table={table} />;
};

export default FieldTable;
