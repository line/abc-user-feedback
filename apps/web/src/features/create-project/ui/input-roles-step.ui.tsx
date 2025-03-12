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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Button } from '@ufb/react';

import type { PermissionType, Role } from '@/entities/role';
import { RoleFormSheet, RoleTable } from '@/entities/role';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputRolesStep: React.FC<IProps> = () => {
  const { onChangeInput, input, jumpStepByKey } = useCreateProjectStore();
  const overlay = useOverlay();
  const { t } = useTranslation();

  const onCreateRole = (name: string, permissions: PermissionType[]) => {
    onChangeInput(
      'roles',
      input.roles.concat({
        id: (input.roles[input.roles.length - 1]?.id ?? 0) + 1,
        name,
        permissions,
      }),
    );
  };

  const onUpdateRole = (role: Role) => {
    onChangeInput(
      'roles',
      input.roles.map((v) => (v.id === role.id ? role : v)),
    );
  };

  const onDeleteRole = (role: Role) => {
    onChangeInput(
      'roles',
      input.roles.filter((v) => v.id !== role.id),
    );
  };

  const openUpdateRoleSheet = (role: Role) => {
    overlay.open(({ isOpen, close }) => (
      <RoleFormSheet
        isOpen={isOpen}
        close={close}
        data={role}
        rows={input.roles}
        onSubmit={({ name, permissions }) => {
          onUpdateRole({ name, permissions, id: role.id });
          close();
        }}
        onClickDelete={() => {
          onDeleteRole(role);
          close();
        }}
      />
    ));
  };

  const openCreateRoleSheet = () => {
    overlay.open(({ isOpen, close }) => (
      <RoleFormSheet
        isOpen={isOpen}
        close={close}
        rows={input.roles}
        onSubmit={({ name, permissions }) => {
          onCreateRole(name, permissions);
          close();
        }}
      />
    ));
  };

  return (
    <CreateProjectInputTemplate
      onClickBack={() => jumpStepByKey('members')}
      actionButton={
        <Button onClick={openCreateRoleSheet}>
          {t('v2.button.name.create', { name: 'Role' })}
        </Button>
      }
      disableNextBtn={input.roles.length === 0}
      scrollable
    >
      <RoleTable roles={input.roles} onClickRole={openUpdateRoleSheet} />
    </CreateProjectInputTemplate>
  );
};

export default InputRolesStep;
