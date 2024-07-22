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
  webhookId: number;
  onClickDelete: (webhookId: number) => void;
}

const DeleteWebhookPopover: React.FC<IProps> = (props) => {
  const { webhookId, onClickDelete } = props;
  const { t } = useTranslation();
  const perms = usePermissions();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        disabled={!perms.includes('project_webhook_delete')}
      >
        <Icon name="TrashFill" />
      </PopoverTrigger>
      <PopoverModalContent
        title={t('dialog.delete-webhook.title')}
        description={t('dialog.delete-webhook.description')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'WarningTriangleFill',
          className: 'text-red-primary',
          size: 56,
        }}
        submitButton={{
          className: 'bg-red-primary',
          children: t('button.delete'),
          onClick: () => onClickDelete(webhookId),
        }}
      />
    </Popover>
  );
};

export default DeleteWebhookPopover;
