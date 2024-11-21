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
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@ufb/react';
import { Icon } from '@ufb/ui';

import { cn, Path } from '@/shared';

type Target = 'project' | 'channel';

interface IProps<T extends string | number | symbol>
  extends React.PropsWithChildren {
  type: Target;
  steps: readonly T[];
  stepTitle: Record<T, React.ReactNode>;
  currentStepIndex: number;
}

const CreateTemplate = <T extends string>(props: IProps<T>) => {
  const { children, type, currentStepIndex, steps, stepTitle } = props;

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
    <>
      <div className="flex h-12 items-center justify-between p-6">
        <div className="flex items-center gap-1">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            width={24}
            height={24}
          />
          <Icon name="Title" className="h-[24px] w-[123px]" />
        </div>
        <IconButton
          icon="RiLogoutBoxRLine"
          variant="ghost"
          onClick={ROUTE[type]}
        />
      </div>
      <div className="m-6 flex h-full gap-8">
        <div className="w-[520px] flex-shrink-0">
          <h2 className="text-title-h2 mb-6">
            {type === 'project' && t('main.create-project.title')}
            {type === 'channel' && t('main.create-channel.title')}
          </h2>
          <div>
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="relative z-10 flex gap-4 pb-8">
                  <div
                    className={cn(
                      'bg-neutral-secondary flex h-8 w-8 items-center justify-center rounded-full',
                      { 'bg-black': i <= currentStepIndex },
                    )}
                  >
                    <span className="text-white">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-large-strong">Step {i + 1}</p>
                    <p className="text-neutral-tertiary">{stepTitle[step]}</p>
                  </div>
                </div>
                {i !== steps.length - 1 && (
                  <div
                    className={cn(
                      'border-neutral-tertiary absolute left-[15px] top-0 z-0 mt-5 h-16 border-l-2',
                      { 'border-black': i <= currentStepIndex },
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default CreateTemplate;
