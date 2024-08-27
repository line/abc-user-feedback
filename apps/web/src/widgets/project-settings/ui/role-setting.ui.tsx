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

import { Button, toast } from '@ufb/react';

import {
  client,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { PermissionType } from '@/entities/role';
import { RoleFormSheet, RoleTable } from '@/entities/role';

interface IProps {
  projectId: number;
  onClickClearMenu: () => void;
}

const RoleSetting: React.FC<IProps> = (props) => {
  const { projectId, onClickClearMenu } = props;
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const queryClient = useQueryClient();
  const overlay = useOverlay();

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
        await refetch();
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: async (input: { roleId: number }) => {
      return client.delete({
        path: '/api/admin/projects/{projectId}/roles/{roleId}',
        pathParams: { projectId, roleId: input.roleId },
      });
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: updateRole } = useMutation({
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
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const openRoleSheet = () => {
    overlay.open(({ isOpen, close }) => (
      <RoleFormSheet
        isOpen={isOpen}
        close={close}
        handleSubmit={async ({ name, permissions }) => {
          await createRole({ name, permissions });
        }}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('project-setting-menu.role-mgmt')}
      onClickBack={onClickClearMenu}
      action={
        <Button
          onClick={openRoleSheet}
          disabled={!perms.includes('project_role_create')}
        >
          {t('v2.button.name.create', { name: 'Role' })}
        </Button>
      }
    >
      <div className="overflow-auto">
        <RoleTable
          roles={data?.roles ?? []}
          onUpdateRole={async (input) => {
            const { name, permissions, id: roleId } = input;
            const targetRole = data?.roles.find((v) => v.id === roleId);
            if (!targetRole) return;
            await updateRole({ name, permissions, roleId });
          }}
          onDeleteRole={async (role) => {
            await deleteRole({ roleId: role.id });
          }}
        />
      </div>
    </SettingTemplate>
  );
};

export default RoleSetting;
