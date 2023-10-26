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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { useOAIMutation } from '@/hooks';

interface IProps {
  apiKeyId: number;
  projectId: number;
  refetch: () => void;
  deletedAt: string | null;
  disabled: boolean;
}

const APIKeyEditButton: React.FC<IProps> = (props) => {
  const { apiKeyId, projectId, deletedAt, refetch, disabled } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const [isUsed, setIsUsed] = useState(!deletedAt);

  const { mutate: softDelete, isPending: softDeletePending } = useOAIMutation({
    method: 'delete',
    path: '/api/projects/{projectId}/api-keys/{apiKeyId}/soft',
    pathParams: { apiKeyId, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        handleClose();
        toast.positive({ title: t('toast.inactive') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });
  const { mutate: recover, isPending: recoverPending } = useOAIMutation({
    method: 'delete',
    path: '/api/projects/{projectId}/api-keys/{apiKeyId}/recover',
    pathParams: { apiKeyId, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        handleClose();
        toast.positive({ title: t('toast.active') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (isUsed) recover(undefined);
    else softDelete(undefined);
  };
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="icon-btn icon-btn-tertiary icon-btn-sm"
        onClick={handleOpen}
        disabled={disabled}
      >
        <Icon name="SettingFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.edit-api-key.title')}
        description={t('main.setting.dialog.edit-api-key.description')}
        cancelText={t('button.cancel')}
        icon={{
          name: 'WarningCircleFill',
          className: 'text-orange-primary',
          size: 70,
        }}
        submitButton={{
          children: t('button.save'),
          disabled:
            isUsed === !deletedAt || softDeletePending || recoverPending,
          className: 'btn-primary',
          onClick: () => handleSave(),
        }}
      >
        <p className="input-label">Status</p>
        <div className="flex">
          <label className="radio-label h-[36px]v w-[120px]">
            <input
              type="radio"
              name="radio-type"
              className="radio radio-sm"
              onChange={(e) => setIsUsed(e.target.checked)}
              checked={isUsed}
            />{' '}
            {t('main.setting.api-key-status.active')}
          </label>
          <label className="radio-label h-[36px] w-[120px]">
            <input
              type="radio"
              name="radio-type"
              className="radio radio-sm"
              onChange={(e) => setIsUsed(!e.target.checked)}
              checked={!isUsed}
            />{' '}
            {t('main.setting.api-key-status.inactive')}
          </label>
        </div>
      </PopoverModalContent>
    </Popover>
  );
};

export default APIKeyEditButton;
