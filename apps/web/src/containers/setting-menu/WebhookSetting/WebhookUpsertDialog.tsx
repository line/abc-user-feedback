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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Input,
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { DescriptionTooltip, SelectBox } from '@/components';
import { useOAIMutation, useOAIQuery } from '@/hooks';
import type {
  WebhookEventEnum,
  WebhookStatusEnum,
  WebhookType,
} from '@/types/webhook.type';

interface IWebhookForm {
  name: string;
  url: string;
  events: IWebhookEventForm[];
}

type IWebhookEventForm = {
  status: WebhookStatusEnum;
  type: WebhookEventEnum;
  channelIds: number[];
};

const scheme: Zod.ZodType<IWebhookForm> = z.object({
  name: z.string().max(20),
  url: z.string(),
  events: z.array(
    z.object({
      status: z.enum(['ACTIVE', 'INACTIVE']),
      type: z.enum([
        'FEEDBACK_CREATION',
        'ISSUE_CREATION',
        'ISSUE_STATUS_CHANGE',
        'ISSUE_ADDITION',
      ]),
      channelIds: z.array(z.number()),
    }),
  ),
});
interface IProps extends React.PropsWithChildren {
  projectId: number;
  defaultValues?: WebhookType;
  refetch: () => Promise<any>;
}

