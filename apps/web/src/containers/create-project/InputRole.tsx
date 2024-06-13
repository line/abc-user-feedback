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
import { useCallback, useMemo } from 'react';

import RoleSettingTable from '../setting-menu/RoleSetting/RoleSettingTable';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

import { CreateRolePopover } from '@/components/popovers';
import { useCreateProject } from '@/contexts/create-project.context';
import type { RoleType } from '@/types/role.type';

interface IProps {}

const InputRole: React.FC<IProps> = () => {
  const { onChangeInput, input } = useCreateProject();

  const roles = useMemo(() => input.roles, [input.roles]);

  const setRoles = useCallback(
    (inputRole: RoleType[]) => onChangeInput('roles', inputRole),
    [onChangeInput, input.members],
  );

  const onCreateRole = (name: string) => {
    setRoles(
      roles.concat({
        id: (roles[roles.length - 1]?.id ?? 0) + 1,
        name,
        permissions: [],
      }),
    );
  };
  const onUpdateRole = (input: RoleType) => {
    setRoles(roles.map((v) => (v.id === input.id ? input : v)));
  };
  const onDeleteRole = (roleId: number) => {
    setRoles(roles.filter((v) => v.id !== roleId));
  };

  return (
    <CreateProjectInputTemplate
      actionButton={<CreateRolePopover onCreate={onCreateRole} roles={roles} />}
      disableNextBtn={roles.length === 0}
    >
      <RoleSettingTable
        onDelete={onDeleteRole}
        updateRole={onUpdateRole}
        roles={roles}
      />
    </CreateProjectInputTemplate>
  );
};

export default InputRole;
