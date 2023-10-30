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
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import type { InputApiKeyType } from '@/types/api-key.type';
import type { IssueTrackerType } from '@/types/issue-tracker.type';
import type { InputMemberType } from '@/types/member.type';
import type { InputProjectType } from '@/types/project.type';
import type { InputRoleType } from '@/types/role.type';

interface InputType {
  projectInfo?: InputProjectType;
  roles?: InputRoleType[];
  members?: InputMemberType[];
  apiKeys?: InputApiKeyType[];
  issueTracker?: IssueTrackerType;
}
type OnChangeInputType = <T extends keyof InputType>(
  key: T,
  value: InputType[T],
) => void;

interface CreateProjectContextType {
  input: InputType | null;
  onChangeInput: OnChangeInputType;
  currentStep: number;
}

export const CreateProjectContext = createContext<CreateProjectContextType>({
  currentStep: 0,
  input: null,
  onChangeInput: () => {},
});

export const CreateProjectProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [input, setInput] = useState<InputType | null>(null);
  const router = useRouter();

  const currentStep = useMemo(() => {
    if (input?.issueTracker) return 5;
    if (input?.apiKeys) return 4;
    if (input?.members) return 3;
    if (input?.roles) return 2;
    if (input?.projectInfo) return 1;
    return 0;
  }, [input]);

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
      value={{ input, currentStep, onChangeInput }}
    >
      {children}
    </CreateProjectContext.Provider>
  );
};

export const useCreateProject = () => {
  return useContext(CreateProjectContext);
};
