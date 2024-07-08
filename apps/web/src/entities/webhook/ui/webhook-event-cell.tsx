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
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';

import type { Channel } from '@/entities/channel';

import type { WebhookEventType, WebhookStatus } from '../webhook.type';

const toCamelCase = (str: string) => {
  return str
    .replace(/\b(\w)/g, (_, capture) => capture.toUpperCase())
    .replace(/\s+/g, '');
};

interface IProps {
  webhookStatus: WebhookStatus;
  type: WebhookEventType;
  channels: Channel[];
}

const WebhookEventCell: React.FC<IProps> = (props) => {
  const { channels, type, webhookStatus } = props;
  const { t } = useTranslation();

  if (type === 'ISSUE_CREATION' || type === 'ISSUE_STATUS_CHANGE') {
    return <p>{toCamelCase(t(`text.webhook-type.${type}`))}</p>;
  }

  return (
    <Popover>
      <PopoverTrigger disabled={webhookStatus === 'INACTIVE'}>
        <span
          className={clsx(
            'text-blue-primary font-12-regular cursor-pointer underline',
            { 'text-tertiary': webhookStatus === 'INACTIVE' },
          )}
        >
          {toCamelCase(t(`text.webhook-type.${type}`))}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeading>
          {t('channel-setting-menu.channel-info')}
        </PopoverHeading>
        <div className="m-4 flex min-w-[200px] max-w-[340px] flex-wrap gap-2">
          {channels.map(({ id, name }) => (
            <Badge key={id} type="secondary">
              {name}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WebhookEventCell;
