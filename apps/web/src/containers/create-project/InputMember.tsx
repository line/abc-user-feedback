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
import { Fragment, useCallback, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Input,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
} from '@ufb/ui';

import { SelectBox, TableSortIcon } from '@/components';
import { useCreateProject } from '@/contexts/create-project.context';
import { useUserSearch } from '@/hooks';
import type { InputMemberType } from '@/types/member.type';
import type { InputRoleType } from '@/types/role.type';
import type { UserType } from '@/types/user.type';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

const columnHelper = createColumnHelper<InputMemberType>();
const columns = [
  columnHelper.accessor('user.email', {
    header: 'Email',
    enableSorting: false,
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
  columnHelper.display({
    id: 'edit',
    header: 'Edit',
    cell: () => <div></div>,
    size: 75,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: () => <div></div>,
    size: 75,
  }),
];

const InputMember: React.FC = () => {
  const { onChangeInput, input } = useCreateProject();

  const members = useMemo(() => input.members, [input.members]);
  const setMembers = useCallback(
    (members: InputMemberType[]) => onChangeInput('members', members),
    [],
  );

  const table = useReactTable({
    columns,
    data: members,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <CreateProjectInputTemplate
      actionButton={
        <CreateMemberButton
          members={members}
          onCreate={(input) => setMembers(members.concat(input))}
        />
      }
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
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="my-32 flex flex-col items-center justify-center gap-3">
                  <Icon
                    name="DriverRegisterFill"
                    className="text-tertiary"
                    size={56}
                  />
                  <p>Member를 등록해주세요.</p>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
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
          )}
        </tbody>
      </table>
    </CreateProjectInputTemplate>
  );
};

const CreateMemberButton: React.FC<{
  members: InputMemberType[];
  onCreate: (input: { role: InputRoleType; user: UserType }) => void;
}> = ({ members, onCreate }) => {
  const { input } = useCreateProject();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });

  const [user, setUser] = useState<UserType>();
  const [role, setRole] = useState<InputRoleType>();

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger asChild>
        <button
          className="btn btn-primary btn-md w-[120px]"
          onClick={() => setOpen(true)}
        >
          Member 생성
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.register-member.title')}
        cancelText={t('button.cancel')}
        submitButton={{
          type: 'submit',
          form: 'inviteMember',
          children: t('button.confirm'),
          onClick: () => {
            if (!user || !role) return;
            onCreate({ user, role });
            setOpen(false);
          },
        }}
      >
        <div className="my-8 flex flex-col gap-5">
          <Input label="Project" value={input?.projectInfo?.name} disabled />
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
          />
          <SelectBox
            label="Role"
            required
            options={input?.roles?.map((v, id) => ({ id, ...v })) ?? []}
            onChange={(v) => {
              const newRole = input?.roles?.find(
                (role) => role.name === v?.name,
              );
              if (!newRole) return;
              setRole(newRole);
            }}
          />
        </div>
      </PopoverModalContent>
    </Popover>
  );
};

export default InputMember;
