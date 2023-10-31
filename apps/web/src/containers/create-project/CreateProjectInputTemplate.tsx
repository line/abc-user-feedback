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

import { useCreateProject } from '@/contexts/create-project.context';
import type { StepType } from '@/contexts/create-project.context';

const STEPPER_TEXT: Record<StepType, string> = {
  projectInfo: 'Project 설정',
  roles: 'Role 관리',
  members: 'Member 관리',
  apiKeys: 'API Key',
  issueTracker: 'Issue Tracker',
};

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  validate?: () => boolean;
}

const CreateProjectInputTemplate: React.FC<IProps> = ({
  children,
  actionButton,
  validate,
}) => {
  const { currentStep, onNext, onPrev, currentStepIndex } = useCreateProject();

  return (
    <div className="border-fill-secondary flex flex-1 flex-col gap-6 overflow-auto rounded border p-6">
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="font-20-bold">{STEPPER_TEXT[currentStep]}</h1>
          {actionButton}
        </div>
        <hr className="border-fill-secondary" />
        <div className="flex flex-1 flex-col gap-5">{children}</div>
      </div>
      <div className="flex justify-end gap-2">
        {currentStepIndex !== 0 && (
          <button
            className="btn btn-lg btn-secondary w-[120px]"
            onClick={onPrev}
          >
            이전
          </button>
        )}
        <button
          className="btn btn-lg btn-secondary w-[120px]"
          onClick={() => {
            if (validate && !validate()) return;
            onNext();
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default CreateProjectInputTemplate;
