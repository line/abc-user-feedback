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

import { CreateProjectChannelInputTemplate } from '@/components/templates/CreateProjectChannelInputTemplate';
import {
  PROJECT_STEPPER_TEXT,
  PROJECT_STEPS,
  useCreateProject,
} from '@/contexts/create-project.context';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
  onComplete?: () => void;
  disableNextBtn?: boolean;
  isLoading?: boolean;
}

const CreateProjectInputTemplate: React.FC<IProps> = ({
  children,
  actionButton,
  onComplete,
  validate,
  disableNextBtn,
  isLoading,
}) => {
  const { currentStep, onNext, onPrev, currentStepIndex } = useCreateProject();

  return (
    <CreateProjectChannelInputTemplate
      currentStepIndex={currentStepIndex}
      lastStepIndex={PROJECT_STEPS.length - 1}
      onNext={onNext}
      onPrev={onPrev}
      title={PROJECT_STEPPER_TEXT[currentStep]}
      actionButton={actionButton}
      onComplete={onComplete}
      validate={validate}
      disableNextBtn={disableNextBtn || isLoading}
    >
      {children}
    </CreateProjectChannelInputTemplate>
  );
};

export default CreateProjectInputTemplate;
