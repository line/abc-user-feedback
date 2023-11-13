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
import { useCallback, useMemo, useState } from 'react';

import { Popover, PopoverModalContent } from '@ufb/ui';

import { CreateRolePopover } from '@/components/popovers';
import { useCreateProject } from '@/contexts/create-project.context';
import type { RoleType } from '@/types/role.type';
import RoleSettingTable from '../setting-menu/RoleSetting/RoleSettingTable';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

interface IProps {}

const InputRole: React.FC<IProps> = () => {
  const { onChangeInput, input } = useCreateProject();
  const [open, setOpen] = useState(false);

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
      actionButton={<CreateRolePopover onSubmit={onCreateRole} roles={roles} />}
      disableNextBtn={roles.length === 0}
    >
      <RoleSettingTable
        onDelete={onDeleteRole}
        updateRole={onUpdateRole}
        roles={roles}
      />
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverModalContent
          title="안내"
          description="최소 1개 이상의 Role이 등록되어 있어야 합니다."
          submitButton={{
            children: '확인',
            onClick: () => setOpen(false),
          }}
        />
      </Popover>
    </CreateProjectInputTemplate>
  );
};

export default InputRole;
