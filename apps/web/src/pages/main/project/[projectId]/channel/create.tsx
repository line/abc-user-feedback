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
import React, { useMemo } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { CreateProjectChannelTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { InputField, InputFieldPreview } from '@/containers/create-channel';
import InputChannelInfo from '@/containers/create-channel/InputChannelInfo';
import {
  CreateChannelProvider,
  useCreateChannel,
} from '@/contexts/create-channel.context';
import type { ChannelStepType } from '@/contexts/create-channel.context';

const CreatePage: NextPage = () => {
  return (
    <CreateChannelProvider>
      <CreateChannel />
    </CreateChannelProvider>
  );
};
const CreateChannel: NextPage = () => {
  const { t } = useTranslation();
  const { completeStepIndex, currentStepIndex, currentStep, stepperText } =
    useCreateChannel();

  const HELP_TEXT: Record<ChannelStepType, string> = useMemo(() => {
    return {
      channelInfo: t('main.create-channel.help.channel-info'),
      fields: t('main.create-channel.help.fields'),
      fieldPreview: t('main.create-channel.help.field-preview'),
    };
  }, [t]);

  return (
    <CreateProjectChannelTemplate
      completeStepIndex={completeStepIndex}
      currentStepIndex={currentStepIndex}
      helpText={HELP_TEXT}
      stepObj={stepperText}
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
