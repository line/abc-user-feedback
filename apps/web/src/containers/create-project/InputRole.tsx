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
      actionButton={<CreateRoleButton onCreate={onCreateRole} />}
      disableNextBtn={roles.length === 0}
    >
      <RoleSettingTable
        onDelete={onDeleteRole}
        updateRole={onUpdateRole}
        roles={roles}
      />
      {open && (
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
      )}
    </CreateProjectInputTemplate>
  );
};

const defaultInputError = { roleName: '' };

const CreateRoleButton: React.FC<{
  onCreate: (name: string) => void;
}> = ({ onCreate }) => {
  const { input } = useCreateProject();
  const [roleName, setRoleName] = useState('');
  const [inputError, setInputError] = useState(defaultInputError);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const roles = useMemo(() => input.roles, [input.roles]);

  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmitted(false);
  }, [defaultInputError]);

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
            if (roles.find((v) => v.name === roleName)) {
              setInputError({ roleName: '이미 존재하는 이름입니다.' });
              setIsSubmitted(true);
              return;
            }
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
          onChange={(e) => {
            resetError();
            setRoleName(e.target.value);
          }}
          isSubmitted={isSubmitted}
          isValid={!inputError.roleName}
          hint={inputError.roleName}
          maxLength={20}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default InputRole;
