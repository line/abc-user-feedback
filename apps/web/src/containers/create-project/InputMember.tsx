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
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
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

import CreateProjectInputTemplate from './CreateProjectInputTemplate';

import { DescriptionTooltip, SelectBox, TableSortIcon } from '@/components';
import { useCreateProject } from '@/contexts/create-project.context';
import { useUserSearch } from '@/hooks';
import type { InputMemberType } from '@/types/member.type';
import type { InputRoleType } from '@/types/role.type';
import type { UserType } from '@/types/user.type';

const columnHelper = createColumnHelper<InputMemberType>();

const columns = (deleteMember: (index: number) => void, users: UserType[]) => [
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
  columnHelper.accessor('roleId', {
    header: 'Role',
    cell: ({ getValue }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { input } = useCreateProject();
      const role = input.roles.find((role) => role.id === getValue());
      return <>{role?.name}</>;
    },
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Edit',
    cell: ({ row }) => <MemberUpdatePopover member={row.original} />,
    size: 75,
  }),
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: ({ row }) => (
      <MemberDeleteDialog deleteMember={() => deleteMember(row.index)} />
    ),
    size: 75,
  }),
];

const InputMember: React.FC = () => {
  const { t } = useTranslation();
  const { onChangeInput, input } = useCreateProject();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onChangeInput(
      'members',
      input.members.filter((member) =>
        input.roles.some((role) => member.roleId === role.id),
      ),
    );
  }, []);

  const members = useMemo(() => input.members, [input.members]);
  const setMembers = useCallback(
    (members: InputMemberType[]) => onChangeInput('members', members),
    [],
  );
  const deleteMember = useCallback(
    (index: number) => setMembers(members.filter((_, i) => i !== index)),
    [members],
  );

  const { data: userData } = useUserSearch({
    limit: 1000,
    query: { type: 'GENERAL' },
  });
  const validate = () => {
    if (!userData) return false;
    if (
      !members.every((member) =>
        userData.items.some((user) => user.id === member.user.id),
      )
    ) {
      setOpen(true);
      return false;
    }
    return true;
  };

  const table = useReactTable({
    columns: columns(deleteMember, userData?.items ?? []),
    data: members,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <CreateProjectInputTemplate
      validate={validate}
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
          {table.getRowModel().rows.length === 0 ?
            <tr>
              <td colSpan={table.getFlatHeaders().length}>
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
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-project.guide.invalid-member')}
          submitButton={{
            children: t('button.confirm'),
            onClick: () => setOpen(false),
          }}
        />
      </Popover>
    </CreateProjectInputTemplate>
  );
};

const CreateMemberButton: React.FC<{
  members: InputMemberType[];
  onCreate: (input: { roleId: number; user: UserType }) => void;
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
            onCreate({ user, roleId: role.id });
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
            getOptionValue={(option) => String(option.id)}
            getOptionLabel={(option) => option.name}
          />
          <SelectBox
            label="Role"
            required
            options={input.roles}
            onChange={(v) => {
              const newRole = input.roles.find((role) => role.name === v?.name);
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

const MemberDeleteDialog: React.FC<{
  deleteMember: () => void;
}> = ({ deleteMember }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn icon-btn-sm icon-btn-tertiary"
      >
        <Icon name="TrashFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.delete-member.title')}
        description={t('main.setting.dialog.delete-member.description')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'WarningTriangleFill',
          className: 'text-red-primary',
          size: 56,
        }}
        submitButton={{
          className: 'bg-red-primary',
          children: t('button.delete'),
          onClick: () => {
            deleteMember();
            setOpen(false);
          },
        }}
      />
    </Popover>
  );
};

const MemberUpdatePopover: React.FC<{ member: InputMemberType }> = ({
  member,
}) => {
  const { input, onChangeInput } = useCreateProject();
  const roles = useMemo(() => input.roles, [input.roles]);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<InputRoleType | null>(
    roles.find((v) => v.id === member.roleId) ?? null,
  );

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        onClick={() => setOpen((prev) => !prev)}
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
            onChangeInput(
              'members',
              input.members.map((v) =>
                v.user.id === member.user.id ? { ...v, roleId: role.id } : v,
              ),
            );
            member.roleId = role.id;
            setOpen(false);
          },
        }}
      >
        <SelectBox
          label="Role"
          options={input.roles}
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

export default InputMember;
