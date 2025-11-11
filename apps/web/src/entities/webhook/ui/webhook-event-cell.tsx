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
import { useTranslation } from 'next-i18next';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
  Tag,
} from '@ufb/react';

import { useAllChannels } from '@/shared';
import type { Channel } from '@/entities/channel';

import type { WebhookEventType } from '../webhook.type';

interface IProps {
  type: WebhookEventType;
  channels: Channel[];
  projectId: number;
}

const WebhookEventCell: React.FC<IProps> = (props) => {
  const { channels, type, projectId } = props;
  const { t } = useTranslation();

  const { data } = useAllChannels(projectId);

  return (
    <Dropdown>
      <DropdownTrigger
        onClick={(e) => e.stopPropagation()}
        asChild
        data-state="closed"
      >
        <Tag>
          {t(`text.webhook-type.${type}`)}
          <Icon name="RiInformation2Line" />
        </Tag>
      </DropdownTrigger>
      <DropdownContent onClick={(e) => e.stopPropagation()}>
        {(type === 'ISSUE_CREATION' || type === 'ISSUE_STATUS_CHANGE' ?
          data?.items
        : channels
        )?.map(({ id, name }) => (
          <DropdownItem key={id}>{name}</DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};

export default WebhookEventCell;
