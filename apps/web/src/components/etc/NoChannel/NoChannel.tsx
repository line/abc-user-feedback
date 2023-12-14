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
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  Icon,
  Popover,
  PopoverModalContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ufb/ui';

import {
  CREATE_CHANNEL_COMPLETE_STEP_INDEX_KEY,
  CREATE_CHANNEL_CURRENT_STEP_KEY,
  CREATE_CHANNEL_INPUT_KEY,
} from '@/constants/local-storage-key';
import { Path } from '@/constants/path';
import { CHANNEL_STEPS } from '@/contexts/create-channel.context';
import { useLocalStorage, usePermissions } from '@/hooks';

interface IProps {
  projectId: number;
}

const NoChannel: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const perms = usePermissions(projectId);

  const [open, setOpen] = useState(false);
  const [step] = useLocalStorage(
    CREATE_CHANNEL_COMPLETE_STEP_INDEX_KEY(projectId),
    0,
  );
  const goToCreateChannel = () =>
    router.push({
      pathname: Path.CREATE_CHANNEL,
      query: { projectId },
    });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Icon name="NoChannelFill" size={56} className="text-tertiary" />
        <p>{t('text.no-channel')}</p>
      </div>
      <Tooltip open={step > 0} placement="bottom">
        <TooltipTrigger asChild>
          <button
            className="btn btn-blue btn-lg w-[200px] gap-2"
            onClick={() => {
              if (step > 0) setOpen(true);
              else goToCreateChannel();
            }}
            disabled={!perms.includes('channel_create')}
          >
            <Icon name="Plus" size={24} className="text-above-primary" />
            {t('main.setting.button.create-channel')}
          </button>
        </TooltipTrigger>
        <TooltipContent color="blue">
          {t('text.create-channel-in-progress')}{' '}
          <b>
            ({step + 1}/{CHANNEL_STEPS.length})
          </b>
        </TooltipContent>
      </Tooltip>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverModalContent
          title={t('dialog.continue.title')}
          description={t('dialog.continue.description', { type: 'Channel' })}
          submitButton={{
            children: t('dialog.continue.button.continue'),
            className: 'btn-red',
            onClick: () => goToCreateChannel(),
          }}
          cancelButton={{
            children: t('dialog.continue.button.restart'),
            onClick: () => {
              localStorage.removeItem(CREATE_CHANNEL_INPUT_KEY(projectId));
              localStorage.removeItem(
                CREATE_CHANNEL_CURRENT_STEP_KEY(projectId),
              );
              localStorage.removeItem(
                CREATE_CHANNEL_COMPLETE_STEP_INDEX_KEY(projectId),
              );
              goToCreateChannel();
            },
          }}
        />
      </Popover>
    </div>
  );
};

export default NoChannel;
