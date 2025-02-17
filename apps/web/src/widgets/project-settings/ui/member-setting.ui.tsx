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
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Icon, toast } from '@ufb/react';

import type { TableFilter, TableFilterOperator } from '@/shared';
import {
  BasicTable,
  client,
  DeleteDialog,
  SettingTemplate,
  TableFilterPopover,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { MemberInfo } from '@/entities/member';
import { MemberFormDialog } from '@/entities/member';
import { useMembmerSearch } from '@/entities/member/lib';
import { getMemberColumns } from '@/entities/member/member-columns';
import { useUserSearch } from '@/entities/user';

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
  const [tableFilters, setTableFilters] = useState<TableFilter[]>([]);
  const [operator, setOperator] = useState<TableFilterOperator>('AND');

  const queries = useMemo(() => {
    return tableFilters.reduce(
      (acc, filter) => {
        return acc.concat({
          [filter.key]: filter.value,
          condition: filter.condition,
        });
      },
      [] as Record<string, unknown>[],
    );
  }, [tableFilters]);

  const { data: userData } = useUserSearch({ limit: 1000 });

  const columns = useMemo(
    () => getMemberColumns(userData?.items ?? []),
    [userData],
  );

  const { data, refetch, isPending } = useMembmerSearch(projectId, {
    limit: 1000,
    operator,
    queries,
  });

  const table = useReactTable({
    columns,
    data: data?.items ?? [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row.id),
  });
  const { rowSelection } = table.getState();
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
        deleteDisabled={!perms.includes('project_member_delete')}
        updateDisabled={!perms.includes('project_member_update')}
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

  return (
    <SettingTemplate
      title={t('project-setting-menu.member-mgmt')}
      action={
        <>
          <Button
            variant="outline"
            onClick={() =>
              router.push({
                pathname: '/main/project/[projectId]/settings',
                query: { projectId, menu: 'member', submenu: 'role' },
              })
            }
          >
            <Icon name="RiExchange2Fill" />
            {t('project-setting-menu.role-mgmt')}
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
          filterFields={[
            {
              key: 'name',
              format: 'string',
              name: 'Name',
              matchType: ['CONTAINS', 'IS'],
            },
            {
              key: 'email',
              format: 'string',
              name: 'Email',
              matchType: ['CONTAINS', 'IS'],
            },
            {
              key: 'department',
              format: 'string',
              name: 'Department',
              matchType: ['CONTAINS', 'IS'],
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
            },
            {
              key: 'createdAt',
              format: 'date',
              name: 'Joined',
              matchType: ['IS', 'BETWEEN'],
            },
          ]}
          onSubmit={(tableFilters, operator) => {
            setTableFilters(tableFilters);
            setOperator(operator);
          }}
          tableFilters={tableFilters}
        />
        {rowSelectionIds.length > 0 && (
          <Button
            className="!text-red-primary"
            variant="outline"
            onClick={openDeleteDialog}
          >
            <Icon name="RiDeleteBinFill" />
            {t('v2.button.name.delete', { name: 'Member' })}
            <Badge variant="subtle" className="!text-red-primary">
              {rowSelectionIds.length}
            </Badge>
          </Button>
        )}
      </div>
      <BasicTable
        table={table}
        isLoading={isPending}
        emptyCaption={t('v2.text.no-data.member')}
        createButton={
          <Button
            disabled={!perms.includes('project_member_create')}
            onClick={openCreateMemberFormDialog}
          >
            {t('v2.button.register')}
          </Button>
        }
        onClickRow={openUpdateMemberFormDialog}
      />
    </SettingTemplate>
  );
};

export default MemberSetting;
