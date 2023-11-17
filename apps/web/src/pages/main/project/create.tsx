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
import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

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
  useCreateProject,
} from '@/contexts/create-project.context';

const CreatePage: NextPage = () => {
  return (
    <CreateProjectProvider>
      <CreateProject />
    </CreateProjectProvider>
  );
};
const CreateProject: React.FC = () => {
  const { t } = useTranslation();
  const { completeStepIndex, currentStepIndex, currentStep, stepperText } =
    useCreateProject();

  const HELP_TEXT: Record<ProjectStepType, string> = useMemo(() => {
    return {
      projectInfo: t('main.create-project.help.projectInfo'),
      roles: t('main.create-project.help.roles'),
      members: t('main.create-project.help.members'),
      apiKeys: t('main.create-project.help.apiKeys'),
      issueTracker: t('main.create-project.help.issueTracker'),
    };
  }, []);

  return (
    <CreateProjectChannelTemplate
      completeStepIndex={completeStepIndex}
      currentStepIndex={currentStepIndex}
      helpText={HELP_TEXT}
      type="project"
      currentStep={currentStep}
      stepObj={stepperText}
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
