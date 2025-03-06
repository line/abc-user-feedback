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
import { useTranslation } from 'next-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ufb/react';

import { cn, InfiniteScrollArea } from '@/shared';
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
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-20 w-full cursor-pointer items-center gap-3 rounded border px-3 py-4 text-left',
            {
              'opacity-50': !checked,
              'border-2 border-[#2563EB]': checked,
            },
          )}
          onClick={() => onChangeChecked(!checked)}
        >
          <div className="flex-1">
            <p className="text-base-strong">{title}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              type="multiple"
              values={
                eventChannelDisabled ?
                  channels.map((v) => String(v.id))
                : selectedValues
              }
              onValuesChange={setSelectedValues}
              disabled={!checked}
            >
              <SelectTrigger className="max-w-[250px]">
                <SelectValue placeholder={t('v2.placeholder.select')} />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem
                    key={channel.id}
                    value={String(channel.id)}
                    disabled={!checked || eventChannelDisabled}
                  >
                    {channel.name}
                  </SelectItem>
                ))}
                <InfiniteScrollArea />
              </SelectContent>
            </Select>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{description}</TooltipContent>
    </Tooltip>
  );
};

export default WebhookEventCard;
