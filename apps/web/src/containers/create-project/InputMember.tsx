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
import { Fragment } from 'react';
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
import type { MemberType } from '../setting-menu/MemberSetting/MemberSetting';

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

const InputMember: React.FC = () => {
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

export const CreateMemberButton: React.FC = () => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <button className="btn btn-primary btn-md w-[120px]">
          Member 생성
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        cancelText="취소"
        submitButton={{
          children: '확인',
          onClick: () => {},
        }}
        title="Member 생성"
        description="신규 Member의 명칭을 입력해주세요."
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

export default InputMember;
