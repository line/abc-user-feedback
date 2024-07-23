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
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { BasicTable } from '@/shared';

import { getWebhookColumns } from '../webhook-column';
import type { Webhook, WebhookInfo } from '../webhook.type';

interface IProps {
  isLoading?: boolean;
  webhooks: Webhook[];
  projectId: number;
  onUpdate: (webhookId: number, webhook: WebhookInfo) => void;
  onDelete: (webhookId: number) => void;
}

const WebhookTable: React.FC<IProps> = (props) => {
  const { isLoading, webhooks, projectId, onDelete, onUpdate } = props;
  const { t } = useTranslation();

  const table = useReactTable({
    columns: getWebhookColumns(projectId, onDelete, onUpdate),
    data: webhooks,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <BasicTable
      isLoading={isLoading}
      table={table}
      emptyComponent={
        <div className="my-32 flex flex-col items-center justify-center gap-3">
          <Icon name="DriverRegisterFill" className="text-tertiary" size={56} />
          <p>{t('main.setting.register-member')}</p>
        </div>
      }
    />
  );
};

export default WebhookTable;
