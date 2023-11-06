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
import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { CreateProjectChannelTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import {
  InputApiKey,
  InputIssueTracker,
  InputMember,
  InputProjectInfo,
  InputRole,
} from '@/containers/create-project';
import type { ProjectStepType } from '@/contexts/create-project.context';
import {
  CreateProjectProvider,
  PROJECT_STEPPER_TEXT,
  useCreateProject,
} from '@/contexts/create-project.context';

const HELP_TEXT: Record<ProjectStepType, string> = {
  projectInfo:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  roles:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  apiKeys:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  members:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  issueTracker:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
};

const CreatePage: NextPage = () => {
  return (
    <CreateProjectProvider>
      <CreateProject />
    </CreateProjectProvider>
  );
};
const CreateProject: React.FC = () => {
  const { completeStepIndex, currentStepIndex, currentStep } =
    useCreateProject();

  return (
    <CreateProjectChannelTemplate
      completeStepIndex={completeStepIndex}
      currentStepIndex={currentStepIndex}
      helpText={HELP_TEXT}
      stepObj={PROJECT_STEPPER_TEXT}
      type="project"
      currentStep={currentStep}
    >
      <Contents />
    </CreateProjectChannelTemplate>
  );
};

const Contents: React.FC = () => {
  const { currentStep } = useCreateProject();

  return (
    <>
      {currentStep === 'projectInfo' && <InputProjectInfo />}
      {currentStep === 'roles' && <InputRole />}
      {currentStep === 'members' && <InputMember />}
      {currentStep === 'apiKeys' && <InputApiKey />}
      {currentStep === 'issueTracker' && <InputIssueTracker />}
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreatePage;
