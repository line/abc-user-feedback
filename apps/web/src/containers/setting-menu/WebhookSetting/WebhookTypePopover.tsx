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
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';

import { useChannels } from '@/hooks';
import type { WebhookEventEnum } from '@/types/webhook.type';
import { toCamelCase } from '@/utils/str';

interface IProps {
  type: WebhookEventEnum;
  channelIds: number[] | null;
  projectId: number;
}

const WebhookTypePopover: React.FC<IProps> = (props) => {
  const { channelIds, type, projectId } = props;
  const { t } = useTranslation();
  const { data } = useChannels(projectId);

  return (
    <Popover>
      <PopoverTrigger>
        <span className="text-blue-primary font-12-regular cursor-pointer underline">
          {toCamelCase(t(`text.webhook-type.${type}`))}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeading>
          {t('channel-setting-menu.channel-info')}
        </PopoverHeading>
        <div className="m-4 flex min-w-[200px] max-w-[340px] flex-wrap gap-2">
          {channelIds?.map((id) => (
            <Badge key={id} type="secondary">
              {data?.items.find((v) => v.id === id)?.name}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WebhookTypePopover;
