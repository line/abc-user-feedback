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

import { useOAIMutation, usePermissions } from '@/shared';

interface IProps {
  projectId: number;
  webhookId: number;
  refetch: () => Promise<any>;
}

const WebhookDeleteDialog: React.FC<IProps> = (props) => {
  const { projectId, webhookId, refetch } = props;
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/webhooks/{webhookId}',
    pathParams: { projectId, webhookId },
    queryOptions: {
      async onSuccess() {
        toast.negative({ title: t('toast.delete') });
        refetch();
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

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
          disabled: isPending,
          onClick: () => mutate(undefined),
        }}
      />
    </Popover>
  );
};

export default WebhookDeleteDialog;
