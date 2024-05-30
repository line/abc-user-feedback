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
import { useRouter } from 'next/router';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { useTranslation } from 'next-i18next';

import { Badge, Icon, Popover, PopoverModalContent, toast } from '@ufb/ui';

import FeedbackRequestPopover from './FeedbackRequestPopover';
import FieldSettingPopover from './FieldSettingPopover';
import OptionInfoPopover from './OptionInfoPopover';
import PreviewTable from './PreviewTable';

import { SettingMenuTemplate } from '@/components';
import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { useOAIMutation, usePermissions } from '@/hooks';
import client from '@/libs/client';
import type { ChannelType } from '@/types/channel.type';
import type { FieldType } from '@/types/field.type';
import { fieldProperty, isDefaultField, sortField } from '@/utils/field-utils';
import isNotEmptyStr from '@/utils/is-not-empty-string';

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
  columnHelper.accessor('property', {
    header: 'Property',
    cell: ({ getValue }) => {
      return <Badge type="secondary">{fieldProperty[getValue()]}</Badge>;
    },
    size: 120,
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
            isDefaultField(row.original) ||
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
          disabled={isDefaultField(row.original) || !canUpdateField}
          fieldRows={fieldRows}
        />
      </div>
    ),
    size: 125,
  }),
];

interface IProps extends React.PropsWithChildren {
  projectId: number;
  channelId: number;
}

const FieldSetting: React.FC<IProps> = ({ projectId, channelId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const router = useRouter();

  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [rows, setRows] = useState<FieldRowType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [openSavePopover, setOpenSavePopover] = useState(false);
  const [channelData, setChannelData] = useState<ChannelType>();
  const [channelDataLoading, setChannelDataLoading] = useState<boolean>(true);

  const canUpdateField = useMemo(
    () => perms.includes('channel_field_update'),
    [perms],
  );
  const isDirty = useMemo(
    () =>
      !(channelData ?
        objectsEqual(channelData.fields.sort(sortField), rows)
      : true),
    [channelData, rows],
  );

  const getChannelData = async () => {
    setChannelDataLoading(true);

    const { data } = await client.get({
      path: '/api/admin/projects/{projectId}/channels/{channelId}',
      pathParams: { channelId, projectId },
    });

    setChannelData(data);
    setRows(data.fields.sort(sortField));

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
    setRows((v) => v.concat(input).sort(sortField));
  };

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/fields',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await getChannelData();
        toast.positive({ title: t('toast.save') });
        setOpenSavePopover(false);
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

  useEffect(() => {
    if (!isDirty) return;

    const confirmMsg = t('system-popup.field-setting-get-out');

    // 닫기, 새로고침
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = confirmMsg;
      return confirmMsg;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Browser 뒤로가기, 나가기 버튼
    const handleBeforeChangeRoute = (url: string) => {
      if (router.pathname !== url && !confirm(confirmMsg)) {
        router.events.emit('routeChangeError');

        throw `사이트 변경 취소`;
      }
    };
    router.events.on('routeChangeStart', handleBeforeChangeRoute);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleBeforeChangeRoute);
    };
  }, [isDirty]);

  return (
    <>
      <SettingMenuTemplate
        title={t('channel-setting-menu.field-mgmt')}
        action={
          <div className="flex gap-2">
            <FeedbackRequestPopover
              projectId={projectId}
              channelId={channelId}
            />
            <button
              className="btn btn-primary btn-md "
              disabled={
                !isDirty || !canUpdateField || isPending || channelDataLoading
              }
              onClick={() => setOpenSavePopover(true)}
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
                          className={clsx('border-none', {
                            'text-secondary': isDefaultField(row.original),
                          })}
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
                <Icon
                  name="Search"
                  className="text-quaternary mb-2"
                  size={32}
                />
                <p className="text-primary font-14-bold">
                  {t('main.setting.field-mgmt.preview-description')}
                </p>
                <p className="text-secondary">
                  {t('main.setting.field-mgmt.preview-caption')}
                </p>
                <button
                  className="btn btn-blue mt-2 min-w-[120px]"
                  onClick={() => setShowPreview(true)}
                >
                  {t('main.setting.field-mgmt.preview')}
                </button>
              </div>
            }
          </div>
        </div>
      </SettingMenuTemplate>
      <Popover modal open={openSavePopover} onOpenChange={setOpenSavePopover}>
        <PopoverModalContent
          title={t('modal.save-field.title')}
          description={t('modal.save-field.description')}
          submitButton={{
            children: t('button.save'),
            onClick: onSave,
          }}
          cancelButton={{
            children: t('button.cancel'),
            onClick: () => setOpenSavePopover(false),
          }}
        />
      </Popover>
    </>
  );
};

export default FieldSetting;
