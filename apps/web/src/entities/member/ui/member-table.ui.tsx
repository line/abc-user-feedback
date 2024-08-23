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
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { BasicTable } from '@/shared';
import type { Role } from '@/entities/role';
import { useUserSearch } from '@/entities/user';

import { getMemberColumns } from '../member-columns';
import type { Member } from '../member.type';

interface IProps {
  isLoading?: boolean;
  members: Member[];
  roles: Role[];
  onDeleteMember?: (id: number) => void;
  onUpdateMember?: (newMember: Member) => void;
  createButton: React.ReactNode;
}

const MemberTable: React.FC<IProps> = (props) => {
  const {
    isLoading,
    members,
    roles,
    createButton,
    onDeleteMember,
    onUpdateMember,
  } = props;
  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const table = useReactTable({
    columns: getMemberColumns(
      userData?.items ?? [],
      roles,
      onDeleteMember,
      onUpdateMember,
    ),
    data: members,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <BasicTable
      table={table}
      isLoading={isLoading}
      emptyCaption={t('v2.text.no-data.member')}
      createButton={createButton}
    />
  );
};

export default MemberTable;
