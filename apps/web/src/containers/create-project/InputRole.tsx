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

import { Input, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import { useCreateProject } from '@/contexts/create-project.context';
import type { RoleType } from '@/types/role.type';
import RoleSettingTable from '../setting-menu/RoleSetting/RoleSettingTable';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

interface IProps {}

const InputRole: React.FC<IProps> = () => {
  const { onChangeInput, input } = useCreateProject();

  const roles = useMemo(
    () => input?.roles?.map((v, id) => ({ id, ...v })),
    [input?.roles],
  );

  const setRoles = useCallback(
    (input: RoleType[]) => onChangeInput('roles', input),
    [],
  );

  const onCreateRole = (name: string) => {
    setRoles(roles.concat({ id: roles.length + 1, name, permissions: [] }));
  };
  const onUpdateRole = (input: RoleType) => {
    setRoles(roles.map((v) => (v.id === input.id ? input : v)));
  };
  const onDeleteRole = (roleId: number) => {
    setRoles(roles.filter((v) => v.id !== roleId));
  };

  return (
    <CreateProjectInputTemplate
      actionButton={<CreateRoleButton onCreate={onCreateRole} />}
    >
      <RoleSettingTable
        onDelete={onDeleteRole}
        updateRole={onUpdateRole}
        roles={roles}
      />
    </CreateProjectInputTemplate>
  );
};

const CreateRoleButton: React.FC<{
  onCreate: (name: string) => void;
}> = ({ onCreate }) => {
  const [roleName, setRoleName] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="btn btn-primary btn-md w-[120px]"
          onClick={() => setOpen(true)}
        >
          Role 생성
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        cancelText="취소"
        submitButton={{
          children: '확인',
          onClick: () => {
            onCreate(roleName);
            setOpen(false);
          },
        }}
        title="Role 생성"
        description="신규 Role의 명칭을 입력해주세요."
        icon={{
          name: 'ShieldPrivacyFill',
          size: 56,
          className: 'text-blue-primary',
        }}
      >
        <Input
          label="Role Name"
          placeholder="입력"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default InputRole;
