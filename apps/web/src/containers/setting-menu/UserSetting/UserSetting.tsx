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
import type { RowSelectionState, SortingState } from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Badge, Icon, toast } from '@ufb/ui';

import {
  CheckedTableHead,
  SettingMenuTemplate,
  TableCheckbox,
  TableLoadingRow,
  TablePagination,
  TableSearchInput,
  TableSortIcon,
} from '@/components';
import type { SearchItemType } from '@/components/etc/TableSearchInput';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIMutation, useOAIQuery, useSort, useUserSearch } from '@/hooks';
import isNotEmptyStr from '@/utils/is-not-empty-string';
import UserEditPopover from './UserEditPopover';
import UserInvitationDialog from './UserInvitationDialog';

export type UserDataType = {
  id: number;
  email: string;
  type: 'SUPER' | 'GENERAL';
  name: string;
  department: string | null;
  members: { id: number; role: { name: string; project: { name: string } } }[];
  createdAt: string;
};

const columnHelper = createColumnHelper<UserDataType>();

interface IProps extends React.PropsWithChildren {}

const UserSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<UserDataType[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({});

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: false },
  ]);

  const sort = useSort(sorting) as { createdAt: 'ASC' | 'DESC' };

  const [limit, setLimit] = useState<number>(10);

  const { data, refetch, isLoading } = useUserSearch({
    limit,
    page,
    query,
    order: sort,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (!data) return;
    setRows(data.items);
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <TableCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <TableCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
        enableSorting: false,
      }),
      columnHelper.accessor('email', { header: 'Email', enableSorting: false }),
      columnHelper.accessor('type', { header: 'Type', enableSorting: false }),
      columnHelper.accessor('name', {
        header: 'Name',
        enableSorting: false,
        cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
        enableSorting: false,
      }),
      columnHelper.accessor('members', {
        header: 'Project',
        cell: ({ getValue }) =>
          getValue().length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getValue().map((member) => (
                <Badge key={member.id} type="secondary">
                  {member.role.project.name}
                </Badge>
              ))}
            </div>
          ) : (
            '-'
          ),
        enableSorting: false,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: ({ getValue }) => dayjs(getValue()).format(DATE_TIME_FORMAT),
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'edit',
        header: 'Edit',
        cell: ({ row }) => (
          <UserEditPopover data={row.original} refetch={refetch} />
        ),
        size: 75,
      }),
    ],
    [refetch],
  );

  const table = useReactTable({
    columns,
    data: rows,
    state: { rowSelection, sorting },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    manualSorting: true,
    getRowId: (row) => String(row.id),
  });

  const { mutate } = useOAIMutation({
    method: 'delete',
    path: '/api/users',
    queryOptions: {
      async onSuccess() {
        await refetch();
        table.resetRowSelection();
        toast.negative({ title: t('toast.delete') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const rowSelectionIds = useMemo(
    () => Object.keys(rowSelection).map((v) => +v),
    [rowSelection],
  );

  const { data: projectData } = useOAIQuery({ path: '/api/projects' });

  const searchItems = useMemo(() => {
    return [
      { format: 'text', key: 'email', name: 'Email' },
      { format: 'text', key: 'name', name: 'Name' },
      { format: 'text', key: 'department', name: 'Department' },
      { format: 'date', key: 'createdAt', name: 'Created' },
      {
        format: 'select',
        key: 'type',
        name: 'Type',
        options: [
          { key: 'GENERAL', name: 'GENERAL' },
          { key: 'SUPER', name: 'SUPER' },
        ],
      },
      {
        format: 'select',
        key: 'projectId',
        name: 'Project',
        options: projectData?.items.map((v) => ({ key: v.id, name: v.name })),
      },
    ] as SearchItemType[];
  }, [projectData]);

  return (
    <SettingMenuTemplate
      title={t('tenant-setting-menu.user-mgmt')}
      action={<UserInvitationDialog />}
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-16-regular text-secondary">
            {t('text.search-result')}
            <span className="text-primary ml-2">
              {t('text.number-count', { count: data?.meta.totalItems ?? 0 })}
            </span>
          </p>
          <div className="flex gap-2">
            <TablePagination
              limit={limit}
              nextPage={() => setPage((prev) => prev + 1)}
              prevPage={() => setPage((prev) => prev - 1)}
              setLimit={setLimit}
              disabledNextPage={page >= (data?.meta.totalPages ?? 1)}
              disabledPrevPage={page <= 1}
            />
            <TableSearchInput
              searchItems={searchItems}
              onChangeQuery={setQuery}
            />
          </div>
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              {rowSelectionIds.length > 0 ? (
                <CheckedTableHead
                  headerLength={columns.length}
                  count={rowSelectionIds.length}
                  header={table.getFlatHeaders().find((v) => v.id === 'select')}
                  onClickCancle={table.resetRowSelection}
                  onClickDelete={() => mutate({ ids: rowSelectionIds })}
                />
              ) : (
                table.getFlatHeaders().map((header, i) => (
                  <th key={i} style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <TableSortIcon column={header.column} />
                    )}
                  </th>
                ))
              )}
            </tr>
            {isLoading && <TableLoadingRow colSpan={columns.length} />}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="my-32 flex flex-col items-center justify-center gap-3">
                    <Icon
                      name="WarningTriangleFill"
                      className="text-tertiary"
                      size={56}
                    />
                    <p>No Items.</p>
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
      </div>
    </SettingMenuTemplate>
  );
};

export default UserSetting;
