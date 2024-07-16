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
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { client, useOAIMutation, useOAIQuery, usePermissions } from '@/shared';
import type { PermissionType } from '@/entities/role';
import { CreateRolePopover, RoleTable } from '@/entities/role';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
}

const RoleSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId },
  });

  const { mutateAsync: createRole } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/roles',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        refetch();
        toast.positive({ title: t('toast.add') });
      },
      onError(error) {
        if (!error) return;
        toast.negative({ title: error.message });
      },
    },
  });

  const { mutate: deleteRole } = useMutation({
    mutationFn: async (input: { roleId: number }) => {
      return client.delete({
        path: '/api/admin/projects/{projectId}/roles/{roleId}',
        pathParams: { projectId, roleId: input.roleId },
      });
    },
    async onSuccess() {
      toast.negative({ title: t('toast.delete') });
      refetch();
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
    },
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: async (input: {
      roleId: number;
      name: string;
      permissions: PermissionType[];
    }) => {
      const { name, permissions, roleId } = input;
      return client.put({
        path: '/api/admin/projects/{projectId}/roles/{roleId}',
        pathParams: { projectId, roleId },
        body: { name, permissions },
      });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['/api/admin/users/{userId}/roles'],
      });
      await refetch();
      toast.positive({ title: t('toast.save') });
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
    },
  });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.role-mgmt')}
      action={
        <CreateRolePopover
          onCreate={(name) => createRole({ name, permissions: [] })}
          roles={data?.roles ?? []}
          disabled={!perms.includes('project_role_create')}
        />
      }
    >
      <div className="overflow-auto">
        <RoleTable
          roles={data?.roles ?? []}
          onUpdateRole={async (input) => {
            const { name, permissions, id: roleId } = input;
            const targetRole = data?.roles.find((v) => v.id === roleId);
            if (!targetRole) return;
            updateRole({ name, permissions, roleId });
          }}
          onDeleteRole={(role) => deleteRole({ roleId: role.id })}
        />
      </div>
    </SettingMenuTemplate>
  );
};

export default RoleSetting;
