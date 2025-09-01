/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Icon,
} from '@ufb/react';

import { BasicTable } from '@/shared';
import type { MemberInfo } from '@/entities/member';
import { MemberFormDialog } from '@/entities/member';
import { memberColumns } from '@/entities/member/member-columns';
import { useUserSearch } from '@/entities/user';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputMembersStep: React.FC<IProps> = () => {
  const { input, onChangeInput, jumpStepByKey } = useCreateProjectStore();
  const overlay = useOverlay();

  const { t } = useTranslation();
  const { data: userData } = useUserSearch({
    limit: 1000,
    queries: [{ key: 'type', value: ['GENERAL'], condition: 'IS' }],
  });

  const createMember = (member: MemberInfo) => {
    onChangeInput('members', input.members.concat(member));
  };

  const updateMember = (index: number, newMember: MemberInfo) => {
    onChangeInput(
      'members',
      input.members.map((m, i) => (i === index ? newMember : m)),
    );
  };

  const deleteMember = (index: number) => {
    onChangeInput(
      'members',
      input.members.filter((_, i) => index !== i),
    );
  };

  const openInvalidateMemberModal = () => {
    overlay.open(({ isOpen, close }) => (
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogTitle>{t('text.guide')}</DialogTitle>
          <DialogBody>
            {t('main.create-project.guide.invalid-member')}
          </DialogBody>
          <DialogFooter>
            <DialogClose variant="primary">
              {t('v2.button.confirm')}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

  const openCreateMemberFormDialog = () => {
    overlay.open(({ isOpen, close }) => (
      <MemberFormDialog
        members={input.members}
        onSubmit={({ role, user }) => createMember({ role, user })}
        project={input.projectInfo}
        roles={input.roles}
        close={close}
        isOpen={isOpen}
      />
    ));
  };

  const openUpdateMemberFormDialog = (index: number, member: MemberInfo) => {
    overlay.open(({ close, isOpen }) => (
      <MemberFormDialog
        close={close}
        isOpen={isOpen}
        data={member}
        onSubmit={(newMember) => updateMember(index, newMember)}
        onClickDelete={() => deleteMember(index)}
        project={input.projectInfo}
        roles={input.roles}
        members={input.members}
      />
    ));
  };

  const table = useReactTable({
    columns: memberColumns,
    data: input.members,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <CreateProjectInputTemplate
      validate={validate}
      actionButton={
        <>
          <Button
            variant="outline"
            onClick={() => {
              jumpStepByKey('roles');
            }}
          >
            <Icon name="RiExchange2Fill" />
            {t('v2.project-setting-menu.role-mgmt')}
          </Button>
          <Button onClick={openCreateMemberFormDialog}>
            {t('v2.button.name.register', { name: 'Member' })}
          </Button>
        </>
      }
    >
      <BasicTable table={table} onClickRow={openUpdateMemberFormDialog} />
    </CreateProjectInputTemplate>
  );
};

export default InputMembersStep;
