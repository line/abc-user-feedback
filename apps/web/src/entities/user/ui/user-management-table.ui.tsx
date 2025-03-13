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
import { useMutation } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Badge, Button, Icon, toast } from '@ufb/react';

import type { TableFilter, TableFilterOperator } from '@/shared';
import {
  BasicTable,
  client,
  DeleteDialog,
  TableFilterPopover,
  TablePagination,
  useAllProjects,
  useOAIMutation,
  useSort,
} from '@/shared';

import { useUserSearch } from '../lib';
import { getUserColumns } from '../user-columns';
import type { UpdateUser, UserMember } from '../user.type';
import UpdateUserDialog from './update-user-dialog.ui';

interface IProps {
  createButton?: React.ReactNode;
}

const UserManagementTable: React.FC<IProps> = ({ createButton }) => {
  const { t } = useTranslation();
  const overlay = useOverlay();

  const [rows, setRows] = useState<UserMember[]>([]);

  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const [tableFilters, setTableFilters] = useState<TableFilter[]>([]);
  const [operator, setOperator] = useState<TableFilterOperator>('AND');
  const queries = useMemo(() => {
    return tableFilters.reduce(
      (acc, filter) => {
        return acc.concat({
          [filter.key]:
            filter.key === 'projectId' || filter.key === 'type' ?
              [filter.value]
            : filter.value,
          condition: filter.condition,
        });
      },
      [] as Record<string, unknown>[],
    );
  }, [tableFilters]);

  const columns = useMemo(() => getUserColumns(), []);

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    enableColumnFilters: true,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount,
    rowCount,
  });

  const { sorting, pagination } = table.getState();
  const sort = useSort(sorting);

  const { data: projects } = useAllProjects();

  const {
    data: userData,
    refetch,
    isLoading,
  } = useUserSearch({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    order: sort as { createdAt: 'ASC' | 'DESC' },
    queries,
    operator,
  });

  const { mutateAsync: deleteUsers } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/users',
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
        table.resetRowSelection();
      },
      onError({ message }) {
        toast.error(message);
      },
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: async ({ id, body }: { id: number; body: UpdateUser }) => {
      const { data } = await client.put({
        path: '/api/admin/users/{id}',
        pathParams: { id },
        body,
      });
      return data;
    },
    onSuccess: async () => {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (isLoading) return;
    setRows(userData?.items ?? []);
    setPageCount(userData?.meta.totalPages ?? 0);
    setRowCount(userData?.meta.totalItems ?? 0);
  }, [userData, pagination, isLoading]);

  useEffect(() => {
    table.setPageIndex(0);
    table.resetRowSelection();
  }, [pagination.pageSize, queries]);

  const selectedRowIds = useMemo(() => {
    return Object.entries(table.getState().rowSelection).reduce(
      (acc, [key, value]) => (value ? acc.concat(Number(key)) : acc),
      [] as number[],
    );
  }, [table.getState().rowSelection]);

  const openDeleteUsersDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => deleteUsers({ ids: selectedRowIds })}
      />
    ));
  };

  const openUpdateUserDialog = (data: UserMember) => {
    overlay.open(({ close, isOpen }) => (
      <UpdateUserDialog
        close={close}
        isOpen={isOpen}
        data={data}
        onSubmit={async (input) => {
          await updateUser({ id: data.id, body: input });
          close();
        }}
        onClickDelete={() => deleteUsers({ ids: [data.id] })}
      />
    ));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableFilterPopover
            filterFields={[
              {
                key: 'email',
                format: 'string',
                name: 'Email',
                matchType: ['CONTAINS', 'IS'],
              },
              {
                key: 'name',
                format: 'string',
                name: 'Name',
                matchType: ['CONTAINS', 'IS'],
              },
              {
                key: 'department',
                format: 'string',
                name: 'Department',
                matchType: ['CONTAINS', 'IS'],
              },
              {
                key: 'type',
                format: 'select',
                name: 'Type',
                options: [
                  { key: 'SUPER', name: 'Super' },
                  { key: 'GENERAL', name: 'General' },
                ],
                matchType: ['IS'],
              },
              {
                key: 'projectId',
                format: 'select',
                name: 'Project',
                options:
                  projects?.items.map((v) => ({
                    key: String(v.id),
                    name: v.name,
                  })) ?? [],
                matchType: ['IS'],
              },
              {
                key: 'createdAt',
                format: 'date',
                name: 'Created',
                matchType: ['BETWEEN', 'IS'],
              },
            ]}
            tableFilters={tableFilters}
            onSubmit={(filters, oprator) => {
              setTableFilters(filters);
              setOperator(oprator);
            }}
            table={table}
          />
        </div>
        {selectedRowIds.length > 0 && (
          <Button
            variant="outline"
            className="!text-tint-red"
            onClick={openDeleteUsersDialog}
          >
            <Icon name="RiDeleteBin6Line" />
            {t('v2.button.name.delete', { name: 'User' })}
            <Badge variant="subtle" className="!text-tint-red">
              {selectedRowIds.length}
            </Badge>
          </Button>
        )}
      </div>
      <BasicTable
        table={table}
        onClickRow={(_, row) => openUpdateUserDialog(row)}
        isLoading={isLoading}
        createButton={createButton}
      />
      <TablePagination table={table} />
    </>
  );
};

export default UserManagementTable;
