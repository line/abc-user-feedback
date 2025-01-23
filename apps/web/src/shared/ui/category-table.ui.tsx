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

import { useMemo, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Badge, Icon } from '@ufb/react';

import { getColumns } from '@/widgets/issue-table/issue-table-columns';

import { cn } from '../utils';
import { BasicTable, TablePagination } from './tables';

interface Props {
  projectId: number;
}

const CategoryTable = (props: Props) => {
  const { projectId } = props;
  const { t } = useTranslation();
  const [rows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const columns = useMemo(() => getColumns(t, projectId), [projectId]);

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div
        className={cn(
          'bg-neutral-tertiary flex h-12 items-center rounded-t px-4',
          { 'rounded-b': !isOpen },
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <Icon
            name="RiArrowDownSLine"
            className={cn({ 'rotate-180': !isOpen })}
          />
          None
          <Badge variant="outline" radius="large">
            10
          </Badge>
        </div>
      </div>
      {isOpen && <BasicTable table={table} disableRound />}
      <div className="flex h-12 w-full items-center rounded-b border border-t-0 px-4">
        <TablePagination table={table} disableRowSelect disableLimit />
      </div>
    </div>
  );
};

export default CategoryTable;
