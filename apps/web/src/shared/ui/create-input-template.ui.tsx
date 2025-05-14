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
  Alert,
  AlertButton,
  AlertContent,
  AlertDescription,
  AlertTextContainer,
  AlertTitle,
  Button,
  Icon,
  ScrollArea,
} from '@ufb/react';

import SettingAlert from './setting-alert.ui';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  title: React.ReactNode;
  currentStepIndex: number;
  lastStep: number;
  validate?: () => Promise<boolean> | boolean;
  disableNextBtn?: boolean;
  helpText?: React.ReactNode;
  onClickBack?: () => void;
  scrollable?: boolean;
  isRequiredStep?: boolean;

  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const CreateInputTemplate: React.FC<IProps> = (props) => {
  const {
    onNext,
    onPrev,
    onComplete,
    actionButton,
    title,
    children,
    currentStepIndex,
    lastStep,
    validate,
    disableNextBtn,
    helpText,
    onClickBack,
    scrollable = false,
    isRequiredStep = false,
  } = props;

  const { t } = useTranslation();

  const isLastStep = currentStepIndex === lastStep;

  return (
    <div className="border-neutral-tertiary flex h-[calc(100vh-96px)] w-full flex-col gap-4 overflow-auto rounded border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-title-h3">
          {onClickBack && (
            <Button variant="ghost" onClick={onClickBack}>
              <Icon name="RiArrowLeftLine" />
            </Button>
          )}
          {title}
        </h3>
        <div className="setting-action-buttons flex items-stretch gap-3">
          {actionButton}
        </div>
      </div>
      {helpText && <SettingAlert description={helpText} />}
      {scrollable ?
        <ScrollArea className="h-full">{children}</ScrollArea>
      : <div className="flex h-full flex-col gap-4">{children}</div>}
      {!onClickBack && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Alert className="w-[calc(100vw-32px)] max-w-[600px] shadow-md">
            <AlertContent>
              <AlertTextContainer>
                <AlertTitle>
                  {`Step ${currentStepIndex + 1} -`} {title}
                </AlertTitle>
                <AlertDescription>
                  {isRequiredStep ?
                    t('v2.text.required-step')
                  : t('v2.text.optional-step')}
                </AlertDescription>
              </AlertTextContainer>
              {currentStepIndex !== 0 && (
                <AlertButton
                  variant="outline"
                  onClick={onPrev}
                  className="min-w-[120px]"
                >
                  {t('button.previous')}
                </AlertButton>
              )}
              <AlertButton
                variant="primary"
                onClick={async () => {
                  if (validate && !(await validate())) return;
                  if (isLastStep) return onComplete();
                  onNext();
                }}
                disabled={disableNextBtn}
                className="min-w-[120px]"
              >
                {isLastStep ? t('button.complete') : t('button.next')}
              </AlertButton>
            </AlertContent>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default CreateInputTemplate;
