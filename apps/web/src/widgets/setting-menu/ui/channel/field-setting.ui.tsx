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
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { useOAIMutation, useOAIQuery, usePermissions } from '@/shared';
import type { FieldInfo, FieldStatus } from '@/entities/field';
import {
  FeedbackRequestCodePopover,
  FieldSettingPopover,
  FieldTable,
  PreviewFieldTable,
  sortField,
} from '@/entities/field';

import SettingMenuTemplate from '../setting-menu-template';

const objectsEqual = (o1: Record<string, any>, o2: Record<string, any>) =>
  JSON.stringify(o1) === JSON.stringify(o2);

interface IProps {
  projectId: number;
  channelId: number;
}

const FieldSetting: React.FC<IProps> = ({ channelId, projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const [status, setStatus] = useState<FieldStatus>('ACTIVE');
  const [showPreview, setShowPreview] = useState(false);

  const [currentFields, setCurrentFields] = useState<FieldInfo[]>([]);

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });
  const { mutateAsync } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}/fields',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const isDirty = useMemo(
    () =>
      !(data ? objectsEqual(data.fields.sort(sortField), currentFields) : true),
    [data, currentFields],
  );

  useEffect(() => {
    setCurrentFields(data?.fields ?? []);
  }, [data]);

  const saveFields = async () => {
    await mutateAsync({ fields: currentFields });
  };

  const addField = (input: FieldInfo) => {
    setCurrentFields((v) => v.concat(input).sort(sortField));
  };
  const updateField = (input: { index: number; field: FieldInfo }) => {
    setCurrentFields((prev) =>
      prev.map((v, i) => (i === input.index ? input.field : v)),
    );
  };
  const deleteField = ({ index }: { index: number }) => {
    setCurrentFields((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.field-mgmt')}
      action={
        <div className="flex gap-2">
          <FeedbackRequestCodePopover
            projectId={projectId}
            channelId={channelId}
          />
          <SaveFieldPopover
            onClickSave={saveFields}
            disabled={!isDirty || !perms.includes('channel_field_update')}
          />
        </div>
      }
    >
      <div className="h-[calc(100%-120px)]">
        <div className="mb-4 flex h-1/2 flex-col gap-3">
          <div className="flex justify-between">
            <StatusButtonGroup setStatus={setStatus} status={status} />
            <FieldSettingPopover
              onSave={addField}
              fieldRows={currentFields}
              disabled={!perms.includes('channel_field_update')}
            />
          </div>
          <div className="overflow-auto">
            <FieldTable
              fields={currentFields.filter((v) => v.status === status)}
              onDeleteField={deleteField}
              onModifyField={updateField}
            />
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
              <PreviewFieldTable
                fields={currentFields.filter((v) => v.status === 'ACTIVE')}
              />
            </div>
          : <div className="flex h-full flex-col items-center justify-center rounded border">
              <Icon name="Search" className="text-quaternary mb-2" size={32} />
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
  );
};

interface IStatusButtonGroupProps {
  status: FieldStatus;
  setStatus: (status: FieldStatus) => void;
}

const StatusButtonGroup: React.FC<IStatusButtonGroupProps> = (props) => {
  const { setStatus, status } = props;

  const { t } = useTranslation();
  return (
    <div className="flex gap-2">
      <button
        className={[
          'btn btn-sm btn-rounded min-w-[64px] border',
          status !== 'ACTIVE' ?
            'text-tertiary bg-fill-inverse'
          : 'text-primary bg-fill-quaternary',
        ].join(' ')}
        onClick={() => setStatus('ACTIVE')}
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
        onClick={() => setStatus('INACTIVE')}
      >
        {t('main.setting.field-status.inactive')}
      </button>
    </div>
  );
};

interface ISaveFieldPopoverProps {
  onClickSave: () => Promise<void>;
  disabled: boolean;
}
const SaveFieldPopover: React.FC<ISaveFieldPopoverProps> = (props) => {
  const { onClickSave, disabled } = props;

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="btn btn-primary btn-md"
          disabled={disabled}
          onClick={() => setIsOpen(true)}
        >
          {t('button.save')}
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('modal.save-field.title')}
        description={t('modal.save-field.description')}
        submitButton={{
          children: t('button.save'),
          onClick: async () => {
            await onClickSave();
            setIsOpen(false);
          },
        }}
        cancelButton={{
          children: t('button.cancel'),
          onClick: () => setIsOpen(false),
        }}
      />
    </Popover>
  );
};
export default FieldSetting;
