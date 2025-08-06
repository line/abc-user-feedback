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
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import {
  Button,
  Caption,
  TextInput as Input,
  InputField,
  Label,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  TooltipProvider,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import { DeleteDialog, TextInput } from '@/shared';
import type { Channel } from '@/entities/channel';

import { webhookInfoSchema } from '../webhook.schema';
import type {
  WebhookEventType,
  WebhookInfo,
  WebhookStatus,
} from '../webhook.type';
import WebhookEventCard from './webhook-event-card.ui';

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

interface Props extends FormOverlayProps<WebhookInfo> {
  channels: Channel[];
}

const WebhookFormSheet: React.FC<Props> = (props) => {
  const {
    channels,
    close,
    isOpen,
    onSubmit,
    data,
    onClickDelete,
    disabledDelete,
    disabledUpdate,
  } = props;

  const { t } = useTranslation();
  const overlay = useOverlay();

  const {
    register,
    setValue,
    getValues,
    watch,
    formState,
    reset,
    handleSubmit,
  } = useForm<WebhookInfo>({
    defaultValues,
    resolver: zodResolver(webhookInfoSchema),
  });

  useEffect(() => {
    if (!data) {
      reset({
        ...defaultValues,
        events: defaultValues.events.map((event) => ({
          ...event,
          channelIds: channels.map((channel) => channel.id),
        })),
      });
      return;
    }
    reset({
      ...data,
      events: data.events.map((event) => ({
        ...event,
        channelIds:
          (
            event.type === 'ISSUE_CREATION' ||
            event.type === 'ISSUE_STATUS_CHANGE'
          ) ?
            channels.map((channel) => channel.id)
          : event.channelIds,
      })),
    });
  }, [data, channels]);

  const getEventChecked = (type: WebhookEventType) =>
    watch('events').find((e) => e.type === type)?.status === 'ACTIVE';

  const getEventChannels = (type: WebhookEventType) => {
    return channels.filter((channel) =>
      watch('events')
        .find((e) => e.type === type)
        ?.channelIds.includes(channel.id),
    );
  };

  const onChangeEventChannels = (type: WebhookEventType) => (ids: number[]) => {
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
            status: 'INACTIVE' as WebhookStatus,
            channelIds: ids,
          };
        }
        return { ...event, channelIds: ids };
      }),
      { shouldDirty: true },
    );
  };

  const toggleEventType = (type: WebhookEventType) => (checked: boolean) => {
    const status: WebhookStatus = checked ? 'ACTIVE' : 'INACTIVE';

    setValue(
      'events',
      getValues('events').map((event) =>
        event.type === type ?
          event.channelIds.length === 0 && status === 'ACTIVE' ?
            { ...event, channelIds: channels.map((v) => v.id), status }
          : { ...event, status }
        : event,
      ),
      { shouldDirty: true },
    );
  };

  const openDeleteDialog = () => {
    overlay.open(({ close: dialogClose, isOpen }) => (
      <DeleteDialog
        close={dialogClose}
        isOpen={isOpen}
        onClickDelete={async () => {
          await onClickDelete?.();
          dialogClose();
          close();
        }}
      />
    ));
  };

  return (
    <Sheet onOpenChange={close} open={isOpen} modal>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>
            {data ?
              t('v2.text.name.detail', { name: 'Webhook' })
            : t('v2.text.name.register', { name: 'Webhook' })}
          </SheetTitle>
        </SheetHeader>
        <SheetBody asChild>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((webhook) =>
              onSubmit({
                ...webhook,
                events: webhook.events.map((event) => ({
                  ...event,
                  channelIds:
                    (
                      event.type === 'FEEDBACK_CREATION' ||
                      event.type === 'ISSUE_ADDITION'
                    ) ?
                      event.channelIds
                    : [],
                })),
              }),
            )}
            id="webhook"
          >
            <TextInput
              label="Name"
              placeholder={t('v2.placeholder.text')}
              {...register('name')}
              error={formState.errors.name?.message}
              required
            />
            <TextInput
              label="URL"
              placeholder={t('v2.placeholder.text')}
              {...register('url')}
              error={formState.errors.url?.message}
              required
            />
            <InputField>
              <Label>Token</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('v2.placeholder.text-or-generate')}
                  {...register('token')}
                />
                <Button
                  type="button"
                  onClick={() =>
                    setValue('token', window.crypto.randomUUID(), {
                      shouldDirty: true,
                    })
                  }
                  className="!min-w-[84px] flex-shrink-0"
                >
                  {t('button.generate')}
                </Button>
              </div>
              {formState.errors.token?.message && (
                <Caption variant="error">
                  {formState.errors.token.message}
                </Caption>
              )}
            </InputField>
            <div className="flex flex-col gap-2">
              <p className="input-label">Event Trigger</p>
              <TooltipProvider>
                <WebhookEventCard
                  channels={channels}
                  checked={getEventChecked('FEEDBACK_CREATION')}
                  onChangeChecked={toggleEventType('FEEDBACK_CREATION')}
                  eventChannels={getEventChannels('FEEDBACK_CREATION')}
                  onChangeEventChannels={onChangeEventChannels(
                    'FEEDBACK_CREATION',
                  )}
                  title={t('v2.webhook-card.feedback-creation.title')}
                  description={t(
                    'v2.webhook-card.feedback-creation.description',
                  )}
                />
                <WebhookEventCard
                  channels={channels}
                  checked={getEventChecked('ISSUE_ADDITION')}
                  onChangeChecked={toggleEventType('ISSUE_ADDITION')}
                  eventChannels={getEventChannels('ISSUE_ADDITION')}
                  onChangeEventChannels={onChangeEventChannels(
                    'ISSUE_ADDITION',
                  )}
                  title={t('v2.webhook-card.issue-addition.title')}
                  description={t('v2.webhook-card.issue-addition.description')}
                />
                <WebhookEventCard
                  channels={channels}
                  checked={getEventChecked('ISSUE_STATUS_CHANGE')}
                  onChangeChecked={toggleEventType('ISSUE_STATUS_CHANGE')}
                  eventChannels={getEventChannels('ISSUE_STATUS_CHANGE')}
                  onChangeEventChannels={onChangeEventChannels(
                    'ISSUE_STATUS_CHANGE',
                  )}
                  title={t('v2.webhook-card.issue-status-change.title')}
                  description={t(
                    'v2.webhook-card.issue-status-change.description',
                  )}
                  eventChannelDisabled
                />
                <WebhookEventCard
                  channels={channels}
                  checked={getEventChecked('ISSUE_CREATION')}
                  onChangeChecked={toggleEventType('ISSUE_CREATION')}
                  eventChannels={getEventChannels('ISSUE_CREATION')}
                  onChangeEventChannels={onChangeEventChannels(
                    'ISSUE_CREATION',
                  )}
                  title={t('v2.webhook-card.issue-creation.title')}
                  description={t('v2.webhook-card.issue-creation.description')}
                  eventChannelDisabled
                />
              </TooltipProvider>
            </div>
          </form>
        </SheetBody>
        <SheetFooter>
          {onClickDelete && (
            <div className="flex-1">
              <Button
                onClick={openDeleteDialog}
                variant="destructive"
                disabled={disabledDelete}
              >
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          <SheetClose>{t('v2.button.cancel')}</SheetClose>
          <Button
            type="submit"
            form="webhook"
            disabled={!formState.isDirty || disabledUpdate}
          >
            {t('button.confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WebhookFormSheet;
