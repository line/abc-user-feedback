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
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  TextInput as Input,
  InputCaption,
  InputField,
  InputLabel,
  RadioCard,
  RadioCardGroup,
  RadioGroup,
} from '@ufb/react';

import { DescriptionTooltip, SelectBox, TextInput } from '@/shared';
import type { Channel } from '@/entities/channel';

import type {
  WebhookEventType,
  WebhookInfo,
  WebhookStatus,
} from '../webhook.type';

interface IProps {
  channels: Channel[];
}

const WebhookForm: React.FC<IProps> = (props) => {
  const { channels } = props;

  const { t } = useTranslation();

  const { register, setValue, getValues, watch, formState } =
    useFormContext<WebhookInfo>();

  const getEventChecked = (type: WebhookEventType) =>
    watch('events').find((e) => e.type === type)?.status === 'ACTIVE';

  const getEventChannels = (type: WebhookEventType) => {
    return channels.filter((channel) =>
      watch('events')
        .find((e) => e.type === type)
        ?.channelIds.includes(channel.id),
    );
  };

  const onChangeEventChannels = (type: WebhookEventType, ids: number[]) => {
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
    );
  };

  const toggleEventType =
    (type: WebhookEventType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const status: WebhookStatus = e.target.checked ? 'ACTIVE' : 'INACTIVE';

      const channelIds =
        (
          status === 'ACTIVE' &&
          (type === 'FEEDBACK_CREATION' || type === 'ISSUE_ADDITION')
        ) ?
          channels.map((v) => v.id)
        : [];

      setValue(
        'events',
        getValues('events').map((event) => {
          if (event.type !== type) return event;
          return event.type === type ? { ...event, status, channelIds } : event;
        }),
      );
    };

  return (
    <div className="flex flex-col gap-5">
      <TextInput
        label="Name"
        placeholder={t('placeholder', { name: 'Name' })}
        {...register('name')}
        error={formState.errors.name?.message}
        required
      />
      <TextInput
        label="URL"
        placeholder={t('placeholder', { name: 'URL' })}
        {...register('url')}
        error={formState.errors.url?.message}
        required
      />
      <InputField>
        <InputLabel>Token</InputLabel>
        <div className="flex gap-2">
          <Input
            placeholder={t('placeholder', { name: 'Webhook Token' })}
            {...register('token')}
            error={!!formState.errors.token?.message}
          />
          <Button
            type="button"
            onClick={() => setValue('token', window.crypto.randomUUID())}
            className="flex-shrink-0"
          >
            {t('button.generate')}
          </Button>
        </div>
        {formState.errors.token?.message && (
          <InputCaption variant="error">
            {formState.errors.token.message}
          </InputCaption>
        )}
      </InputField>
      <div className="flex flex-col gap-2">
        <p className="input-label">Event</p>
        <RadioCardGroup orientation="vertical">
          <RadioCard
            value="item-1"
            id="r1"
            icon="RiFlashlightFill"
            title="Title"
            description="Description"
          />
          <RadioCard
            value="item-2"
            id="r2"
            icon="RiFlashlightFill"
            title="Title"
            description="Description"
          />
          <RadioCard
            value="item-3"
            id="r3"
            icon="RiFlashlightFill"
            title="Title"
            description="Description"
          />
        </RadioCardGroup>
        {/* 
        <div className="flex h-12 items-center">
          <label className="flex flex-1 items-center">
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={getEventChecked('FEEDBACK_CREATION')}
              onChange={toggleEventType('FEEDBACK_CREATION')}
            />
            <p className="ml-2">{t('text.webhook-type.FEEDBACK_CREATION')}</p>
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
              options={channels}
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
              options={channels}
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
            <p className="ml-2">{t('text.webhook-type.ISSUE_STATUS_CHANGE')}</p>
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
        </div> */}
      </div>
    </div>
  );
};

export default WebhookForm;
