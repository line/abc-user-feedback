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
import { useMemo } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { BasicTable } from '@/shared';
import type { ProjectInfo } from '@/entities/project';
import type { Role } from '@/entities/role';
import { useUserSearch } from '@/entities/user';

import { getMemberColumns } from '../member-columns';
import type { Member } from '../member.type';
import MemberFormDialog from './member-form-dialog.ui';

interface IProps {
  isLoading?: boolean;
  members: Member[];
  roles: Role[];
  onDeleteMember?: (id: number) => Promise<void> | void;
  onUpdateMember: (newMember: Member) => Promise<void> | void;
  createButton: React.ReactNode;
  project?: ProjectInfo;
}

const MemberTable: React.FC<IProps> = (props) => {
  const {
    isLoading,
    members,
    createButton,
    onDeleteMember,
    onUpdateMember,
    project,
    roles,
  } = props;

  const { t } = useTranslation();
  const overlay = useOverlay();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const columns = useMemo(
    () => getMemberColumns(userData?.items ?? []),
    [userData],
  );

  const table = useReactTable({
    columns,
    data: members,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const openMemberFormDialog = (member: Member) => {
    if (!project) return;
    overlay.open(({ close, isOpen }) => (
      <MemberFormDialog
        close={close}
        isOpen={isOpen}
        data={member}
        onSubmit={async (newMember) => {
          await onUpdateMember({
            role: newMember.role,
            user: newMember.user,
            id: member.id,
            createdAt: member.createdAt,
          });
        }}
        onClickDelete={
          onDeleteMember ? () => onDeleteMember(member.id) : undefined
        }
        project={project}
        roles={roles}
        members={members}
      />
    ));
  };

  return (
    <BasicTable
      table={table}
      isLoading={isLoading}
      emptyCaption={t('v2.text.no-data.member')}
      createButton={createButton}
      classname={members.length === 0 ? 'h-full' : ''}
      onClickRow={(_, row) => openMemberFormDialog(row)}
    />
  );
};

export default MemberTable;
