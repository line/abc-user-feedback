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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Button } from '@ufb/react';
import { toast } from '@ufb/ui';

import {
  client,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import { CreateMemberDialog, MemberTable } from '@/entities/member';

interface IProps {
  projectId: number;
}

const MemberSetting: React.FC<IProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();
  const overlay = useOverlay();

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
        toast.positive({ title: t('toast.save'), iconName: 'MailFill' });
      },
      onError(error) {
        toast.negative({ title: error.message });
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

  const { mutate: deleteMember } = useMutation({
    mutationFn: (input: { memberId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/members/{memberId}',
        pathParams: { projectId, memberId: input.memberId },
      }),
    async onSuccess() {
      await refetch();
      toast.negative({ title: t('toast.delete') });
    },
    onError(error) {
      toast.negative({ title: error.message });
    },
  });
  const { mutate: updateMember } = useMutation({
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
      toast.positive({ title: t('toast.save') });
    },
    onError(error) {
      toast.negative({ title: error.message });
    },
  });

  const openCreateMemberDialog = () => {
    if (!rolesData || !projectData) return;
    overlay.open(({ isOpen, close }) => (
      <CreateMemberDialog
        members={memberData?.members ?? []}
        onCreate={(user, role) =>
          createMember({ userId: user.id, roleId: role.id })
        }
        project={projectData}
        roles={rolesData.roles}
        close={close}
        isOpen={isOpen}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('project-setting-menu.member-mgmt')}
      action={
        <Button
          disabled={!perms.includes('project_member_create')}
          onClick={openCreateMemberDialog}
        >
          {t('v2.button.name.register', { name: 'Member' })}
        </Button>
      }
    >
      <MemberTable
        isLoading={isPending}
        members={memberData?.members ?? []}
        roles={rolesData?.roles ?? []}
        onDeleteMember={(memberId) => deleteMember({ memberId })}
        onUpdateMember={({ id, role }) =>
          updateMember({ memberId: id, roleId: role.id })
        }
        createButton={
          <Button
            className="min-w-[120px]"
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
