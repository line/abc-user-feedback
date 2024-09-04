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
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { BasicTable } from '@/shared';

import { getFieldColumns } from '../field-columns';
import type { FieldInfo } from '../field.type';

interface IProps {
  fields: FieldInfo[];
}

const FieldTable: React.FC<IProps> = (props) => {
  const { fields } = props;

  const columns = useMemo(() => getFieldColumns(), []);

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: fields,
    debugTable: true,
  });

  return <BasicTable table={table} createButton />;
};

export default FieldTable;
