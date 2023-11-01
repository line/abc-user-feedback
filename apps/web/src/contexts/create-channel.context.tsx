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
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import type { InputChannelInfoType } from '@/types/channel.type';
import type { InputFieldType } from '@/types/field.type';

const DEFAULT_FIELDS: InputFieldType[] = [
  {
    format: 'number',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'ID',
    key: 'id',
    description: '',
  },
  {
    format: 'date',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'Created',
    key: 'createdAt',
    description: '',
  },
  {
    format: 'date',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'Updated',
    key: 'updatedAt',
    description: '',
  },
  {
    format: 'multiSelect',
    type: 'DEFAULT',
    status: 'ACTIVE',
    name: 'Issue',
    key: 'issues',
    description: '',
    options: [],
  },
];

export const CHANNEL_STEPPER_TEXT: Record<ChannelStepType, string> = {
  channelInfo: 'Channel 정보',
  fields: 'Field 관리',
  fieldPreview: 'Field 미리보기',
};

interface InputType {
  channelInfo: InputChannelInfoType;
  fields: InputFieldType[];
  fieldPreview: null;
}
const DEFAULT_INPUT: InputType = {
  channelInfo: { name: '', description: '' },
  fields: DEFAULT_FIELDS,
  fieldPreview: null,
};

export type ChannelStepType = keyof InputType;

export const CHANNEL_STEPS: ChannelStepType[] = [
  'channelInfo',
  'fields',
  'fieldPreview',
];

type OnChangeInputType = <T extends keyof InputType>(
  key: T,
  value: InputType[T],
) => void;

interface CreateChannelContextType {
  input: InputType;
  currentStep: ChannelStepType;
  currentStepIndex: number;
  completeStepIndex: number;
  onChangeInput: OnChangeInputType;
  onPrev: () => void;
  onNext: () => void;
}

export const CreateChannelContext = createContext<CreateChannelContextType>({
  currentStep: 'channelInfo',
  completeStepIndex: 0,
  currentStepIndex: 0,
  input: DEFAULT_INPUT,
  onChangeInput: () => {},
  onPrev: () => {},
  onNext: () => {},
});

export const CreateChannelProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [input, setInput] = useState<InputType>(DEFAULT_INPUT);
  const [currentStep, setCurrentStep] =
    useState<ChannelStepType>('channelInfo');
  const [completeStepIndex, setCompleteStepIndex] = useState(0);

  const currentStepIndex = useMemo(
    () => CHANNEL_STEPS.indexOf(currentStep),
    [currentStep],
  );

  const onPrev = useCallback(() => {
    setCurrentStep(
      CHANNEL_STEPS[CHANNEL_STEPS.indexOf(currentStep) - 1] ?? 'channelInfo',
    );
  }, [currentStep]);

  const onNext = useCallback(() => {
    const nextStepIndex = CHANNEL_STEPS.indexOf(currentStep) + 1;
    const nextStep = CHANNEL_STEPS[nextStepIndex] ?? 'channelInfo';

    if (nextStepIndex === CHANNEL_STEPS.length) {
      alert('완료');
      return;
    }
    setCurrentStep(nextStep);
    if (completeStepIndex < nextStepIndex) {
      setCompleteStepIndex(nextStepIndex);
    }
  }, [currentStep, input]);

  const router = useRouter();

  const onChangeInput: OnChangeInputType = (key, value) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const confirmMsg =
      'Project 생성 과정에서 나가겠어요?\n나가더라도 나중에 이어서 진행할 수 있습니다.';

    // 리로드 전에 메세지 띄워주기
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = confirmMsg;
      return confirmMsg; // Gecko + Webkit, Safari, Chrome
    };

    //라우터 바뀌기 전 이벤트(취소했을경우 넘어가지않음)
    const handleBeforeChangeRoute = (url: string) => {
      if (router.pathname !== url && !confirm(confirmMsg)) {
        router.events.emit('routeChangeError');
        throw `사이트 변경 취소`;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleBeforeChangeRoute);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleBeforeChangeRoute);
    };
  }, []);

  return (
    <CreateChannelContext.Provider
      value={{
        input,
        completeStepIndex,
        currentStep,
        currentStepIndex,
        onChangeInput,
        onPrev,
        onNext,
      }}
    >
      {children}
    </CreateChannelContext.Provider>
  );
};

export const useCreateChannel = () => {
  return useContext(CreateChannelContext);
};
