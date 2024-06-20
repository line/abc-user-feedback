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
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { cn } from '../utils';

import { Path } from '@/constants/path';

type Target = 'project' | 'channel';

interface IProps<T extends string | number | symbol>
  extends React.PropsWithChildren {
  type: Target;
  steps: readonly T[];
  stepTitle: Record<T, React.ReactNode>;
  helpText: React.ReactNode;
  currentStep: number;
  editingStep: number;
}

const CreateTemplate = <T extends string>(props: IProps<T>) => {
  const {
    children,
    type,
    currentStep,
    steps,
    editingStep,
    stepTitle,
    helpText,
  } = props;

  const { t } = useTranslation();
  const router = useRouter();
  const ROUTE: Record<Target, () => void> = {
    channel: () =>
      router.push({
        pathname: Path.PROJECT_MAIN,
        query: { projectId: router.query.projectId },
      }),
    project: () => router.push({ pathname: Path.MAIN }),
  };

  return (
    <div className="m-auto flex min-h-screen w-[1040px] flex-col gap-4 pb-6">
      {/* header */}
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
          onClick={() => ROUTE[type]()}
        >
          <Icon name="Out" size={16} />
          <span className="font-12-bold uppercase">{t('button.get-out')}</span>
        </button>
      </div>
      {/* title */}
      <h1 className="font-24-bold text-center">
        {type === 'project' && t('main.create-project.title')}
        {type === 'channel' && t('main.create-channel.title')}
      </h1>
      {/* stepper */}
      <div className="border-fill-secondary relative flex rounded border px-10 py-4">
        {steps.map((step, i) => (
          <Fragment key={i}>
            <div
              className={cn([
                'group flex flex-col items-center gap-3',
                i !== currentStep && 'gap-4 pt-1',
              ])}
            >
              <div
                className={cn([
                  'font-16-bold bg-fill-secondary text-secondary flex h-8 w-8 items-center justify-center rounded-full',
                  i <= editingStep && 'bg-blue-primary text-above-primary',
                  i === currentStep &&
                    'border-text-secondary h-10 w-10 border-2',
                ])}
              >
                {i + 1 > editingStep ?
                  i + 1
                : <Icon name="Check" className="text-above-primary" size={16} />
                }
              </div>
              <div className="font-14-bold">{stepTitle[step]}</div>
            </div>
            {steps.length - 1 !== i && (
              <div
                className={cn([
                  'border-fill-secondary mt-5 flex-1 border-t-2',
                  i < editingStep && 'border-blue-primary',
                ])}
              />
            )}
          </Fragment>
        ))}
      </div>
      {/* helper box */}
      <div className="border-fill-secondary rounded border px-6 py-4">
        <div className="mb-1 flex items-center gap-2">
          <Icon name="IdeaColor" size={16} />
          <h2 className="font-14-bold">{t('text.helper')}</h2>
        </div>
        <p className="font-12-regular">{helpText}</p>
      </div>
      {children}
    </div>
  );
};

export default CreateTemplate;
