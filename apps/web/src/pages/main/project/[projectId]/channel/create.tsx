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
import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { CreateProjectChannelTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { InputField, InputFieldPreview } from '@/containers/create-channel';
import InputChannelInfo from '@/containers/create-channel/InputChannelInfo';
import {
  CHANNEL_STEPPER_TEXT,
  CreateChannelProvider,
  useCreateChannel,
} from '@/contexts/create-channel.context';
import type { ChannelStepType } from '@/contexts/create-channel.context';

const HELP_TEXT: Record<ChannelStepType, string> = {
  channelInfo:
    'Channel을 통해 수집하고 싶은 피드백 필드를 정의할 수 있습니다. 피드백 경로와 성격을 고려하여 Channel 정보를 등록해주세요. (ex. VOC, APP Reivew)',
  fields:
    '등록한 Channel에 맞춰 UserFeedback으로 수집하고 싶은 피드백 필드를 정의합니다. API를 통해 수집하고 싶은 필드나 ADMIN에서 직접 등록하고 싶은 필드를 미리 설정해보세요. ',
  fieldPreview:
    'Field 관리에서 설정한 필드가 어떻게 보일지 미리 확인할 수 있습니다. 미리보기는 임의의 데이터로 보여주기 때문에 실제와 다릅니다.',
};

const CreatePage: NextPage = () => {
  return (
    <CreateChannelProvider>
      <CreateChannel />
    </CreateChannelProvider>
  );
};
const CreateChannel: NextPage = () => {
  const { completeStepIndex, currentStepIndex, currentStep } =
    useCreateChannel();
  return (
    <CreateProjectChannelTemplate
      completeStepIndex={completeStepIndex}
      currentStepIndex={currentStepIndex}
      helpText={HELP_TEXT}
      stepObj={CHANNEL_STEPPER_TEXT}
      type="channel"
      currentStep={currentStep}
    >
      <Contents />
    </CreateProjectChannelTemplate>
  );
};

const Contents: React.FC = () => {
  const { currentStep } = useCreateChannel();

  return (
    <>
      {currentStep === 'channelInfo' && <InputChannelInfo />}
      {currentStep === 'fields' && <InputField />}
      {currentStep === 'fieldPreview' && <InputFieldPreview />}
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreatePage;
