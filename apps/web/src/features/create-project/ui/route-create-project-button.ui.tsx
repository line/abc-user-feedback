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
  CREATE_PROJECT_COMPLETE_STEP_INDEX_KEY,
  CREATE_PROJECT_CURRENT_STEP_KEY,
  CREATE_PROJECT_INPUT_KEY,
  Path,
} from '@/shared';
import { useUserStore } from '@/entities/user';

import { CREATE_PROJEC_STEP_KEY_LIST } from '../create-project-type';

import { useLocalStorage } from '@/hooks';

interface IProps {
  hasProject?: boolean;
}

const RouteCreateProjectButton: React.FC<IProps> = ({ hasProject }) => {
  const { t } = useTranslation();

  const [step] = useLocalStorage(CREATE_PROJECT_COMPLETE_STEP_INDEX_KEY, 0);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { user } = useUserStore();

  const goToCreateProjectPage = () => router.push(Path.CREATE_PROJECT);

  return (
    <>
      <Tooltip open={!hasProject || step > 0} placement="bottom">
        <TooltipTrigger asChild>
          <button
            className="btn btn-lg btn-primary w-[200px] gap-2"
            onClick={() => {
              if (step > 0) setOpen(true);
              else goToCreateProjectPage();
            }}
            disabled={user?.type !== 'SUPER'}
          >
            <Icon name="Plus" className="text-inverse" />
            {t('main.index.create-project')}
          </button>
        </TooltipTrigger>
        <TooltipContent color={step > 0 ? 'red' : 'blue'}>
          {step > 0 ?
            <>
              {t('text.create-project-in-progress')}{' '}
              <b>
                ({step + 1}/{CREATE_PROJEC_STEP_KEY_LIST.length})
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
            onClick: () => goToCreateProjectPage(),
          }}
          cancelButton={{
            children: t('dialog.continue.button.restart'),
            onClick: () => {
              localStorage.removeItem(CREATE_PROJECT_INPUT_KEY);
              localStorage.removeItem(CREATE_PROJECT_CURRENT_STEP_KEY);
              localStorage.removeItem(CREATE_PROJECT_COMPLETE_STEP_INDEX_KEY);
              goToCreateProjectPage();
            },
          }}
        />
      </Popover>
    </>
  );
};

export default RouteCreateProjectButton;
