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
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

import { cn } from '@/shared';
import type { Channel } from '@/entities/channel';

interface Props {
  channels: Channel[];
  checked: boolean;
  onChangeChecked: (checked: boolean) => void;
  eventChannels: Channel[];
  onChangeEventChannels: (channelIds: number[]) => void;
  eventChannelDisabled?: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
}

const WebhookEventCard: React.FC<Props> = (props) => {
  const {
    channels,
    checked,
    onChangeChecked,
    eventChannels,
    onChangeEventChannels,
    eventChannelDisabled,
    title,
    description,
  } = props;

  const { t } = useTranslation();

  const selectedValues = useMemo(
    () => eventChannels.map((v) => String(v.id)),
    [eventChannels],
  );

  const setSelectedValues = (v: string[]) =>
    onChangeEventChannels(v.map((v) => Number(v)));

  return (
    <button
      type="button"
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded border px-3 py-4 text-left',
        {
          'opacity-50': !checked,
          'border-black': checked,
        },
      )}
      onClick={() => onChangeChecked(!checked)}
    >
      <div className="flex-1 flex-shrink-0">
        <p className="text-base-strong">{title}</p>
        <p className="text-base-normal text-neutral-tertiary">{description}</p>
      </div>
      <div
        className="flex-1 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Select
          type="multiple"
          values={
            eventChannelDisabled ?
              channels.map((v) => String(v.id))
            : selectedValues
          }
          onValuesChange={setSelectedValues}
          disabled={!checked || eventChannelDisabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('v2.placeholder.select')} />
          </SelectTrigger>
          <SelectContent>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={String(channel.id)}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </button>
  );
};

export default WebhookEventCard;
