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

import { Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import { useOAIQuery, usePermissions } from '@/shared';

import { webhookInfoSchema } from '../webhook.schema';
import type { WebhookInfo } from '../webhook.type';
import WebhookForm from './webhook-form.ui';

const defaultValues: WebhookInfo = {
  name: '',
  status: 'ACTIVE',
  url: '',
  token: null,
  events: [
    { type: 'FEEDBACK_CREATION', channelIds: [], status: 'INACTIVE' },
    { type: 'ISSUE_ADDITION', channelIds: [], status: 'INACTIVE' },
    { type: 'ISSUE_STATUS_CHANGE', channelIds: [], status: 'INACTIVE' },
    { type: 'ISSUE_CREATION', channelIds: [], status: 'INACTIVE' },
  ],
};

interface IProps {
  disabled?: boolean;
  projectId: number;
  onClickCreate: (input: WebhookInfo) => unknown;
}

const CreateWebhookPopover: React.FC<IProps> = (props) => {
  const { disabled, projectId, onClickCreate } = props;

  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const [open, setOpen] = useState(false);

  const methods = useForm<WebhookInfo>({
    resolver: zodResolver(webhookInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [open]);

  const onSubmit = async (data: WebhookInfo) => {
    console.log('data: ', data);
    await onClickCreate({ ...data, status: 'ACTIVE' });
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
          className="btn btn-primary"
          disabled={!perms.includes('project_webhook_create') || disabled}
        >
          {t('button.create', { name: 'Webhook' })}
        </button>
      </PopoverTrigger>
      <PopoverModalContent
        title={t('dialog.create-webhook.title')}
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

export default CreateWebhookPopover;
