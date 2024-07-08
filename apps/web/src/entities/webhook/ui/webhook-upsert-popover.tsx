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

import { webhookInputSchema } from '../webhook.schema';
import type { Webhook, WebhookInput } from '../webhook.type';
import WebhookForm from './webhook-form.ui';

interface IProps {
  projectId: number;
  webhook?: Webhook;
  onClickUpdate?: (webhookId: number, input: WebhookInput) => void;
  onClickCreate?: (input: WebhookInput) => void;
}

const WebhookUpsertPopover: React.FC<IProps> = (props) => {
  const { projectId, webhook, onClickCreate, onClickUpdate } = props;

  const isCreating = !webhook;

  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const [open, setOpen] = useState(false);

  const methods = useForm<WebhookInput>({
    resolver: zodResolver(webhookInputSchema),
    defaultValues: {
      status: 'ACTIVE',
      events: [
        { type: 'FEEDBACK_CREATION', channelIds: [], status: 'INACTIVE' },
        { type: 'ISSUE_ADDITION', channelIds: [], status: 'INACTIVE' },
        { type: 'ISSUE_STATUS_CHANGE', channelIds: [], status: 'INACTIVE' },
        { type: 'ISSUE_CREATION', channelIds: [], status: 'INACTIVE' },
      ],
    },
  });

  useEffect(() => {
    methods.reset(
      convertDefatulValuesToFormValues(webhook) ?? {
        status: 'ACTIVE',
        events: [
          { type: 'FEEDBACK_CREATION', channelIds: [], status: 'INACTIVE' },
          { type: 'ISSUE_ADDITION', channelIds: [], status: 'INACTIVE' },
          { type: 'ISSUE_STATUS_CHANGE', channelIds: [], status: 'INACTIVE' },
          { type: 'ISSUE_CREATION', channelIds: [], status: 'INACTIVE' },
        ],
      },
    );
  }, [open, webhook]);

  const onSubmit = (data: WebhookInput) => {
    isCreating ?
      onClickCreate?.({ ...data, status: 'ACTIVE' })
    : onClickUpdate?.(webhook.id, {
        ...data,
        status: webhook.status,
      });
  };

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        asChild
      >
        {isCreating ?
          <button
            className="btn btn-primary"
            disabled={!perms.includes('project_webhook_create')}
          >
            {t('button.create', { name: 'Webhook' })}
          </button>
        : <button className="icon-btn icon-btn-sm icon-btn-tertiary">
            <Icon name="EditFill" />
          </button>
        }
      </PopoverTrigger>
      <PopoverModalContent
        title={t(
          isCreating ?
            'dialog.create-webhook.title'
          : 'dialog.update-webhook.title',
        )}
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

const convertDefatulValuesToFormValues = (defaultValues?: Webhook) => {
  if (!defaultValues) return undefined;
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

export default WebhookUpsertPopover;
