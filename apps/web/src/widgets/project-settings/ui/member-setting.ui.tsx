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
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Button, toast } from '@ufb/react';

import {
  client,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { Member } from '@/entities/member';
import { MemberFormDialog, MemberTable } from '@/entities/member';

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

  const {
    data: memberData,
    refetch,
    isPending,
  } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/members',
    variables: { projectId, createdAt: 'ASC' },
  });

  const { mutate: createMember } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/members',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
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

  const openCreateMemberDialog = () => {
    if (!rolesData || !projectData) return;
    overlay.open(({ isOpen, close }) => (
      <MemberFormDialog
        members={memberData?.members ?? []}
        onSubmit={({ role, user }) =>
          createMember({ userId: user.id, roleId: role.id })
        }
        project={projectData}
        roles={rolesData.roles}
        close={close}
        isOpen={isOpen}
      />
    ));
  };
  const openUpdateMemberFormDialog = (id: number, member: Member) => {
    if (!projectData || !rolesData) return;
    overlay.open(({ close, isOpen }) => (
      <MemberFormDialog
        close={close}
        isOpen={isOpen}
        data={member}
        onSubmit={async (newMember) => {
          await updateMember({ memberId: id, roleId: newMember.role.id });
        }}
        onClickDelete={async () => {
          await deleteMember({ memberId: id });
        }}
        project={projectData}
        roles={rolesData.roles}
        members={memberData?.members ?? []}
        deleteDisabled={!perms.includes('project_member_delete')}
        updateDisabled={!perms.includes('project_member_update')}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('project-setting-menu.member-mgmt')}
      action={
        <>
          <Button
            iconL="RiExchange2Fill"
            variant="outline"
            onClick={() =>
              router.push({
                pathname: '/main/project/[projectId]/settings',
                query: { projectId, menu: 'member', submenu: 'role' },
              })
            }
          >
            {t('project-setting-menu.role-mgmt')}
          </Button>
          <Button
            disabled={!perms.includes('project_member_create')}
            onClick={openCreateMemberDialog}
          >
            {t('v2.button.name.register', { name: 'Member' })}
          </Button>
        </>
      }
    >
      <MemberTable
        isLoading={isPending}
        data={memberData?.members ?? []}
        onClickRow={openUpdateMemberFormDialog}
        createButton={
          <Button
            disabled={!perms.includes('project_member_create')}
            onClick={openCreateMemberDialog}
          >
            {t('v2.button.register')}
          </Button>
        }
      />
    </SettingTemplate>
  );
};

export default MemberSetting;
