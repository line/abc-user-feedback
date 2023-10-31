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
import React, { Fragment } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Icon } from '@ufb/ui';

import { DEFAULT_LOCALE } from '@/constants/i18n';
import {
  InputApiKey,
  InputIssueTracker,
  InputMember,
  InputProjectInfo,
  InputRole,
} from '@/containers/create-project';
import type { StepType } from '@/contexts/create-project.context';
import {
  CreateProjectProvider,
  STEPS,
  useCreateProject,
} from '@/contexts/create-project.context';

const STEPPER_TEXT: Record<StepType, string> = {
  projectInfo: 'Project 설정',
  roles: 'Role 관리',
  members: 'Member 관리',
  apiKeys: 'API Key',
  issueTracker: 'Issue Tracker',
};

const HELP_TEXT: Record<StepType, string> = {
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
      <div className="m-auto flex min-h-screen w-[1040px] flex-col gap-4 pb-6">
        <Header />
        <Title />
        <Stepper />
        <Helper />
        <Contents />
      </div>
    </CreateProjectProvider>
  );
};

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={24}
          height={24}
        />
        <Icon name="Title" className="h-[24px] w-[123px]" />
      </div>
      <button className="btn btn-sm btn-secondary min-w-0 gap-1 px-2">
        <Icon name="Out" size={16} />
        <span className="font-12-bold uppercase">나가기</span>
      </button>
    </div>
  );
};

const Title = () => {
  return <h1 className="font-24-bold text-center">Project 생성</h1>;
};

const Stepper: React.FC = () => {
  const { currentStepIndex, goto, completeStepIndex } = useCreateProject();

  return (
    <div className="border-fill-secondary relative flex rounded border px-10 py-4">
      {STEPS.map((item, i) => (
        <Fragment key={i}>
          <div className="flex flex-col items-center gap-3">
            <div
              className={[
                'font-16-bold flex h-10 w-10 items-center justify-center rounded-full',
                i <= completeStepIndex
                  ? 'bg-blue-primary text-above-primary'
                  : 'bg-fill-secondary text-secondary',
                i <= completeStepIndex && 'cursor-pointer',
                i === currentStepIndex && 'ring-fill-primary ring-2',
              ].join(' ')}
              onClick={() => {
                if (i <= completeStepIndex) goto(item);
              }}
            >
              {i > completeStepIndex - 1 ? i + 1 : 'v'}
            </div>
            <div className="font-14-bold">{STEPPER_TEXT[item]}</div>
          </div>
          {STEPS.length - 1 !== i && (
            <div
              className={[
                'mt-5 flex-1 border-t-2',
                i < completeStepIndex
                  ? 'border-blue-primary'
                  : 'border-fill-secondary',
              ].join(' ')}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

const Helper: React.FC = () => {
  const { currentStep } = useCreateProject();
  return (
    <div className="border-fill-secondary rounded border px-6 py-4">
      <h2 className="font-14-bold mb-1">도움말</h2>
      <p className="font-12-regular">{HELP_TEXT[currentStep]}</p>
    </div>
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
