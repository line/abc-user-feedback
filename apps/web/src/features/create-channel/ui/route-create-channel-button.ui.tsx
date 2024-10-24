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

import { cn, Path, usePermissions } from '@/shared';

import { useCreateChannelStore } from '../create-channel-model';
import { CREATE_CHANNEL_STEP_KEY_LIST } from '../create-channel-type';

interface IProps {
  projectId: number;
  type: 'primary' | 'blue';
  placement?: 'top' | 'bottom';
}

const RouteCreateChannelButton: React.FC<IProps> = (props) => {
  const { projectId, type, placement } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const perms = usePermissions(projectId);

  const [open, setOpen] = useState(false);
  const { currentStep, reset, jumpStepByIndex } = useCreateChannelStore();

  const goToCreateChannel = () =>
    router.push({ pathname: Path.CREATE_CHANNEL, query: { projectId } });

  return (
    <div className="flex flex-col gap-8">
      {type !== 'primary' && (
        <div className="flex flex-col items-center gap-3">
          <Icon name="NoChannelFill" size={56} className="text-tertiary" />
          <p>{t('text.no-channel')}</p>
        </div>
      )}
      <Tooltip open={currentStep.index > 0} placement={placement ?? 'bottom'}>
        <TooltipTrigger asChild>
          <button
            className={cn([
              'btn btn-lg gap-2',
              type === 'primary' ? 'btn-primary' : 'btn-blue',
            ])}
            onClick={async () => {
              if (currentStep.index > 0) setOpen(true);
              else await goToCreateChannel();
            }}
            disabled={!perms.includes('channel_create')}
          >
            <Icon name="Plus" size={24} className="text-inverse" />
            {t('main.setting.button.create-channel')}
          </button>
        </TooltipTrigger>
        <TooltipContent color="red">
          {t('text.create-channel-in-progress')}{' '}
          <b>
            ({currentStep.index + 1}/{CREATE_CHANNEL_STEP_KEY_LIST.length})
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
            onClick: async () => {
              jumpStepByIndex(currentStep.index);
              await goToCreateChannel();
            },
          }}
          cancelButton={{
            children: t('dialog.continue.button.restart'),
            onClick: async () => {
              reset();
              await goToCreateChannel();
            },
          }}
        />
      </Popover>
    </div>
  );
};

export default RouteCreateChannelButton;