const WebhookUpsertDialog: React.FC<IProps> = (props) => {
  const { children, projectId, defaultValues, refetch } = props;
  const isCreating = !defaultValues;

  const { t } = useTranslation();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const [open, setOpen] = useState(false);

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    reset,
    formState,
  } = useForm<IWebhookForm>({
    resolver: zodResolver(scheme),
    defaultValues: {
      events: [
        { type: 'FEEDBACK_CREATION', channelIds: [], status: 'INACTIVE' },
        { type: 'ISSUE_ADDITION', channelIds: [], status: 'INACTIVE' },
        { type: 'ISSUE_STATUS_CHANGE', channelIds: [], status: 'INACTIVE' },
        { type: 'ISSUE_CREATION', channelIds: [], status: 'INACTIVE' },
      ],
    },
  });

  useEffect(() => {
    reset(
      convertDefatulValuesToFormValues(defaultValues) ?? {
        events: [
          { type: 'FEEDBACK_CREATION', channelIds: [], status: 'INACTIVE' },
          { type: 'ISSUE_ADDITION', channelIds: [], status: 'INACTIVE' },
          { type: 'ISSUE_STATUS_CHANGE', channelIds: [], status: 'INACTIVE' },
          { type: 'ISSUE_CREATION', channelIds: [], status: 'INACTIVE' },
        ],
      },
    );
  }, [open, defaultValues]);

  const { mutate: create } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/webhooks',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const { mutate: update } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/webhooks/{webhookId}',
    pathParams: { projectId, webhookId: defaultValues?.id ?? 0 },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
        setOpen(false);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const toggleEventType =
    (type: WebhookEventEnum) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const status: WebhookStatusEnum =
        e.target.checked ? 'ACTIVE' : 'INACTIVE';

      const channelIds =
        (
          status === 'ACTIVE' &&
          (type === 'FEEDBACK_CREATION' || type === 'ISSUE_ADDITION')
        ) ?
          data?.items.map((v) => v.id) ?? []
        : [];

      setValue(
        'events',
        getValues('events').map((event) => {
          if (event.type !== type) return event;
          return event.type === type ? { ...event, status, channelIds } : event;
        }),
      );
    };

  const onSubmit = (data: IWebhookForm) =>
    isCreating ?
      create({ ...data, status: 'ACTIVE' })
    : update({ ...data, status: defaultValues.status });

  const getEventChecked = (type: WebhookEventEnum) =>
    watch('events').find((e) => e.type === type)?.status === 'ACTIVE';

  const getEventChannels = (type: WebhookEventEnum) => {
    const channels = data?.items ?? [];
    return channels.filter((channel) =>
      watch('events')
        .find((e) => e.type === type)
        ?.channelIds?.includes(channel.id),
    );
  };

  const onChangeEventChannels = (type: WebhookEventEnum, ids: number[]) => {
    setValue(
      'events',
      getValues('events').map((event) => {
        if (event.type !== type) return event;
        if (
          ids.length === 0 &&
          (type === 'FEEDBACK_CREATION' || type === 'ISSUE_ADDITION')
        ) {
          return {
            ...event,
            status: 'INACTIVE' as WebhookStatusEnum,
            channelIds: ids,
          };
        }
        return { ...event, channelIds: ids };
      }),
    );
  };

  return (
    <Popover onOpenChange={setOpen} open={open} modal>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        asChild
      >
        {children}
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
        <form
          className="flex flex-col gap-5"
          id="webhook"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Name"
            placeholder={t('placeholder', { name: 'Name' })}
            required
            {...register('name')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={!formState.errors.name}
            hint={formState.errors.name?.message}
          />
          <Input
            label="URL"
            placeholder={t('placeholder', { name: 'URL' })}
            required
            {...register('url')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={!formState.errors.name}
            hint={formState.errors.url?.message}
          />
          <div className="flex flex-col gap-2">
            <p className="input-label">Event</p>
            <div className="flex h-12 items-center">
              <label className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={getEventChecked('FEEDBACK_CREATION')}
                  onChange={toggleEventType('FEEDBACK_CREATION')}
                />
                <p className="ml-2">
                  {t('text.webhook-type.FEEDBACK_CREATION')}
                </p>
                <DescriptionTooltip
                  description={t('tooltip.webhook-feedback-creation')}
                />
              </label>
              {getEventChecked('FEEDBACK_CREATION') && (
                <SelectBox
                  isMulti
                  onChange={(v) =>
                    onChangeEventChannels(
                      'FEEDBACK_CREATION',
                      v.map((v) => v.id),
                    )
                  }
                  value={getEventChannels('FEEDBACK_CREATION')}
                  options={data?.items ?? []}
                  getOptionValue={(option) => String(option.id)}
                  getOptionLabel={(option) => option.name}
                  width={340}
                  height={48}
                />
              )}
            </div>
            <div className="flex h-12 items-center">
              <label className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={getEventChecked('ISSUE_ADDITION')}
                  onChange={toggleEventType('ISSUE_ADDITION')}
                />
                <p className="ml-2">{t('text.webhook-type.ISSUE_ADDITION')}</p>
                <DescriptionTooltip
                  description={t('tooltip.webhook-issue-addition')}
                />
              </label>
              {getEventChecked('ISSUE_ADDITION') && (
                <SelectBox
                  isMulti
                  onChange={(v) =>
                    onChangeEventChannels(
                      'ISSUE_ADDITION',
                      v.map((v) => v.id),
                    )
                  }
                  value={getEventChannels('ISSUE_ADDITION')}
                  options={data?.items ?? []}
                  getOptionValue={(option) => String(option.id)}
                  getOptionLabel={(option) => option.name}
                  classNames={{ container: () => 'w-[340px]' }}
                />
              )}
            </div>
            <div className="flex h-12 items-center">
              <label className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={getEventChecked('ISSUE_STATUS_CHANGE')}
                  onChange={toggleEventType('ISSUE_STATUS_CHANGE')}
                />
                <p className="ml-2">
                  {t('text.webhook-type.ISSUE_STATUS_CHANGE')}
                </p>
                <DescriptionTooltip
                  description={t('tooltip.webhook-issue-status-change')}
                />
              </label>
            </div>
            <div className="flex h-12 items-center">
              <label className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={getEventChecked('ISSUE_CREATION')}
                  onChange={toggleEventType('ISSUE_CREATION')}
                />
                <p className="ml-2">{t('text.webhook-type.ISSUE_CREATION')}</p>
                <DescriptionTooltip
                  description={t('tooltip.webhook-issue-creation')}
                />
              </label>
            </div>
          </div>
        </form>
      </PopoverModalContent>
    </Popover>
  );
};

const convertDefatulValuesToFormValues = (defaultValues?: WebhookType) => {
  if (!defaultValues) return undefined;
  return {
    name: defaultValues.name,
    url: defaultValues.url,
    events: defaultValues.events.map((event) => ({
      status: event.status,
      type: event.type,
      channelIds: event.channels.map((channel) => channel.id),
    })),
  };
};

export default WebhookUpsertDialog;
