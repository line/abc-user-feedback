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
import { Input, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import RoleSettingTable from '../setting-menu/RoleSetting/RoleSettingTable';

interface IProps {}

const InputRole: React.FC<IProps> = () => {
  return (
    <RoleSettingTable
      onDelete={() => {}}
      updateRole={() => {}}
      projectId={1}
      roles={[]}
    />
  );
};

export const CreateRoleButton: React.FC = () => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <button className="btn btn-primary btn-md w-[120px]">Role 생성</button>
      </PopoverTrigger>
      <PopoverModalContent
        cancelText="취소"
        submitButton={{
          children: '확인',
          onClick: () => {},
        }}
        title="Role 생성"
        description="신규 Role의 명칭을 입력해주세요."
        icon={{
          name: 'ShieldPrivacyFill',
          size: 56,
          className: 'text-blue-primary',
        }}
      >
        <Input label="Role Name" placeholder="입력" />
      </PopoverModalContent>
    </Popover>
  );
};

export default InputRole;
