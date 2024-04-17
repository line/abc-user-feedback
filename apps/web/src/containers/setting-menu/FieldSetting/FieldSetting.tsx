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
import { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { Trans, useTranslation } from 'next-i18next';

import { Badge, Icon, toast } from '@ufb/ui';

import { SettingMenuTemplate } from '@/components';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIMutation, usePermissions } from '@/hooks';
import client from '@/libs/client';
import type { ChannelType } from '@/types/channel.type';
import type { FieldType } from '@/types/field.type';
import isNotEmptyStr from '@/utils/is-not-empty-string';
import FeedbackRequestPopover from './FeedbackRequestPopover';
import FieldSettingPopover from './FieldSettingPopover';
import OptionInfoPopover from './OptionInfoPopover';
import PreviewTable from './PreviewTable';

export type FieldRowType = Omit<FieldType, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
};

const objectsEqual = (o1: Record<string, any>, o2: Record<string, any>) =>
  JSON.stringify(o1) === JSON.stringify(o2);

const columnHelper = createColumnHelper<FieldRowType>();

const getColumns = (
  modifyField: (input: FieldRowType, index: number) => void,
  deleteField: (index: number) => void,
  fieldRows: FieldRowType[],
  canUpdateField: boolean,
) => [
  columnHelper.accessor('key', {
    header: 'Key',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
    size: 120,
  }),
  columnHelper.accessor('name', {
    header: 'Display Name',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
    size: 150,
  }),
  columnHelper.accessor('format', {
    header: 'Format',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
    size: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue }) => (isNotEmptyStr(getValue()) ? getValue() : '-'),
  }),
  columnHelper.accessor('options', {
    header: 'Options',
    cell: ({ getValue }) => {
      const options = getValue() ?? [];
      return options.length > 0 ? <OptionInfoPopover options={options} /> : '-';
    },
    size: 100,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: ({ getValue }) => {
      const color =
        getValue() === 'API' ? 'blue'
        : getValue() === 'ADMIN' ? 'green'
        : 'black';
      const type =
        getValue() === 'API' ? 'primary'
        : getValue() === 'ADMIN' ? 'primary'
        : 'secondary';
      return (
        <Badge color={color} type={type}>
          {getValue()}
        </Badge>
      );
    },
    size: 100,
  }),
  columnHelper.accessor('createdAt', {
    header: 'CreatedAt',
    cell: ({ getValue }) =>
      isNotEmptyStr(getValue()) ?
        dayjs(getValue()).format(DATE_TIME_FORMAT)
      : '-',
    size: 100,
  }),
  columnHelper.display({
    id: 'delete',
    header: () => <p className="text-center">Delete</p>,
    cell: ({ row }) => (
      <div className="text-center">
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          disabled={
            row.original.type === 'DEFAULT' ||
            !!row.original.createdAt ||
            !canUpdateField
          }
          onClick={() => deleteField(row.index)}
        >
          <Icon name="TrashFill" />
        </button>
      </div>
    ),
    size: 125,
  }),
  columnHelper.display({
    id: 'edit',
    header: () => <p className="text-center">Edit</p>,
    cell: ({ row }) => (
      <div className="text-center">
        <FieldSettingPopover
          onSave={(input) => modifyField(input, row.index)}
          data={row.original}
          disabled={row.original.type === 'DEFAULT' || !canUpdateField}
          fieldRows={fieldRows}
        />
      </div>
    ),
    size: 125,
  }),
];

const fieldSortType = (
  a: FieldType | FieldRowType,
  b: FieldType | FieldRowType,
) => {
  const aNum =
    a.type === 'DEFAULT' ? 1
    : a.type === 'API' ? 2
    : 3;
  const bNum =
    b.type === 'DEFAULT' ? 1
    : b.type === 'API' ? 2
    : 3;
  return aNum - bNum;
};

interface IProps extends React.PropsWithChildren {
  projectId: number;
  channelId: number;
}

