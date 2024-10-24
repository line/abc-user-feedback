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

import { Path } from '@/shared';
import { useUserStore } from '@/entities/user';

import { useCreateProjectStore } from '../create-project-model';
import { CREATE_PROJECT_STEP_KEY_LIST } from '../create-project-type';

interface IProps {
  hasProject?: boolean;
}

const RouteCreateProjectButton: React.FC<IProps> = ({ hasProject }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { user } = useUserStore();

  const { currentStep, reset, jumpStepByIndex } = useCreateProjectStore();

  return (
    <>
      <Tooltip open={!hasProject || currentStep.index > 0} placement="bottom">
        <TooltipTrigger asChild>
          <button
            className="btn btn-lg btn-primary w-[200px] gap-2"
            onClick={async () => {
              if (currentStep.index > 0) setOpen(true);
              else await router.push(Path.CREATE_PROJECT);
            }}
            disabled={user?.type !== 'SUPER'}
          >
            <Icon name="Plus" className="text-inverse" />
            {t('main.index.create-project')}
          </button>
        </TooltipTrigger>
        <TooltipContent color={currentStep.index > 0 ? 'red' : 'blue'}>
          {currentStep.index > 0 ?
            <>
              {t('text.create-project-in-progress')}{' '}
              <b>
                ({currentStep.index + 1}/{CREATE_PROJECT_STEP_KEY_LIST.length})
              </b>
            </>
          : t('main.index.no-project')}
        </TooltipContent>
      </Tooltip>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverModalContent
          title={t('dialog.continue.title')}
          description={t('dialog.continue.description', { type: 'Project' })}
          submitButton={{
            children: t('dialog.continue.button.continue'),
            className: 'btn-red',
            onClick: async () => {
              jumpStepByIndex(currentStep.index);
              await router.push(Path.CREATE_PROJECT);
            },
          }}
          cancelButton={{
            children: t('dialog.continue.button.restart'),
            onClick: async () => {
              reset();
              await router.push(Path.CREATE_PROJECT);
            },
          }}
        />
      </Popover>
    </>
  );
};

export default RouteCreateProjectButton;
