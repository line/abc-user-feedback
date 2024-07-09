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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import { SelectBox, usePermissions } from '@/shared';
import type { Role } from '@/entities/role';

import type { Member } from '../member.type';

interface IProps {
  roles: Role[];
  member: Member;
  onClickUpdate: (newMember: Member) => void;
}

const UpdateMemberModal: React.FC<IProps> = (props) => {
  const { roles, member, onClickUpdate } = props;

  const perms = usePermissions();

  const { t } = useTranslation();
  const [role, setRole] = useState<Role | null>(
    roles.find((v) => v.id === member.role.id) ?? null,
  );
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        onClick={() => setOpen(true)}
        disabled={!perms.includes('project_member_update')}
      >
        <Icon name="EditFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.edit-member.title')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'ProfileSettingFill',
          className: 'text-orange-primary',
          size: 56,
        }}
        description={t('main.setting.dialog.edit-member.description')}
        submitButton={{
          children: t('button.save'),
          onClick: () => {
            if (!role) return;

            onClickUpdate({ ...member, role });
            setOpen(false);
          },
        }}
      >
        <SelectBox
          label="Role"
          options={roles}
          onChange={(v) => {
            const newRole = roles.find((role) => role.name === v?.name);
            if (!newRole) return;
            setRole(newRole);
          }}
          defaultValue={role}
          isSearchable={false}
          getOptionValue={(option) => String(option.id)}
          getOptionLabel={(option) => option.name}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default UpdateMemberModal;
