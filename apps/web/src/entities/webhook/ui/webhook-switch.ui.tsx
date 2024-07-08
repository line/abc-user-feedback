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

import { cn } from '@/shared';

import type { Webhook, WebhookInput } from '../webhook.type';

interface IProps {
  webhook: Webhook;
  onChangeUpdate: (webhookId: number, webhook: WebhookInput) => void;
}

const WebhookSwitch: React.FC<IProps> = (props) => {
  const { webhook, onChangeUpdate } = props;

  return (
    <input
      type="checkbox"
      className={cn('toggle toggle-sm', {
        'border-fill-primary bg-fill-primary': webhook.status === 'INACTIVE',
      })}
      checked={webhook.status === 'ACTIVE'}
      onChange={(e) => {
        onChangeUpdate(webhook.id, {
          ...webhook,
          events: webhook.events.map((event) => ({
            ...event,
            channelIds: event.channels.map((channel) => channel.id),
          })),
          status: e.target.checked ? 'ACTIVE' : 'INACTIVE',
        });
      }}
    />
  );
};

export default WebhookSwitch;
