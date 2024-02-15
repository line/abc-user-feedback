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
import { Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { Path } from '@/constants/path';

interface IProps<T extends string> extends React.PropsWithChildren {
  type: 'project' | 'channel';
  helpText: Record<T, string>;
  stepObj: Record<T, string>;
  currentStepIndex: number;
  completeStepIndex: number;
  currentStep: T;
}

const CreateProjectChannelTemplate = <T extends string>(
  props: IProps<T>,
): React.ReactNode => {
  const {
    type,
    helpText,
    children,
    completeStepIndex,
    currentStepIndex,
    stepObj,
    currentStep,
  } = props;

  return (
    <div className="m-auto flex min-h-screen w-[1040px] flex-col gap-4 pb-6">
      <Header type={type} />
      <Title type={type} />
      <Stepper
        completeStepIndex={completeStepIndex}
        currentStepIndex={currentStepIndex}
        stepObj={stepObj}
      />
      <Helper text={helpText[currentStep]} />
      {children}
    </div>
  );
};

const Header: React.FC<{ type: 'project' | 'channel' }> = ({ type }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex h-12 items-center justify-between">
      <div className="flex items-center gap-1">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={24}
          height={24}
        />
        <Icon name="Title" className="h-[24px] w-[123px]" />
      </div>
      <button
        className="btn btn-sm btn-secondary min-w-0 gap-1 px-2"
        onClick={() => {
          if (type === 'channel') {
            router.push({
              pathname: Path.PROJECT_MAIN,
              query: { projectId: router.query.projectId },
            });
          } else if (type === 'project') {
            router.push({ pathname: Path.MAIN });
          }
        }}
      >
        <Icon name="Out" size={16} />
        <span className="font-12-bold uppercase">{t('button.get-out')}</span>
      </button>
    </div>
  );
};

const Title: React.FC<{ type: 'project' | 'channel' }> = ({ type }) => {
  const { t } = useTranslation();
  return (
    <h1 className="font-24-bold text-center">
      {type === 'project' && t('main.create-project.title')}
      {type === 'channel' && t('main.create-channel.title')}
    </h1>
  );
};

interface IStepperProps {
  stepObj: Record<string, string>;
  currentStepIndex: number;
  completeStepIndex: number;
}

const Stepper: React.FC<IStepperProps> = (props) => {
  const { stepObj, currentStepIndex, completeStepIndex } = props;
  const steps = Object.keys(stepObj);

  return (
    <div className="border-fill-secondary relative flex rounded border px-10 py-4">
      {steps.map((item, i) => (
        <Fragment key={i}>
          <div
            className={[
              'group flex flex-col items-center',
              i === currentStepIndex ? 'gap-3' : 'gap-4 pt-1',
            ].join(' ')}
          >
            <div
              className={[
                'font-16-bold flex items-center justify-center rounded-full',
                i <= completeStepIndex
                  ? 'bg-blue-primary text-above-primary'
                  : 'bg-fill-secondary text-secondary',
                i === currentStepIndex
                  ? 'border-text-secondary h-10 w-10 border-2'
                  : 'h-8 w-8',
              ].join(' ')}
            >
              {i > completeStepIndex - 1 ? (
                i + 1
              ) : (
                <Icon name="Check" className="text-above-primary" size={16} />
              )}
            </div>
            <div className="font-14-bold">{stepObj[item]}</div>
          </div>
          {steps.length - 1 !== i && (
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

const Helper: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation();
  return (
    <div className="border-fill-secondary rounded border px-6 py-4">
      <div className="mb-1 flex items-center  gap-2">
        <Icon name="IdeaColor" size={16} />
        <h2 className="font-14-bold">{t('text.helper')}</h2>
      </div>
      <p className="font-12-regular">{text}</p>
    </div>
  );
};

export default CreateProjectChannelTemplate;
