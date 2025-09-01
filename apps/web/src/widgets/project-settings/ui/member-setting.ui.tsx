/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Badge, Button, Icon, toast } from '@ufb/react';

import type {
  SearchQuery,
  TableFilter,
  TableFilterField,
  TableFilterOperator,
} from '@/shared';
import {
  BasicTable,
  client,
  DeleteDialog,
  SettingTemplate,
  TableFilterPopover,
  TablePagination,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { Member, MemberInfo } from '@/entities/member';
import { MemberFormDialog } from '@/entities/member';
import { useMembmerSearch } from '@/entities/member/lib';
import { memberColumns } from '@/entities/member/member-columns';
import { useUserStore } from '@/entities/user';

interface IProps {
  projectId: number;
}

const MemberSetting: React.FC<IProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();
  const overlay = useOverlay();
  const router = useRouter();
  const { user } = useUserStore();

  const [tableFilters, setTableFilters] = useState<TableFilter[]>([]);
  const [operator, setOperator] = useState<TableFilterOperator>('AND');
  const [rows, setRows] = useState<Member[]>([]);

  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const queries = useMemo(() => {
    return tableFilters.reduce((acc, filter) => {
      return acc.concat({
        key: filter.key,
        value: filter.value,
        condition: filter.condition,
      });
    }, [] as SearchQuery[]);
  }, [tableFilters]);

  const table = useReactTable({
    columns: memberColumns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String(row.id),
    initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
    manualPagination: true,
    pageCount,
    rowCount,
    enableRowSelection: (row) => row.original.user.email !== user?.email,
  });

  const { rowSelection, pagination } = table.getState();

  const { data, refetch, isPending } = useMembmerSearch(projectId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    operator,
    queries,
  });

  useEffect(() => {
    if (isPending) return;
    setRows(data?.items ?? []);
    setPageCount(data?.meta.totalPages ?? 0);
    setRowCount(data?.meta.totalItems ?? 0);
    table.resetRowSelection();
  }, [data, pagination, isPending]);

  useEffect(() => {
    table.setPageIndex(0);
    table.resetRowSelection();
  }, [pagination.pageSize, queries]);

  const rowSelectionIds = useMemo(
    () =>
      Object.entries(rowSelection).reduce(
        (acc, [key, value]) => (value ? acc.concat(Number(key)) : acc),
        [] as number[],
      ),
    [rowSelection],
  );

  const { mutateAsync: createMember } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/members',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const { data: projectData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  const { data: rolesData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId },
  });

  const { mutateAsync: deleteMember } = useMutation({
    mutationFn: (input: { memberId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/members/{memberId}',
        pathParams: { projectId, memberId: input.memberId },
      }),
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
      table.resetRowSelection();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: updateMember } = useMutation({
    mutationFn: (input: { memberId: number; roleId: number }) =>
      client.put({
        path: '/api/admin/projects/{projectId}/members/{memberId}',
        pathParams: { projectId, memberId: input.memberId },
        body: { roleId: input.roleId },
      }),
    async onSuccess() {
      await refetch();
      await queryClient.invalidateQueries({
        queryKey: ['/api/admin/users/{userId}/roles'],
      });
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const openCreateMemberFormDialog = () => {
    if (!rolesData || !projectData) return;
    overlay.open(({ isOpen, close }) => (
      <MemberFormDialog
        members={data?.items ?? []}
        onSubmit={({ role, user }) =>
          createMember({ roleId: role.id, userId: user.id })
        }
        project={projectData}
        roles={rolesData.roles}
        close={close}
        isOpen={isOpen}
      />
    ));
  };

  const openUpdateMemberFormDialog = (_: number, member: MemberInfo) => {
    if (!projectData || !rolesData || !member.id) return;
    const memberId = member.id;
    overlay.open(({ close, isOpen }) => (
      <MemberFormDialog
        close={close}
        isOpen={isOpen}
        data={member}
        onSubmit={(newMember) =>
          updateMember({ memberId, roleId: newMember.role.id })
        }
        onClickDelete={() => deleteMember({ memberId })}
        project={projectData}
        roles={rolesData.roles}
        members={data?.items ?? []}
        disabledDelete={
          !perms.includes('project_member_delete') ||
          member.user.email === user?.email
        }
        disabledUpdate={!perms.includes('project_member_update')}
      />
    ));
  };

  const openDeleteDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={async () => {
          for (const memberId of rowSelectionIds) {
            await deleteMember({ memberId });
          }
        }}
      />
    ));
  };

  const filterFields: TableFilterField[] = [
    {
      key: 'email',
      format: 'string',
      name: 'Email',
      matchType: ['CONTAINS', 'IS'],
      visible: true,
    },
    {
      key: 'name',
      format: 'string',
      name: 'Name',
      matchType: ['CONTAINS', 'IS'],
      visible: true,
    },
    {
      key: 'department',
      format: 'string',
      name: 'Department',
      matchType: ['CONTAINS', 'IS'],
      visible: true,
    },
    {
      key: 'role',
      format: 'select',
      name: 'Role',
      options:
        rolesData?.roles.map((role) => ({
          key: role.name,
          name: role.name,
        })) ?? [],
      matchType: ['IS'],
      visible: true,
    },
    {
      key: 'createdAt',
      format: 'date',
      name: 'Joined',
      matchType: ['IS', 'BETWEEN'],
      visible: true,
    },
  ];

  return (
    <SettingTemplate
      title={t('v2.project-setting-menu.member-mgmt')}
      action={
        <>
          <Button
            disabled={!perms.includes('project_role_read')}
            variant="outline"
            onClick={() =>
              router.push({
                pathname: '/main/project/[projectId]/settings',
                query: { projectId, menu: 'member', submenu: 'role' },
              })
            }
          >
            <Icon name="RiExchange2Fill" />
            {t('v2.project-setting-menu.role-mgmt')}
          </Button>
          <Button
            disabled={!perms.includes('project_member_create')}
            onClick={openCreateMemberFormDialog}
          >
            {t('v2.button.name.register', { name: 'Member' })}
          </Button>
        </>
      }
    >
      <div className="flex justify-between">
        <TableFilterPopover
          operator={operator}
          filterFields={filterFields}
          onSubmit={(tableFilters, operator) => {
            setTableFilters(tableFilters);
            setOperator(operator);
          }}
          tableFilters={tableFilters}
          table={table}
        />
        {rowSelectionIds.length > 0 && (
          <Button
            className="!text-tint-red"
            variant="outline"
            onClick={openDeleteDialog}
            disabled={!perms.includes('project_member_delete')}
          >
            <Icon name="RiDeleteBinFill" />
            {t('v2.button.name.delete', { name: 'Member' })}
            <Badge variant="subtle" className="!text-tint-red">
              {rowSelectionIds.length}
            </Badge>
          </Button>
        )}
      </div>
      <BasicTable
        table={table}
        isLoading={isPending}
        createButton={
          <Button
            disabled={!perms.includes('project_member_create')}
            onClick={openCreateMemberFormDialog}
          >
            {t('v2.button.register')}
          </Button>
        }
        onClickRow={openUpdateMemberFormDialog}
        isFiltered={queries.length > 0}
      />
      <TablePagination table={table} />
    </SettingTemplate>
  );
};

export default MemberSetting;
