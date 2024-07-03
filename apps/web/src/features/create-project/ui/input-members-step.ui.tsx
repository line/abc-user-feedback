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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Input, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import type { Member } from '@/entities/member';
import { MemberTable } from '@/entities/member';
import type { ProjectInfo } from '@/entities/project';
import type { Role } from '@/entities/role';
import type { User } from '@/entities/user';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

import { SelectBox } from '@/components';
import { useUserSearch } from '@/hooks';

interface IProps {}

const InputMembersStep: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProjectStore();
  const overlay = useOverlay();

  const { t } = useTranslation();
  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const createMember = (user: User, role: Role) => {
    onChangeInput(
      'members',
      input.members.concat({
        id: (input.members[input.members.length - 1]?.id ?? 0) + 1,
        user,
        role,
        createdAt: new Date().toISOString(),
      }),
    );
  };

  const updateMember = (member: Member) => {
    onChangeInput(
      'members',
      input.members.map((m) => (m.id === member.id ? member : m)),
    );
  };

  const deleteMember = (memberId: number) => {
    onChangeInput(
      'members',
      input.members.filter((m) => m.id !== memberId),
    );
  };

  const openInvalidateMemberModal = () => {
    return overlay.open(({ isOpen, close }) => (
      <Popover modal open={isOpen} onOpenChange={() => close()}>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-project.guide.invalid-member')}
          submitButton={{
            children: t('button.confirm'),
            onClick: close,
          }}
        />
      </Popover>
    ));
  };

  const validate = () => {
    if (!userData) return false;
    if (
      !input.members.every((member) =>
        userData.items.some((user) => user.id === member.user.id),
      )
    ) {
      openInvalidateMemberModal();
      return false;
    }
    return true;
  };

  return (
    <CreateProjectInputTemplate
      actionButton={
        <CreateMemberButton
          members={input.members}
          onCreate={createMember}
          project={input.projectInfo}
          roles={input.roles}
        />
      }
      validate={() => validate()}
    >
      <MemberTable
        members={input.members}
        roles={input.roles}
        onDeleteMember={deleteMember}
        onUpdateMember={updateMember}
      />
    </CreateProjectInputTemplate>
  );
};

interface ICreateMemberButtonProps {
  members: Member[];
  onCreate: (user: User, role: Role) => void;
  project: ProjectInfo;
  roles: Role[];
}

const CreateMemberButton: React.FC<ICreateMemberButtonProps> = (props) => {
  const { members, onCreate, project, roles } = props;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<Role>();

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger asChild>
        <button
          className="btn btn-primary btn-md min-w-[120px]"
          onClick={() => setOpen(true)}
        >
          {t('main.setting.button.register-member')}
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.register-member.title')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          type: 'submit',
          form: 'inviteMember',
          children: t('button.confirm'),
          onClick: () => {
            if (!user || !role) return;
            onCreate(user, role);
            setOpen(false);
          },
        }}
      >
        <div className="my-8 flex flex-col gap-5">
          <Input label="Project" value={project.name} disabled />
          <SelectBox
            label="User"
            required
            isSearchable
            options={
              userData?.items
                .filter(
                  (v) => !members.find((member) => member.user.id === v.id),
                )
                .map((v) => ({
                  name: v.name ? `${v.email} (${v.name})` : v.email,
                  id: v.id,
                })) ?? []
            }
            onChange={(v) => {
              const newUser = userData?.items.find((user) => user.id === v?.id);
              if (!newUser) return;
              setUser(newUser);
            }}
            getOptionValue={(option) => String(option.id)}
            getOptionLabel={(option) => option.name}
          />
          <SelectBox
            label="Role"
            required
            options={roles}
            onChange={(v) => {
              const newRole = roles.find((role) => role.name === v?.name);
              if (!newRole) return;
              setRole(newRole);
            }}
            getOptionValue={(option) => String(option.id)}
            getOptionLabel={(option) => option.name}
          />
        </div>
      </PopoverModalContent>
    </Popover>
  );
};

export default InputMembersStep;
