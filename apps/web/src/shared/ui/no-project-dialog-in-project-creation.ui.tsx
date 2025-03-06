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
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@ufb/react';

import { cn } from '../utils';

interface Props {
  isOpen: boolean;
  close: () => void;
}
const STEPS = ['1', '2', '3'] as const;
const NoProjectDialogInProjectCreation = (props: Props) => {
  const { isOpen, close } = props;
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<(typeof STEPS)[number]>(
    STEPS[0],
  );
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent radius="large">
        <DialogTitle>
          {t('v2.dialog.no-project-dialog-in-project-creation-page.title')}
        </DialogTitle>
        <DialogBody className="flex flex-col items-center gap-2">
          <Image
            src={`/assets/images/no-projects-in-project-creation/step${currentStep}.svg`}
            alt=""
            width={240}
            height={240}
          />
          <p>
            {t(
              `v2.dialog.no-project-dialog-in-project-creation-page.step${currentStep}-description`,
            )}
          </p>
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step}
                className={cn(
                  'bg-neutral-secondary h-1 w-8 cursor-pointer rounded-[999px]',
                  {
                    'bg-neutral-inverse': step === currentStep,
                  },
                )}
                onClick={() => setCurrentStep(step)}
              />
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          {STEPS[0] !== currentStep && (
            <Button
              variant="outline"
              onClick={() =>
                setCurrentStep(
                  STEPS[STEPS.indexOf(currentStep) - 1] ?? STEPS[0],
                )
              }
            >
              {t('v2.button.previous')}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() =>
              STEPS.length - 1 === STEPS.indexOf(currentStep) ?
                close()
              : setCurrentStep(
                  STEPS[STEPS.indexOf(currentStep) + 1] ?? STEPS[0],
                )
            }
          >
            {STEPS.length - 1 === STEPS.indexOf(currentStep) ?
              t('v2.button.confirm')
            : t('v2.button.next')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoProjectDialogInProjectCreation;
