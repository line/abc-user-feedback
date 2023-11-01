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

import type { InputApiKeyType } from '@/types/api-key.type';
import type { InputIssueTrackerType } from '@/types/issue-tracker.type';
import type { InputMemberType } from '@/types/member.type';
import { PermissionList } from '@/types/permission.type';
import type { InputProjectType } from '@/types/project.type';
import type { InputRoleType } from '@/types/role.type';

const DEFAULT_ROLES: InputRoleType[] = [
  { name: 'Admin', permissions: [...PermissionList] },
  {
    name: 'Editor',
    permissions: [...PermissionList].filter(
      (v) =>
        !v.includes('role') &&
        (v.includes('read') ||
          v.includes('feedback') ||
          v.includes('issue') ||
          v.includes('member_create')),
    ),
  },
  {
    name: 'Viewer',
    permissions: [...PermissionList].filter(
      (v) => v.includes('read') && !v.includes('download'),
    ),
  },
];
const DEFAULT_INPUT = {
  apiKeys: [],
  members: [],
  roles: DEFAULT_ROLES,
  issueTracker: { ticketDomain: '', ticketKey: '' },
  projectInfo: { description: '', name: '' },
};

export const PROJECT_STEPPER_TEXT: Record<ProjectStepType, string> = {
  projectInfo: 'Project 설정',
  roles: 'Role 관리',
  members: 'Member 관리',
  apiKeys: 'API Key',
  issueTracker: 'Issue Tracker',
};

interface InputType {
  projectInfo: InputProjectType;
  roles: InputRoleType[];
  members: InputMemberType[];
  apiKeys: InputApiKeyType[];
  issueTracker: InputIssueTrackerType;
}

export type ProjectStepType = keyof InputType;

export const PROJECT_STEPS: ProjectStepType[] = [
  'projectInfo',
  'roles',
  'members',
  'apiKeys',
  'issueTracker',
];

type OnChangeInputType = <T extends keyof InputType>(
  key: T,
  value: InputType[T],
) => void;

interface CreateProjectContextType {
  input: InputType;
  currentStep: ProjectStepType;
  currentStepIndex: number;
  completeStepIndex: number;
  onChangeInput: OnChangeInputType;
  onPrev: () => void;
  onNext: () => void;
}

export const CreateProjectContext = createContext<CreateProjectContextType>({
  currentStep: 'projectInfo',
  completeStepIndex: 0,
  currentStepIndex: 0,
  input: DEFAULT_INPUT,
  onChangeInput: () => {},
  onPrev: () => {},
  onNext: () => {},
});

export const CreateProjectProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [input, setInput] = useState<InputType>(DEFAULT_INPUT);
  const [currentStep, setCurrentStep] =
    useState<ProjectStepType>('projectInfo');
  const [completeStepIndex, setCompleteStepIndex] = useState(0);

  const currentStepIndex = useMemo(
    () => PROJECT_STEPS.indexOf(currentStep),
    [currentStep],
  );

  const onPrev = useCallback(() => {
    setCurrentStep(
      PROJECT_STEPS[PROJECT_STEPS.indexOf(currentStep) - 1] ?? 'projectInfo',
    );
  }, [currentStep]);

  const onNext = useCallback(() => {
    const nextStepIndex = PROJECT_STEPS.indexOf(currentStep) + 1;
    const nextStep = PROJECT_STEPS[nextStepIndex] ?? 'projectInfo';

    if (nextStepIndex === PROJECT_STEPS.length) {
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
    <CreateProjectContext.Provider
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
    </CreateProjectContext.Provider>
  );
};

export const useCreateProject = () => {
  return useContext(CreateProjectContext);
};
