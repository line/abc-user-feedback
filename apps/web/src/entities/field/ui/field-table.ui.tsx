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

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { BasicTable } from '@/shared';

import type { FieldInfo } from '../field.type';
import { getColumns } from './field-columns';

interface IProps {
  fields: FieldInfo[];
  onDeleteField?: (input: { index: number }) => void;
  onModifyField?: (input: { index: number; field: FieldInfo }) => void;
}

const FieldTable: React.FC<IProps> = (props) => {
  const { fields, onDeleteField, onModifyField } = props;

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns: getColumns(fields, onDeleteField, onModifyField),
    data: fields,
    enableSorting: false,
  });

  return <BasicTable table={table} />;
};

export default FieldTable;
