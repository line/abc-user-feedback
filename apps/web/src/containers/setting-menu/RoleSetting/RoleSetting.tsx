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

import RoleSettingTable from './RoleSettingTable';

import { SettingMenuTemplate } from '@/components';
import { CreateRolePopover } from '@/components/popovers';
import client from '@/libs/client';
import type { PermissionType } from '@/types/permission.type';

interface IProps {
  projectId: number;
}

const RoleSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

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
    mutationKey: [
      'delete',
      '/api/admin/projects/{projectId}/roles/{roleId}',
      projectId,
    ],
    mutationFn: async (input: { roleId: number }) => {
      return client.delete({
        path: '/api/admin/projects/{projectId}/roles/{roleId}',
        pathParams: { projectId, roleId: input.roleId },
      });
    },
  });

  const { mutateAsync: updateRole } = useMutation({
    mutationKey: [
      'put',
      '/api/admin/projects/{projectId}/roles/{roleId}',
      projectId,
    ],
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
        <RoleSettingTable
          roles={data?.roles ?? []}
          onDelete={(roleId) => deleteRole({ roleId })}
          updateRole={async (input) => {
            const { name, permissions, id: roleId } = input;
            const targetRole = data?.roles.find((v) => v.id === roleId);
            if (!targetRole) return;

            try {
              await updateRole({ name, permissions, roleId });
              toast.positive({ title: t('toast.save') });
            } catch (error: any) {
              toast.negative({ title: error.message });
            } finally {
              await refetch();
            }
          }}
          projectId={projectId}
        />
      </div>
    </SettingMenuTemplate>
  );
};

export default RoleSetting;
