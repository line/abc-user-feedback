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
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { useOAIMutation, useOAIQuery, usePermissions } from '@/shared';
import { CreateMemberPopover, MemberTable } from '@/entities/member';

import SettingMenuTemplate from '../setting-menu-template';

import client from '@/libs/client';

interface IProps {
  projectId: number;
}

const MemberSetting: React.FC<IProps> = (props) => {
  const { projectId } = props;

  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data: memberData, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/members',
    variables: { projectId, createdAt: 'ASC' },
  });

  const { mutate: createMember } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/members',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: t('toast.save'), iconName: 'MailFill' });
        refetch();
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
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
      toast.negative({ title: t('toast.delete') });
      refetch();
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
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
      toast.positive({ title: t('toast.save') });
      refetch();
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
    },
  });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.member-mgmt')}
      action={
        rolesData &&
        projectData && (
          <CreateMemberPopover
            members={memberData?.members ?? []}
            onCreate={(user, role) =>
              createMember({
                userId: user.id,
                roleId: role.id,
              })
            }
            project={projectData}
            roles={rolesData.roles}
            disabled={!perms.includes('project_member_create')}
          />
        )
      }
    >
      <MemberTable
        members={memberData?.members ?? []}
        roles={rolesData?.roles ?? []}
        onDeleteMember={(memberId) => deleteMember({ memberId })}
        onUpdateMember={({ id, role }) =>
          updateMember({ memberId: id, roleId: role.id })
        }
      />
    </SettingMenuTemplate>
  );
};

export default MemberSetting;