const FieldSetting: React.FC<IProps> = ({ projectId, channelId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [rows, setRows] = useState<FieldRowType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [channelData, setChannelData] = useState<ChannelType>();
  const [channelDataLoading, setChannelDataLoading] = useState<boolean>(true);

  const canUpdateField = useMemo(
    () => perms.includes('channel_field_update'),
    [perms],
  );

  const getChannelData = async () => {
    setChannelDataLoading(true);

    const { data } = await client.get({
      path: '/api/admin/projects/{projectId}/channels/{channelId}',
      pathParams: { channelId, projectId },
    });
    setChannelData(data);
    setRows(data.fields.sort(fieldSortType));

    setChannelDataLoading(false);
  };

  useEffect(() => {
    getChannelData();
  }, [channelId]);

  const modifyField = (input: FieldRowType, index: number) => {
    setRows((v) =>
      produce(v, (draft) => {
        draft[index] = input;
      }),
    );
  };

  const deleteField = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    state: { globalFilter: status },
    columns: getColumns(modifyField, deleteField, rows, canUpdateField),
    data: rows,
    enableGlobalFilter: true,
    onGlobalFilterChange: setStatus,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _, value) => row.original.status === value,
  });

  const addField = (input: FieldRowType) => {
    setRows((v) => v.concat(input).sort(fieldSortType));
  };

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/fields',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await getChannelData();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const onSave = () => {
    if (!channelData) return;
    mutate({ ...channelData, fields: rows });
  };

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.field-mgmt')}
      action={
        <div className="flex gap-2">
          <FeedbackRequestPopover projectId={projectId} channelId={channelId} />
          <button
            className="btn btn-primary btn-md min-w-[120px]"
            onClick={() => setShowPreview(true)}
            disabled={showPreview}
          >
            {t('main.setting.field-mgmt.preview')}
          </button>
          <button
            className="btn btn-primary btn-md min-w-[120px]"
            disabled={
              (channelData ?
                objectsEqual(channelData.fields.sort(fieldSortType), rows)
              : true) ||
              !showPreview ||
              !canUpdateField ||
              isPending ||
              channelDataLoading
            }
            onClick={onSave}
          >
            {t('button.save')}
          </button>
        </div>
      }
    >
      <div className="h-[calc(100%-120px)]">
        <div className="mb-4 flex h-1/2 flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <button
                className={[
                  'btn btn-sm btn-rounded min-w-[64px] border',
                  status !== 'ACTIVE' ?
                    'text-tertiary bg-fill-inverse'
                  : 'text-primary bg-fill-quaternary',
                ].join(' ')}
                onClick={() => table.setGlobalFilter('ACTIVE')}
              >
                {t('main.setting.field-status.active')}
              </button>
              <button
                className={[
                  'btn btn-sm btn-rounded min-w-[64px] border',
                  status !== 'INACTIVE' ?
                    'text-tertiary bg-fill-inverse'
                  : 'text-primary bg-fill-quaternary',
                ].join(' ')}
                onClick={() => table.setGlobalFilter('INACTIVE')}
              >
                {t('main.setting.field-status.inactive')}
              </button>
            </div>
            <FieldSettingPopover
              onSave={addField}
              fieldRows={rows}
              disabled={!canUpdateField}
            />
          </div>
          <div className="overflow-auto rounded border">
            <table className="table w-full table-fixed border-hidden">
              <thead>
                <tr>
                  {table.getFlatHeaders().map((header, i) => (
                    <th key={i} style={{ width: header.getSize() }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.index}>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex h-1/2 flex-col gap-3">
          <div>
            <h1 className="font-20-bold">
              {t('main.setting.field-mgmt.preview')}
            </h1>
          </div>
          {showPreview ?
            <div className="overflow-auto">
              <PreviewTable
                fields={rows.filter((v) => v.status === 'ACTIVE')}
              />
            </div>
          : <div className="flex h-full flex-col items-center justify-center rounded border">
              <Icon name="Search" className="text-quaternary mb-2" size={32} />
              <p>
                <Trans
                  i18nKey="main.setting.field-mgmt.preview-description"
                  components={{
                    preview: (
                      <span
                        className="text-blue-primary cursor-pointer underline"
                        onClick={() => setShowPreview(true)}
                      />
                    ),
                  }}
                />
              </p>
              <p className="text-secondary">
                {t('main.setting.field-mgmt.preview-caption')}
              </p>
            </div>
          }
        </div>
      </div>
    </SettingMenuTemplate>
  );
};

export default FieldSetting;
