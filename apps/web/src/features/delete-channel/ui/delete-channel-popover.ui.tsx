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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Popover,
  PopoverModalContent,
  PopoverTrigger,
  TextInput,
} from '@ufb/ui';

import { usePermissions } from '@/shared';
import type { Channel } from '@/entities/channel';

interface IProps {
  projectId: number;
  channel: Channel;
  onClickDelete: (channelId: number) => void;
}

const DeleteChannelPopover: React.FC<IProps> = (props) => {
  const { channel, onClickDelete, projectId } = props;
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const [open, setOpen] = useState(false);
  const [inputChannelName, setInputChannelName] = useState('');

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="btn btn-md btn-primary min-w-[120px]"
        onClick={() => setOpen(true)}
        disabled={!perms.includes('channel_delete')}
      >
        {t('button.delete')}
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.delete-channel.title')}
        description={t('main.setting.dialog.delete-channel.description')}
        cancelButton={{ children: t('button.cancel') }}
        icon={{
          name: 'WarningTriangleFill',
          className: 'text-red-primary',
          size: 56,
        }}
        submitButton={{
          children: t('button.delete'),
          disabled: inputChannelName !== channel.name,
          className: 'btn-red',
          onClick: () => onClickDelete(channel.id),
        }}
      >
        <p className="font-16-bold mb-3 text-center">{channel.name}</p>
        <TextInput
          placeholder={t('input.placeholder.input')}
          onChange={(e) => setInputChannelName(e.target.value)}
        />
      </PopoverModalContent>
    </Popover>
  );
};

export default DeleteChannelPopover;
