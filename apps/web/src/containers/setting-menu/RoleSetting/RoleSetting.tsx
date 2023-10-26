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

import { SettingMenuTemplate } from '@/components';
import { useOAIQuery } from '@/hooks';
import client from '@/libs/client';
import type { PermissionType } from '@/types/permission.type';
import AddRoleDialog from './AddRoleDialog';
import RoleSettingTable from './RoleSettingTable';

interface IProps {
  projectId: number;
}

const RoleSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data, refetch } = useOAIQuery({
    path: '/api/projects/{projectId}/roles',
    variables: { projectId },
  });

  const { mutate: deleteRole } = useMutation({
    mutationKey: [
      'delete',
      '/api/projects/{projectId}/roles/{roleId}',
      projectId,
    ],
    mutationFn: async (input: { roleId: number }) => {
      return client.delete({
        path: '/api/projects/{projectId}/roles/{roleId}',
        pathParams: { projectId, roleId: input.roleId },
      });
    },
  });

  const { mutateAsync: updateRole } = useMutation({
    mutationKey: ['put', '/api/projects/{projectId}/roles/{roleId}', projectId],
    mutationFn: async (input: {
      roleId: number;
      name: string;
      permissions: PermissionType[];
    }) => {
      const { name, permissions, roleId } = input;
      return client.put({
        path: '/api/projects/{projectId}/roles/{roleId}',
        pathParams: { projectId, roleId },
        body: { name, permissions },
      });
    },
  });

  return (
    <SettingMenuTemplate
      title={t('main.setting.subtitle.role-mgmt')}
      action={<AddRoleDialog projectId={projectId} refetch={refetch} />}
    >
      <div className="overflow-auto">
        <RoleSettingTable
          roles={data?.roles ?? []}
          onDelete={(roleId) => deleteRole({ roleId })}
          updateRole={async (input) => {
            const { name, permissions, roleId } = input;
            const targetRole = data?.roles.find((v) => v.id === roleId);
            if (!targetRole) return;

            const endtires = Object.entries(permissions) as [
              PermissionType,
              boolean,
            ][];

            const newPermissions = endtires.reduce<PermissionType[]>(
              (prev, [perm, checked]) => {
                if (checked)
                  return prev.includes(perm) ? prev : prev.concat(perm);
                else
                  return prev.includes(perm)
                    ? prev.filter((v) => v !== perm)
                    : prev;
              },
              targetRole.permissions,
            );
            try {
              await updateRole({ name, permissions: newPermissions, roleId });
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
