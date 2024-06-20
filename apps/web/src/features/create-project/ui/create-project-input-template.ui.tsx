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

import { useRouter } from 'next/router';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { ErrorCode } from '@ufb/shared';
import { Popover, PopoverModalContent, toast } from '@ufb/ui';

import { CreateInputTemplate } from '@/shared';

import { useCreateProjectStore } from '../create-project-model';
import { CREATE_PROJEC_STEP_KEY_LIST } from '../create-project-type';
import { CREATE_PROJECT_STEPPER_TEXT } from '../create-project.constant';

import { Path } from '@/constants/path';
import { useOAIMutation } from '@/hooks';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
  disableNextBtn?: boolean;
  isLoading?: boolean;
}

const CreateProjectInputTemplate: React.FC<IProps> = (props) => {
  const { children, actionButton, validate, disableNextBtn, isLoading } = props;

  const { t } = useTranslation();

  const {
    currentStep,
    nextStep,
    prevStep,
    getCurrentStepKey,
    input,
    jumpStep,
    reset,
  } = useCreateProjectStore();

  const overlay = useOverlay();
  const router = useRouter();

  const openMemberError = () => {
    return overlay.open(({ isOpen, close }) => (
      <Popover open={isOpen} onOpenChange={() => close()} modal>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-project.guide.invalid-member')}
          submitButton={{
            children: t('button.confirm'),
            onClick: () => jumpStep('members'),
          }}
        />
      </Popover>
    ));
  };
  const openProjectError = () => {
    return overlay.open(({ isOpen, close }) => (
      <Popover open={isOpen} onOpenChange={() => close()} modal>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-project.guide.invalid-project')}
          submitButton={{
            children: t('button.confirm'),
            onClick: () => jumpStep('project-info'),
          }}
        />
      </Popover>
    ));
  };

  const { mutate } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects',
    queryOptions: {
      onError(error) {
        if (error.code === ErrorCode.Member.MemberInvalidUser) {
          openMemberError();
        } else if (error.code === ErrorCode.Project.ProjectAlreadyExists) {
          openProjectError();
        } else {
          toast.negative({ title: error?.message ?? 'Error' });
        }
      },
      async onSuccess(data) {
        await router.replace({
          pathname: Path.CREATE_PROJECT_COMPLETE,
          query: { projectId: data?.id },
        });
        reset();
      },
    },
  });

  const onComplete = () => {
    mutate({
      ...input.projectInfo,
      roles: input.roles,
      apiKeys: input.apiKeys,
      issueTracker: { data: input.issueTracker as any },
      members: input.members.map((v) => ({
        roleName: v.role.name,
        userId: v.user.id,
      })),
    });
  };

  return (
    <CreateInputTemplate
      currentStep={currentStep}
      lastStep={CREATE_PROJEC_STEP_KEY_LIST.length - 1}
      onNext={nextStep}
      onPrev={prevStep}
      title={CREATE_PROJECT_STEPPER_TEXT[getCurrentStepKey()]}
      actionButton={actionButton}
      onComplete={onComplete}
      validate={validate}
      disableNextBtn={disableNextBtn || isLoading}
    >
      {children}
    </CreateInputTemplate>
  );
};

export default CreateProjectInputTemplate;
