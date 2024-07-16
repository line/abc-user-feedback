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

import { CreateTemplate } from '@/shared';

import { useCreateChannelStore } from '../create-channel-model';
import { CREATE_CHANNEL_STEP_KEY_LIST } from '../create-channel-type';
import {
  CREATE_CHANNEL_COMPONENTS,
  CREATE_CHANNEL_STEPPER_TEXT,
  CREATE_PROJECT_HELP_TEXT,
} from '../create-channel.constant';

interface IProps {}

const CreateProject: React.FC<IProps> = () => {
  const { currentStep, editingStep, getCurrentStepKey } =
    useCreateChannelStore();

  const currentStepKey = getCurrentStepKey();

  return (
    <CreateTemplate
      type="channel"
      currentStep={currentStep}
      steps={CREATE_CHANNEL_STEP_KEY_LIST}
      editingStep={editingStep}
      stepTitle={CREATE_CHANNEL_STEPPER_TEXT}
      helpText={CREATE_PROJECT_HELP_TEXT[currentStepKey]}
    >
      {CREATE_CHANNEL_COMPONENTS[currentStepKey]}
    </CreateTemplate>
  );
};

export default CreateProject;
