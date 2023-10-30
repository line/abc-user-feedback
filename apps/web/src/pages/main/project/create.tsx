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
import React, { Fragment, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

import { Icon } from '@ufb/ui';

import {
  CreateApiKeyButton,
  CreateMemberButton,
  CreateRoleButton,
  InputApiKey,
  InputMember,
  InputProjectInfo,
  InputRole,
} from '@/containers/create-project';

const ITEMS = ['info', 'role', 'member', 'apiKey', 'issueTracker'] as const;

type ItemType = (typeof ITEMS)[number];

const STEPPER_TEXT: Record<ItemType, string> = {
  info: 'Project 설정',
  role: 'Role 관리',
  member: 'Member 관리',
  apiKey: 'API Key',
  issueTracker: 'Issue Tracker',
};

const HELP_TEXT: Record<ItemType, string> = {
  info: 'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  role: 'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  apiKey:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  member:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
  issueTracker:
    'UserFeedback 라벨과 Issue Tracking System 티켓을 연결하여 관리할 수 있습니다. 사용중인 Issue Tracking System URL을 입력해주세요.',
};

const CreatePage: NextPage = () => {
  const [currentStep, setCurrentStep] =
    useState<(typeof ITEMS)[number]>('info');

  const currentIndex = useMemo(
    () => ITEMS.indexOf(currentStep) + 1,
    [currentStep],
  );

  return (
    <div className="m-auto flex h-screen w-[1040px] flex-col gap-4 pb-6">
      <Header />
      <Title />
      <Stepper currentIndex={currentIndex} />
      <Helper currentStep={currentStep} />
      <Contents currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
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

const Stepper: React.FC<{ currentIndex: number }> = ({ currentIndex }) => {
  return (
    <div className="border-fill-secondary relative flex rounded border px-10 py-4">
      {ITEMS.map((item, i) => (
        <Fragment key={i}>
          <div className="flex flex-col items-center gap-3">
            <div
              className={[
                i < currentIndex
                  ? 'bg-blue-primary text-above-primary'
                  : 'bg-fill-secondary text-secondary',
                'font-16-bold flex h-10 w-10 items-center justify-center rounded-full',
              ].join(' ')}
            >
              {i + 1}
            </div>
            <div className="font-14-bold">{STEPPER_TEXT[item]}</div>
          </div>
          {ITEMS.length - 1 !== i && (
            <div
              className={[
                'mt-5 flex-1 border-t-2',
                i < currentIndex - 1
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

const Helper: React.FC<{ currentStep: ItemType }> = ({ currentStep }) => {
  return (
    <div className="border-fill-secondary rounded border px-6 py-4">
      <h2 className="font-14-bold mb-1">도움말</h2>
      <p className="font-12-regular">{HELP_TEXT[currentStep]}</p>
    </div>
  );
};

const Contents: React.FC<{
  currentStep: ItemType;
  setCurrentStep: React.Dispatch<React.SetStateAction<ItemType>>;
}> = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="border-fill-secondary flex flex-1 flex-col gap-6 overflow-auto rounded border p-6">
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="font-20-bold">{STEPPER_TEXT[currentStep]}</h1>
          {currentStep === 'role' && <CreateRoleButton />}
          {currentStep === 'member' && <CreateMemberButton />}
          {currentStep === 'apiKey' && <CreateApiKeyButton />}
        </div>
        <hr className="border-fill-secondary" />
        <div className="flex flex-1 flex-col gap-5">
          {currentStep === 'info' && <InputProjectInfo />}
          {currentStep === 'role' && <InputRole />}
          {currentStep === 'member' && <InputMember />}
          {currentStep === 'apiKey' && <InputApiKey />}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {currentStep !== 'info' && (
          <button
            className="btn btn-lg btn-secondary w-[120px]"
            onClick={() =>
              setCurrentStep(ITEMS[ITEMS.indexOf(currentStep) - 1] ?? 'info')
            }
          >
            이전
          </button>
        )}
        <button
          className="btn btn-lg btn-secondary w-[120px]"
          onClick={() =>
            setCurrentStep(ITEMS[ITEMS.indexOf(currentStep) + 1] ?? 'info')
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
