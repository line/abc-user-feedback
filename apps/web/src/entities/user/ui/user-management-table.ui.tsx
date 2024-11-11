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
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import type { SearchItemType } from '@/shared';
import {
  BasicTable,
  TableFacetedFilter,
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

  const columns = useMemo(() => getUserColumns(), []);
  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    getRowId: (row) => String(row.id),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnFilters: true,
    initialState: { sorting: [{ id: 'createdAt', desc: false }] },
  });
  const { data: projects } = useOAIQuery({ path: '/api/admin/projects' });

  const { sorting, pagination } = table.getState();

  const sort = useSort(sorting);

  const { data } = useUserSearch({
    page: pagination.pageIndex,
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
    <>
      <div className="mb-3 flex items-center gap-2">
        <TableSearchInput searchItems={searchItems} onChangeQuery={setQuery} />
        <TableFacetedFilter
          column={table.getColumn('type')}
          options={[
            { label: 'Super', value: 'SUPER' },
            { label: 'General', value: 'GENERAL' },
          ]}
          title="Type"
        />
        <TableFacetedFilter
          column={table.getColumn('members')}
          options={
            projects?.items.map((v) => ({
              label: v.name,
              value: String(v.id),
            })) ?? []
          }
          title="Project"
        />
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
        createButton
      />
      <div className="flex items-center justify-between">
        <p>
          {table.getSelectedRowModel().rows.length} of {data?.meta.totalItems}{' '}
          row(s) selected.
        </p>
        <TablePagination table={table} />
      </div>
    </>
  );
};

export default UserManagementTable;
