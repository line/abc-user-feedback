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
import { Trans } from 'react-i18next';

import { CreateTemplate } from '@/shared';

import {
  useCreateProjectActions,
  useCreateProjectState,
} from '../create-project-model';
import type { CreateProjectStepKey } from '../create-project-type';
import { CREATE_PROJEC_STEP_KEY_LIST } from '../create-project-type';
import InputApiKey from './input-api-key.ui';
import InputProjectInfo from './input-project-info.ui';
import InputRole from './input-role.ui';

import { HelpCardDocs } from '@/components';

const STEP_COMPONENT: Record<CreateProjectStepKey, React.ReactNode> = {
  'project-info': <InputProjectInfo />,
  role: <InputRole />,
  'api-key': <InputApiKey />,
  'issue-tracker': <InputApiKey />,
  member: <InputApiKey />,
};

const PROJECT_STEPPER_TEXT: Record<CreateProjectStepKey, React.ReactNode> = {
  'project-info': <Trans i18nKey="project-setting-menu.project-info" />,
  role: <Trans i18nKey="project-setting-menu.role-mgmt" />,
  member: <Trans i18nKey="project-setting-menu.member-mgmt" />,
  'api-key': <Trans i18nKey="project-setting-menu.api-key-mgmt" />,
  'issue-tracker': <Trans i18nKey="project-setting-menu.issue-tracker-mgmt" />,
};
const PROJECT_HELP_TEXT: Record<CreateProjectStepKey, React.ReactNode> = {
  'project-info': <Trans i18nKey="help-card.project-info" />,
  role: <Trans i18nKey="help-card.role" />,
  member: <Trans i18nKey="help-card.member" />,
  'api-key': <HelpCardDocs i18nKey="help-card.api-key" />,
  'issue-tracker': <Trans i18nKey="help-card.issue-tracker" />,
};

interface IProps {}

const CreateProjectTemplate: React.FC<IProps> = () => {
  const { currentStep, editingStep } = useCreateProjectState();
  const { nextStep, prevStep, getCurrentStepKey } = useCreateProjectActions();
  const currentStepKey = getCurrentStepKey();

  return (
    <CreateTemplate
      type="project"
      currentStep={currentStep}
      steps={CREATE_PROJEC_STEP_KEY_LIST}
      editingStep={editingStep}
      stepTitle={PROJECT_STEPPER_TEXT}
      helpText={PROJECT_HELP_TEXT[currentStepKey]}
    >
      {STEP_COMPONENT[currentStepKey]}
      <button onClick={prevStep}>PREV</button>
      <br />
      <button onClick={nextStep}>NEXT</button>
    </CreateTemplate>
  );
};

export default CreateProjectTemplate;
