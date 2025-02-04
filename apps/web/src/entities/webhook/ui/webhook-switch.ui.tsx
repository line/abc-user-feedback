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

import { Switch } from '@ufb/react';

import { usePermissions } from '@/shared';

import type { Webhook, WebhookInfo } from '../webhook.type';

interface IProps {
  webhook: Webhook;
  onChangeUpdate: (webhookId: number, webhook: WebhookInfo) => void;
}

const WebhookSwitch: React.FC<IProps> = (props) => {
  const { webhook, onChangeUpdate } = props;
  const perms = usePermissions();

  return (
    <Switch
      checked={webhook.status === 'ACTIVE'}
      onClick={(e) => e.stopPropagation()}
      onCheckedChange={(checked) => {
        onChangeUpdate(webhook.id, {
          ...webhook,
          events: webhook.events.map((event) => ({
            ...event,
            channelIds: event.channels.map((channel) => channel.id),
          })),
          status: checked ? 'ACTIVE' : 'INACTIVE',
        });
      }}
      disabled={!perms.includes('project_webhook_update')}
    />
  );
};

export default WebhookSwitch;
