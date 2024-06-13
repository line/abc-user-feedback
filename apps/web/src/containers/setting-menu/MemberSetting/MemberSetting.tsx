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
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import MemberDeleteDialog from './MemberDeleteDialog';
import MemberInvitationDialog from './MemberInvitationDialog';
import MemberUpdatePopover from './MemberUpdatePopover';

import {
  SettingMenuTemplate,
  TableLoadingRow,
  TableSortIcon,
} from '@/components';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIQuery, usePermissions, useSort } from '@/hooks';
import type { PermissionType } from '@/types/permission.type';

export type MemberType = {
  id: number;
  user: { id: number; email: string; name: string; department: string };
  role: { id: number; name: string; permissions: PermissionType[] };
  createdAt: string;
};

const columnHelper = createColumnHelper<MemberType>();

interface IProps {
  projectId: number;
}

const MemberSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);

  const [rows, setRows] = useState<MemberType[]>([]);
  const perms = usePermissions(projectId);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: false },
  ]);

  const sort = useSort(sorting) as { createdAt: 'ASC' | 'DESC' };

  const {
    data: memberData,
    refetch,
    isLoading,
  } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/members',
    variables: { projectId, createdAt: sort.createdAt } as any,
  });

  useEffect(() => {
    if (!memberData) return;
    setRows(memberData?.members);
  }, [memberData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('user.email', {
        header: 'Email',
        enableSorting: false,
      }),
      columnHelper.accessor('user.name', {
        header: 'Name',
        enableSorting: false,
        cell: ({ getValue }) =>
          (getValue() ?? '').length > 0 ? getValue() : '-',
      }),
      columnHelper.accessor('user.department', {
        header: 'Department',
        enableSorting: false,
        cell: ({ getValue }) =>
          (getValue() ?? '').length > 0 ? getValue() : '-',
      }),
      columnHelper.accessor('createdAt', {
        header: 'Joined',
        cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
        enableSorting: true,
      }),
      columnHelper.accessor('role.name', {
        header: 'Role',
        cell: ({ getValue }) => getValue(),
        enableSorting: false,
      }),
      columnHelper.display({
        id: 'edit',
        header: 'Edit',
        cell: ({ row }) => (
          <MemberUpdatePopover
            refetch={refetch}
            currentRole={row.original.role}
            projectId={projectId}
            memberId={row.original.id}
            disabled={!perms.includes('project_member_update')}
          />
        ),
        size: 75,
      }),
      columnHelper.display({
        id: 'delete',
        header: 'Delete',
        cell: ({ row }) => (
          <MemberDeleteDialog
            projectId={projectId}
            memberId={row.original.id}
            refetch={refetch}
            disabled={!perms.includes('project_member_delete')}
          />
        ),
        size: 75,
      }),
    ],
    [refetch, projectId, perms],
  );
  const table = useReactTable({
    columns,
    data: rows,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualSorting: true,
    getRowId: (row) => String(row.id),
  });
  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.member-mgmt')}
      actionBtn={{
        children: t('main.setting.button.register-member'),
        onClick: () => setOpenDialog(true),
        disabled: !perms.includes('project_member_create'),
      }}
    >
      <table className="table">
        <thead>
          <tr>
            {table.getFlatHeaders().map((header, i) => (
              <th key={i} style={{ width: header.getSize() }}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.column.getCanSort() && (
                  <TableSortIcon column={header.column} />
                )}
              </th>
            ))}
          </tr>
          {isLoading && <TableLoadingRow colSpan={columns.length} />}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ?
            <tr>
              <td colSpan={columns.length}>
                <div className="my-32 flex flex-col items-center justify-center gap-3">
                  <Icon
                    name="DriverRegisterFill"
                    className="text-tertiary"
                    size={56}
                  />
                  <p>{t('main.setting.register-member')}</p>
                </div>
              </td>
            </tr>
          : table.getRowModel().rows.map((row) => (
              <Fragment key={row.index}>
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`${cell.id} ${cell.row.index}`}
                      className="border-none"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))
          }
        </tbody>
      </table>
      <MemberInvitationDialog
        open={openDialog}
        projectId={projectId}
        refetch={refetch}
        setOpen={setOpenDialog}
      />
    </SettingMenuTemplate>
  );
};

export default MemberSetting;
