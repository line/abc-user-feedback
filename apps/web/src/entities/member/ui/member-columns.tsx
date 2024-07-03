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
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { DescriptionTooltip } from '@/shared';
import type { Role } from '@/entities/role';

import type { Member } from '../member.type';
import DeleteMemberModal from './delete-member-modal.ui';
import UpdateMemberModal from './update-member-modal.ui';

import type { UserType } from '@/types/user.type';

const columnHelper = createColumnHelper<Member>();

export const MemberColumns = (
  users: UserType[],
  roles?: Role[],
  onClickDelete?: (index: number) => void,
  onClickUpdate?: (member: Member) => void,
) => [
  columnHelper.accessor('user.email', {
    header: 'Email',
    enableSorting: false,
    cell: ({ getValue }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation();
      return (
        <>
          {users.some((v) => v.email === getValue()) ?
            getValue()
          : <div className="flex items-center gap-1">
              <span className="text-red-primary">{getValue()}</span>
              <DescriptionTooltip
                color="red"
                description={t('main.create-project.error-member')}
              />
            </div>
          }
        </>
      );
    },
  }),
  columnHelper.accessor('user.name', {
    header: 'Name',
    enableSorting: false,
    cell: ({ getValue }) => ((getValue() ?? '').length > 0 ? getValue() : '-'),
  }),
  columnHelper.accessor('user.department', {
    header: 'Department',
    enableSorting: false,
    cell: ({ getValue }) => ((getValue() ?? '').length > 0 ? getValue() : '-'),
  }),
  columnHelper.accessor('role.name', {
    header: 'Role',
    cell: ({ getValue }) => getValue(),
    enableSorting: false,
  }),
  ...(onClickUpdate && roles ?
    [
      columnHelper.display({
        id: 'edit',
        header: 'Edit',
        cell: ({ row }) => (
          <UpdateMemberModal
            roles={roles}
            member={row.original}
            onClickUpdate={onClickUpdate}
          />
        ),
        size: 75,
      }),
    ]
  : []),
  ...(onClickDelete ?
    [
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: ({ row }) => (
          <DeleteMemberModal
            onClickDelete={() => onClickDelete(row.original.id)}
          />
        ),
        size: 75,
      }),
    ]
  : []),
];
