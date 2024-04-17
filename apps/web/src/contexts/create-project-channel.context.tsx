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
import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  CREATE_CHANNEL_COMPLETE_STEP_INDEX_KEY,
  CREATE_CHANNEL_CURRENT_STEP_KEY,
  CREATE_CHANNEL_INPUT_KEY,
  CREATE_PROJECT_COMPLETE_STEP_INDEX_KEY,
  CREATE_PROJECT_CURRENT_STEP_KEY,
  CREATE_PROJECT_INPUT_KEY,
} from '@/constants/local-storage-key';
import { useLocalStorage } from '@/hooks';

type OnChangeInputType<InputType> = (
  key: keyof InputType,
  value: InputType[keyof InputType],
) => void;

interface CreateContextType<StepType extends string, InputType extends object> {
  input: InputType;
  currentStep: StepType;
  currentStepIndex: number;
  completeStepIndex: number;
  onChangeInput: OnChangeInputType<InputType>;
  onPrev: () => void;
  onNext: () => void;
  gotoStep: (step: StepType) => void;
  clearLocalStorage: () => void;
  stepperText: Record<StepType, string>;
}

export const CreateContext = <
  StepType extends string,
  InputType extends object,
>(
  defaultInput: CreateContextType<StepType, InputType>,
) => createContext<CreateContextType<StepType, InputType>>(defaultInput);

interface IProps<StepType extends string, InputType> {
  steps: readonly StepType[];
  defaultInput: InputType;
  type: 'project' | 'channel';
  projectId?: number;
  stepperText: Record<StepType, string>;
}

export const CreateProvider = <
  StepType extends string,
  InputType extends object,
>({
  type,
  steps,
  defaultInput,
  projectId,
  stepperText,
}: IProps<StepType, InputType>) => {
  const { t } = useTranslation();
  const FIRST_STEP = steps[0] as StepType;

  const [input, setInput] = useLocalStorage<InputType>(
    type === 'project' ?
      CREATE_PROJECT_INPUT_KEY
    : CREATE_CHANNEL_INPUT_KEY(projectId),
    defaultInput,
  );

  const [currentStep, setCurrentStep] = useLocalStorage<StepType>(
    type === 'project' ?
      CREATE_PROJECT_CURRENT_STEP_KEY
    : CREATE_CHANNEL_CURRENT_STEP_KEY(projectId),
    FIRST_STEP,
  );

  const [completeStepIndex, setCompleteStepIndex] = useLocalStorage(
    type === 'project' ?
      CREATE_PROJECT_COMPLETE_STEP_INDEX_KEY
    : CREATE_CHANNEL_COMPLETE_STEP_INDEX_KEY(projectId),
    0,
  );

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(
      type === 'project' ?
        CREATE_PROJECT_INPUT_KEY
      : CREATE_CHANNEL_INPUT_KEY(projectId),
    );
    localStorage.removeItem(
      type === 'project' ?
        CREATE_PROJECT_CURRENT_STEP_KEY
      : CREATE_CHANNEL_CURRENT_STEP_KEY(projectId),
    );
    localStorage.removeItem(
      type === 'project' ?
        CREATE_PROJECT_COMPLETE_STEP_INDEX_KEY
      : CREATE_CHANNEL_COMPLETE_STEP_INDEX_KEY(projectId),
    );
  }, [type, projectId]);

  const currentStepIndex = useMemo(
    () => steps.indexOf(currentStep),
    [currentStep],
  );

  const onPrev = useCallback(() => {
    setCurrentStep(steps[steps.indexOf(currentStep) - 1] ?? FIRST_STEP);
  }, [currentStep]);

  const gotoStep = useCallback(
    (step: StepType) => setCurrentStep(step),
    [currentStep],
  );

  const onNext = useCallback(() => {
    const nextStepIndex = steps.indexOf(currentStep) + 1;
    const nextStep = steps[nextStepIndex] ?? FIRST_STEP;

    if (nextStepIndex === steps.length) return;

    setCurrentStep(nextStep);
    if (completeStepIndex < nextStepIndex) {
      setCompleteStepIndex(nextStepIndex);
    }
  }, [currentStep, input]);

  const router = useRouter();

  const onChangeInput: OnChangeInputType<InputType> = (key, value) => {
    setInput({ ...input, [key]: value });
  };

  useEffect(() => {
    if (completeStepIndex === 0) setInput(defaultInput);
    setCurrentStep(steps[completeStepIndex] ?? FIRST_STEP);
  }, []);

  useEffect(() => {
    if (completeStepIndex === 0) return;
    const confirmMsg = t('text.warning-get-out', { type });

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = confirmMsg;
      return confirmMsg;
    };
    // 닫기, 새로고침
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleBeforeChangeRoute = (url: string) => {
      if (url.includes('create-complete')) return;
      if (router.pathname !== url && !confirm(confirmMsg)) {
        router.events.emit('routeChangeError');
        throw `사이트 변경 취소`;
      }
    };
    // Browser 뒤로가기, 나가기 버튼
    router.events.on('routeChangeStart', handleBeforeChangeRoute);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleBeforeChangeRoute);
    };
  }, [completeStepIndex, type]);

  return {
    input,
    completeStepIndex,
    currentStep,
    currentStepIndex,
    stepperText,
    onChangeInput,
    onPrev,
    onNext,
    clearLocalStorage,
    gotoStep,
  };
};
