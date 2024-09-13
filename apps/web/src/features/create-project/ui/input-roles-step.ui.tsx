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
import type { Role } from '@/entities/role';
import { CreateRolePopover, RoleTable } from '@/entities/role';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputRolesStep: React.FC<IProps> = () => {
  const { onChangeInput, input } = useCreateProjectStore();

  const onCreateRole = (name: string) => {
    onChangeInput(
      'roles',
      input.roles.concat({
        id: (input.roles[input.roles.length - 1]?.id ?? 0) + 1,
        name,
        permissions: [],
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

  return (
    <CreateProjectInputTemplate
      actionButton={
        <CreateRolePopover onCreate={onCreateRole} roles={input.roles} />
      }
      disableNextBtn={input.roles.length === 0}
    >
      <RoleTable roles={input.roles} onClickRole={() => {}} />
    </CreateProjectInputTemplate>
  );
};

export default InputRolesStep;
