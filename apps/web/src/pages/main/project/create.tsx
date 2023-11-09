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
    'Project 단위로 피드백을 수집할 수 있습니다. 피드백을 관리할 프로덕트 기준으로 Project 정보를 등록해 주세요. (ex. Product Name)',
  roles: 'Project에 접근하고 사용할 수 있는 권한을 설정할 수 있습니다.',
  members: 'Project에 참여할 Member를 등록하거나 관리할 수 있습니다. ',
  apiKeys:
    '피드백 수집 API의 API Key 정보를 관리합니다. API를 활용해 피드백을 수집한다면 Key 정보를 생성해 주세요.',
  issueTracker:
    'UserFeedback 피드백과 Issue Tracking System을 연결해서 관리할 수 있습니다. 사용 중인 Issue Tracking System 정보를 입력해 주세요.',
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
