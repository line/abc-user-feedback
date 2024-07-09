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

import { Icon, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import { usePermissions } from '@/shared';

interface IProps {
  apiKeyId: number;
  deletedAt: string | null;
  onClickUpdate: (type: 'recover' | 'softDelete', apiKeyId: number) => void;
}

const UpdateApiKeyPopover: React.FC<IProps> = (props) => {
  const { apiKeyId, deletedAt, onClickUpdate } = props;

  const perms = usePermissions();

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const [isUsed, setIsUsed] = useState(!deletedAt);

  const handleOpen = () => setOpen(true);

  const handleSave = () => {
    onClickUpdate(isUsed ? 'recover' : 'softDelete', apiKeyId);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="icon-btn icon-btn-tertiary icon-btn-sm"
        onClick={handleOpen}
        disabled={!perms.includes('project_apikey_update')}
      >
        <Icon name="SettingFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.edit-api-key.title')}
        description={t('main.setting.dialog.edit-api-key.description')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'WarningCircleFill',
          className: 'text-orange-primary',
          size: 70,
        }}
        submitButton={{
          children: t('button.save'),
          disabled: isUsed === !deletedAt,
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

export default UpdateApiKeyPopover;
