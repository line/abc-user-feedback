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
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  fields:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  fieldPreview:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
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
