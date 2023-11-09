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
}

export const CreateContext = <
  StepType extends string,
  InputType extends object,
>(
  defaultInput: CreateContextType<StepType, InputType>,
) => createContext<CreateContextType<StepType, InputType>>(defaultInput);

interface IProps<StepType, InputType> {
  steps: readonly StepType[];
  defaultInput: InputType;
  type: 'project' | 'channel';
  projectId?: number;
}

export const CreateProvider = <
  StepType extends string,
  InputType extends object,
>({
  type,
  steps,
  defaultInput,
  projectId,
}: IProps<StepType, InputType>) => {
  const FIRST_STEP = steps[0] as StepType;

  const [input, setInput] = useLocalStorage<InputType>(
    (type === 'project' ? type : `${type} ${projectId}`) + ' input',
    defaultInput,
  );

  const [currentStep, setCurrentStep] = useLocalStorage<StepType>(
    (type === 'project' ? type : `${type} ${projectId}`) + ' currentStep',
    FIRST_STEP,
  );

  const [completeStepIndex, setCompleteStepIndex] = useLocalStorage(
    (type === 'project' ? type : `${type} ${projectId}`) + ' completeStepIndex',
    0,
  );

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(`${type} input`);
    localStorage.removeItem(`${type} currentStep`);
    localStorage.removeItem(`${type} completeStepIndex`);
  }, []);

  const currentStepIndex = useMemo(
    () => steps.indexOf(currentStep!),
    [currentStep],
  );

  const onPrev = useCallback(() => {
    setCurrentStep(steps[steps.indexOf(currentStep!) - 1] ?? FIRST_STEP);
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
    if (completeStepIndex === 0) return;
    const confirmMsg = `${type} 생성 과정에서 나가겠어요?\n나가더라도 나중에 이어서 진행할 수 있습니다.`;

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
    onChangeInput,
    onPrev,
    onNext,
    clearLocalStorage,
    gotoStep,
  };
};
