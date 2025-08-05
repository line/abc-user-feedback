/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { useMutation } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Button, toast } from '@ufb/react';

import {
  client,
  HelpCardDocs,
  SettingAlert,
  SettingTemplate,
  useAllChannels,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { Webhook, WebhookInfo } from '@/entities/webhook';
import { WebhookFormSheet, WebhookTable } from '@/entities/webhook';

interface IProps {
  projectId: number;
}

const WebhookSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const overlay = useOverlay();
  const perms = usePermissions(projectId);

  const { data, refetch, isPending } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/webhooks',
    variables: { projectId, limit: 1000 },
  });

  const { data: channels } = useAllChannels(projectId);

  const { mutateAsync: deleteWebhook } = useMutation({
    mutationFn: (input: { webhookId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/webhooks/{webhookId}',
        pathParams: { projectId, webhookId: input.webhookId },
      }),
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { mutateAsync: updateWebhook } = useMutation({
    mutationFn: (input: { webhookId: number; body: WebhookInfo }) =>
      client.put({
        path: '/api/admin/projects/{projectId}/webhooks/{webhookId}',
        pathParams: { projectId, webhookId: input.webhookId },
        body: input.body,
      }),
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: create } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/webhooks',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const openCreateWebhookSheet = () => {
    overlay.open(({ close, isOpen }) => (
      <WebhookFormSheet
        isOpen={isOpen}
        close={close}
        channels={channels?.items ?? []}
        onSubmit={async (data: WebhookInfo) => {
          await create({ ...data, status: 'ACTIVE' });
          close();
        }}
      />
    ));
  };
  const openUpdateWebhookSheet = (_: number, webhook: Webhook) => {
    overlay.open(({ close, isOpen }) => (
      <WebhookFormSheet
        isOpen={isOpen}
        close={close}
        data={{
          ...webhook,
          events: webhook.events.map((event) => ({
            ...event,
            channelIds: event.channels.map((channel) => channel.id),
          })),
        }}
        channels={channels?.items ?? []}
        onSubmit={async (data: WebhookInfo) => {
          await updateWebhook({ webhookId: webhook.id, body: data });
          close();
        }}
        onClickDelete={async () => {
          await deleteWebhook({ webhookId: webhook.id });
          close();
        }}
        disabledUpdate={!perms.includes('project_webhook_update')}
        disabledDelete={!perms.includes('project_webhook_delete')}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('v2.project-setting-menu.webhook-integration')}
      action={
        <Button
          disabled={!perms.includes('project_webhook_create')}
          onClick={openCreateWebhookSheet}
        >
          {t('v2.button.name.register', { name: 'Webhook' })}
        </Button>
      }
    >
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.webhook" />}
      />
      <WebhookTable
        projectId={projectId}
        isLoading={isPending}
        data={data?.items ?? []}
        onUpdate={(webhookId, body) => updateWebhook({ webhookId, body })}
        createButton={
          <Button
            disabled={!perms.includes('project_webhook_create')}
            onClick={openCreateWebhookSheet}
          >
            {t('v2.button.register')}
          </Button>
        }
        onClickRow={openUpdateWebhookSheet}
      />
    </SettingTemplate>
  );
};

export default WebhookSetting;
