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
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Icon, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import { useOAIQuery, usePermissions } from '@/shared';

import { webhookInfoSchema } from '../webhook.schema';
import type { Webhook, WebhookInfo } from '../webhook.type';
import WebhookForm from './webhook-form.ui';

interface IProps {
  disabled?: boolean;
  projectId: number;
  webhook: Webhook;
  onClickUpdate: (webhookId: number, input: WebhookInfo) => Promise<any> | any;
}

const UpdateWebhookPopover: React.FC<IProps> = (props) => {
  const { disabled, projectId, webhook, onClickUpdate } = props;

  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const [open, setOpen] = useState(false);

  const methods = useForm<WebhookInfo>({
    resolver: zodResolver(webhookInfoSchema),
  });

  useEffect(() => {
    methods.reset(convertDefatulValuesToFormValues(webhook));
  }, [open, webhook]);

  const onSubmit = async (data: WebhookInfo) => {
    await onClickUpdate(webhook.id, { ...data, status: webhook.status });
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        asChild
      >
        <button
          className="icon-btn icon-btn-sm icon-btn-tertiary"
          disabled={!perms.includes('project_webhook_update') || disabled}
        >
          <Icon name="EditFill" />
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('dialog.update-webhook.title')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          children: t('button.confirm'),
          type: 'submit',
          form: 'webhook',
        }}
        width={560}
      >
        <form id="webhook" onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <WebhookForm channels={data?.items ?? []} />
          </FormProvider>
        </form>
      </PopoverModalContent>
    </Popover>
  );
};

const convertDefatulValuesToFormValues = (defaultValues: Webhook) => {
  return {
    name: defaultValues.name,
    url: defaultValues.url,
    status: defaultValues.status,
    events: defaultValues.events.map((event) => ({
      status: event.status,
      type: event.type,
      channelIds: event.channels.map((channel) => channel.id),
    })),
  };
};

export default UpdateWebhookPopover;
