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

import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { CreationLayout, CreationStepper, Path } from '@/shared';

import { useCreateProjectStore } from '../create-project-model';
import { CREATE_PROJECT_MAIN_STEP_LIST } from '../create-project-type';
import {
  CREATE_PROJECT_COMPONENTS,
  CREATE_PROJECT_STEPPER_TEXT,
} from '../create-project.constant';

interface IProps {}

const CreateProject: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { currentStep } = useCreateProjectStore();

  const router = useRouter();

  return (
    <CreationLayout
      title={t('main.create-project.title')}
      leftPanel={
        <CreationStepper
          steps={CREATE_PROJECT_MAIN_STEP_LIST}
          currentStepIndex={currentStep.index}
          stepTitle={CREATE_PROJECT_STEPPER_TEXT}
        />
      }
      onClickGoBack={() => router.push({ pathname: Path.MAIN })}
    >
      {CREATE_PROJECT_COMPONENTS[currentStep.key]}
    </CreationLayout>
  );
};

export default CreateProject;
