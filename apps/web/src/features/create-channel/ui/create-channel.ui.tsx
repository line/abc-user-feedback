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

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { CreationLayout, CreationStepper, Path } from '@/shared';

import { useCreateChannelStore } from '../create-channel-model';
import { CREATE_CHANNEL_MAIN_STEP_LIST } from '../create-channel-type';
import {
  CREATE_CHANNEL_COMPONENTS,
  CREATE_CHANNEL_STEPPER_TEXT,
} from '../create-channel.constant';

interface IProps {}

const CreateChannel: React.FC<IProps> = () => {
  const { currentStep } = useCreateChannelStore();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <CreationLayout
      title={t('main.create-channel.title')}
      leftPanel={
        <CreationStepper
          steps={CREATE_CHANNEL_MAIN_STEP_LIST}
          currentStepIndex={currentStep.index}
          stepTitle={CREATE_CHANNEL_STEPPER_TEXT}
        />
      }
      leftBottm={
        <div className="flex justify-end">
          <Image
            src={`/assets/images/create-channel-${currentStep.key}.svg`}
            alt="Create Project"
            className="align"
            width={320}
            height={320}
          />
        </div>
      }
      onClickGoBack={() =>
        router.push({
          pathname: Path.PROJECT_MAIN,
          query: { projectId: router.query.projectId },
        })
      }
    >
      {CREATE_CHANNEL_COMPONENTS[currentStep.key]}
    </CreationLayout>
  );
};

export default CreateChannel;
