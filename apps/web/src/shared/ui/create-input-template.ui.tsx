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
import { useTranslation } from 'react-i18next';

import { cn } from '../utils';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  title: React.ReactNode;
  currentStep: number;
  lastStep: number;
  validate?: () => Promise<boolean> | boolean;
  disableNextBtn?: boolean;

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
    currentStep,
    lastStep,
    validate,
    disableNextBtn,
  } = props;

  const { t } = useTranslation();

  const isLastStep = currentStep === lastStep;

  return (
    <div className="border-fill-secondary flex flex-1 flex-col gap-6 overflow-auto rounded border p-6">
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="font-20-bold">{title}</h1>
          {actionButton}
        </div>
        <hr className="border-fill-secondary" />
        <div className="flex flex-1 flex-col gap-5">{children}</div>
      </div>
      <div className="flex justify-end gap-2">
        {currentStep !== 0 && (
          <button
            className="btn btn-lg btn-secondary w-[120px]"
            onClick={onPrev}
          >
            {t('button.previous')}
          </button>
        )}
        <button
          className={cn([
            'btn btn-lg w-[120px]',
            isLastStep ? 'btn-blue' : 'btn-primary',
          ])}
          onClick={async () => {
            if (validate && !(await validate())) return;
            if (isLastStep) return onComplete();
            onNext();
          }}
          disabled={disableNextBtn}
        >
          {isLastStep ? t('button.complete') : t('button.next')}
        </button>
      </div>
    </div>
  );
};

export default CreateInputTemplate;
