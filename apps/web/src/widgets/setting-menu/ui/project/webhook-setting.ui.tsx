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

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { client, useOAIMutation, useOAIQuery } from '@/shared';
import type { WebhookInfo } from '@/entities/webhook';
import { CreateWebhookPopover, WebhookTable } from '@/entities/webhook';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
}

const WebhookSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data, refetch, isPending } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/webhooks',
    variables: { projectId },
  });

  const { mutate: deleteWebhook } = useMutation({
    mutationFn: (input: { webhookId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/webhooks/{webhookId}',
        pathParams: { projectId, webhookId: input.webhookId },
      }),
    async onSuccess() {
      await refetch();
      toast.positive({ title: t('toast.save') });
    },
    onError(error) {
      toast.negative({ title: error.message });
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
      toast.positive({ title: t('toast.save') });
    },
    onError(error) {
      toast.negative({ title: error.message });
    },
  });

  const { mutateAsync: create, status: createStatus } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/webhooks',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.webhook-integration')}
      action={
        <CreateWebhookPopover
          projectId={projectId}
          onClickCreate={create}
          disabled={createStatus === 'pending'}
        />
      }
    >
      <WebhookTable
        isLoading={isPending}
        projectId={projectId}
        webhooks={data?.items ?? []}
        onDelete={(webhookId) => deleteWebhook({ webhookId })}
        onUpdate={(webhookId, body) => updateWebhook({ webhookId, body })}
      />
    </SettingMenuTemplate>
  );
};

export default WebhookSetting;
