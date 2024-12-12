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
import { useTranslation } from 'react-i18next';

import { Badge, Button, Icon, toast } from '@ufb/react';

import {
  BasicTable,
  client,
  DeleteDialog,
  TableFacetedFilter,
  TablePagination,
  useOAIMutation,
  useOAIQuery,
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

  // const [query, setQuery] = useState({});
  const [rows, setRows] = useState<UserMember[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const columns = useMemo(() => getUserColumns(), []);
  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    enableColumnFilters: true,
    initialState: { sorting: [{ id: 'createdAt', desc: true }] },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount,
    rowCount,
  });

  const { sorting, pagination, columnFilters } = table.getState();
  const sort = useSort(sorting);

  const { data: projects } = useOAIQuery({ path: '/api/admin/projects' });

  const query = useMemo(() => {
    return columnFilters.reduce(
      (acc, { id, value }) => {
        if (id === 'members') {
          return {
            ...acc,
            projectId: (value as string[]).map((v) => parseInt(v)),
          };
        }
        return { ...acc, [id]: value };
      },
      {} as Record<string, unknown>,
    );
  }, [columnFilters]);

  const {
    data: userData,
    refetch,
    isLoading,
  } = useUserSearch({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    order: sort as { createdAt: 'ASC' | 'DESC' },
    query,
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
    onError({ message }) {
      toast.error(message);
    },
  });

  useEffect(() => {
    setRows(userData?.items ?? []);
    setPageCount(userData?.meta.totalPages ?? 0);
    setRowCount(userData?.meta.totalItems ?? 0);
  }, [userData]);

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
        onSubmit={(input) => updateUser({ id: data.id, body: input })}
        onClickDelete={() => deleteUsers({ ids: [data.id] })}
      />
    ));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          {table.getState().columnFilters.length > 0 && (
            <Button variant="ghost" onClick={() => table.resetColumnFilters()}>
              <Icon name="RiCloseLine" />
              Reset
            </Button>
          )}
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
