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
import { useEffect, useMemo, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import type { SearchItemType } from '@/shared';
import {
  BasicTable,
  TablePagination,
  TableSearchInput,
  useOAIQuery,
  useSort,
} from '@/shared';

import { useUserSearch } from '../lib';
import { getUserColumns } from '../user-columns';
import type { UserMember } from '../user.type';

interface IProps {}

const UserManagementTable: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const [query, setQuery] = useState({});
  const [rows, setRows] = useState<UserMember[]>([]);

  const table = useReactTable({
    columns: getUserColumns(),
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    getRowId: (row) => String(row.id),
    initialState: { sorting: [{ id: 'createdAt', desc: false }] },
  });

  const { sorting, pagination } = table.getState();

  const sort = useSort(sorting);

  const { data } = useUserSearch({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    query,
    order: sort as { createdAt: 'ASC' | 'DESC' },
  });

  useEffect(() => {
    setRows(data?.items ?? []);
  }, [data]);

  const { data: projectData } = useOAIQuery({ path: '/api/admin/projects' });

  const searchItems = useMemo(() => {
    return [
      { format: 'text', key: 'email', name: 'Email' },
      { format: 'text', key: 'name', name: 'Name' },
      { format: 'text', key: 'department', name: 'Department' },
      { format: 'date', key: 'createdAt', name: 'Created' },
      {
        format: 'select',
        key: 'type',
        name: 'Type',
        options: [
          { key: 'GENERAL', name: 'GENERAL' },
          { key: 'SUPER', name: 'SUPER' },
        ],
      },
      {
        format: 'select',
        key: 'projectId',
        name: 'Project',
        options: projectData?.items.map((v) => ({ key: v.id, name: v.name })),
      },
    ] as SearchItemType[];
  }, [projectData]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-16-regular text-secondary">
          {t('text.search-result')}
          <span className="text-primary ml-2">
            {t('text.number-count', { count: data?.meta.totalItems ?? 0 })}
          </span>
        </p>
        <div className="flex gap-2">
          <TablePagination
            limit={pagination.pageSize}
            nextPage={() => table.setPageIndex((page) => page + 1)}
            prevPage={() => table.setPageIndex((page) => page - 1)}
            disabledNextPage={
              pagination.pageIndex + 1 >= (data?.meta.totalPages ?? 1)
            }
            disabledPrevPage={pagination.pageIndex < 1}
            setLimit={table.setPageSize}
          />
          <TableSearchInput
            searchItems={searchItems}
            onChangeQuery={setQuery}
          />
        </div>
      </div>
      <BasicTable
        table={table}
        emptyComponent={
          <div className="my-32 flex flex-col items-center justify-center gap-3">
            <Icon
              name="WarningTriangleFill"
              className="text-quaternary"
              size={32}
            />
            <p className="text-secondary">{t('text.no-data')}</p>
          </div>
        }
      />
    </div>
  );
};

export default UserManagementTable;
