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
import { Fragment, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';

import {
  Icon,
  Input,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
} from '@ufb/ui';

import { TableSortIcon } from '@/components';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import type { MemberType } from '@/containers/setting-menu/MemberSetting/MemberSetting';
import RoleSettingTable from '@/containers/setting-menu/RoleSetting/RoleSettingTable';

const ITEMS = ['info', 'role', 'member', 'apiKey', 'issueTracker'] as const;
type ItemType = (typeof ITEMS)[number];
const STEPPER_TEXT: Record<ItemType, string> = {
  info: 'Project 설정',
  role: 'Role 관리',
  member: 'Member 관리',
  apiKey: 'API Key',
  issueTracker: 'Issue Tracker',
};

const HELP_TEXT: Record<ItemType, string> = {
  info: 'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  role: 'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  apiKey:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  member:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  issueTracker:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
};

const CreatePage: NextPage = () => {
  const [currentIndex, setCurrentIndex] =
    useState<(typeof ITEMS)[number]>('info');

  const Header = () => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={24}
            height={24}
          />
          <Icon name="Title" className="h-[24px] w-[123px]" />
        </div>
        <button className="btn btn-sm btn-secondary min-w-0 gap-1 px-2">
          <Icon name="Out" size={16} />
          <span className="font-12-bold uppercase">나가기</span>
        </button>
      </div>
    );
  };

  const Title = () => {
    return <h1 className="font-24-bold text-center">Project 생성</h1>;
  };

  const Contents = () => {
    return (
      <div className="border-fill-secondary flex flex-1 flex-col overflow-auto rounded border p-6">
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex justify-between">
            <h1 className="font-20-bold">{STEPPER_TEXT[currentIndex]}</h1>
            {currentIndex === 'role' && <CreateRoleButton />}
          </div>
          <hr className="border-fill-secondary" />
          <div className="flex flex-1 flex-col gap-5 overflow-auto">
            {currentIndex === 'info' && <ProjectInfo />}
            {currentIndex === 'role' && <Role />}
            {currentIndex === 'member' && <Member />}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {currentIndex !== 'info' && (
            <button
              className="btn btn-lg btn-secondary w-[120px]"
              onClick={() =>
                setCurrentIndex(
                  ITEMS[ITEMS.indexOf(currentIndex) - 1] ?? 'info',
                )
              }
            >
              이전
            </button>
          )}
          <button
            className="btn btn-lg btn-secondary w-[120px]"
            onClick={() =>
              setCurrentIndex(ITEMS[ITEMS.indexOf(currentIndex) + 1] ?? 'info')
            }
          >
            다음
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="m-auto flex h-screen w-[1040px] flex-col gap-4 pb-6">
      <Header />
      <Title />
      <Stepper currentIndex={currentIndex} />
      <Helper currentIndex={currentIndex} />
      <Contents />
    </div>
  );
};

const Stepper: React.FC<{ currentIndex: ItemType }> = ({ currentIndex }) => {
  return (
    <div className="border-fill-secondary relative flex rounded border px-10 py-4">
      {ITEMS.map((item, i) => (
        <Fragment key={i}>
          <div className="flex flex-col items-center gap-3">
            <div
              className={[
                currentIndex === item
                  ? 'bg-blue-primary text-above-primary'
                  : 'bg-fill-secondary text-secondary',
                'font-16-bold flex h-10 w-10 items-center justify-center rounded-full',
              ].join(' ')}
            >
              {i + 1}
            </div>
            <div className="font-14-bold">{STEPPER_TEXT[item]}</div>
          </div>
          {ITEMS.length - 1 !== i && (
            <div className="border-fill-secondary mt-5 flex-1 border-t-2" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

const Helper: React.FC<{ currentIndex: ItemType }> = ({ currentIndex }) => {
  return (
    <div className="border-fill-secondary rounded border px-6 py-4">
      <h2 className="font-14-bold mb-1">도움말</h2>
      <p className="font-12-regular">{HELP_TEXT[currentIndex]}</p>
    </div>
  );
};

const ProjectInfo: React.FC = () => {
  return (
    <>
      <Input
        label="프로젝트 이름"
        placeholder="프로젝트 이름을 입력해주세요."
      />
      <Input
        label="프로젝트 설명"
        placeholder="프로젝트 설명을 입력해주세요."
      />
    </>
  );
};

const Role: React.FC = () => {
  return (
    <RoleSettingTable
      onDelete={() => {}}
      updateRole={() => {}}
      projectId={1}
      roles={[]}
    />
  );
};

const CreateRoleButton: React.FC = () => {
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

const columnHelper = createColumnHelper<MemberType>();
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
const Member: React.FC = () => {
  const table = useReactTable({
    columns,
    data: [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="table">
      <thead>
        <tr>
          {table.getFlatHeaders().map((header, i) => (
            <th key={i} style={{ width: header.getSize() }}>
              {flexRender(header.column.columnDef.header, header.getContext())}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            </Fragment>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CreatePage;
