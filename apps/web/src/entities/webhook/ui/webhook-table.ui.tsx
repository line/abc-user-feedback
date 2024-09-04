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
import { useMemo } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { BasicTable } from '@/shared';

import { getWebhookColumns } from '../webhook-column';
import type { Webhook, WebhookInfo } from '../webhook.type';

interface IProps {
  projectId: number;
  isLoading?: boolean;
  webhooks: Webhook[];
  onUpdate: (webhookId: number, webhook: WebhookInfo) => void;
  createButton: React.ReactNode;
  onClickRow: (row: Webhook) => void;
}

const WebhookTable: React.FC<IProps> = (props) => {
  const { isLoading, webhooks, onUpdate, createButton, onClickRow, projectId } =
    props;
  const { t } = useTranslation();

  const columns = useMemo(
    () => getWebhookColumns(projectId, onUpdate),
    [projectId, onUpdate],
  );

  const table = useReactTable({
    columns,
    data: webhooks,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <BasicTable
      isLoading={isLoading}
      table={table}
      emptyCaption={t('v2.text.no-data.webhook')}
      createButton={createButton}
      onClickRow={onClickRow}
    />
  );
};

export default WebhookTable;
