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

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { ErrorCode } from '@ufb/shared';
import { Popover, PopoverModalContent, toast } from '@ufb/ui';

import {
  CreateInputTemplate,
  isObjectEqual,
  Path,
  useOAIMutation,
  useOAIQuery,
  useWarnIfSavedChanges,
} from '@/shared';

import {
  CREATE_PROJECT_DEFAULT_INPUT,
  useCreateProjectStore,
} from '../create-project-model';
import { CREATE_PROJECT_MAIN_STEP_LIST } from '../create-project-type';
import {
  CREATE_PROJECT_HELP_TEXT,
  CREATE_PROJECT_STEPPER_TEXT,
} from '../create-project.constant';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
  disableNextBtn?: boolean;
  isLoading?: boolean;
  onClickBack?: () => void;
  scrollable?: boolean;
}

const CreateProjectInputTemplate: React.FC<IProps> = (props) => {
  const {
    children,
    actionButton,
    validate,
    disableNextBtn,
    isLoading,
    onClickBack,
    scrollable = false,
  } = props;

  const { t } = useTranslation();

  const { currentStep, nextStep, prevStep, input, jumpStepByKey, reset } =
    useCreateProjectStore();

  const router = useRouter();
  const overlay = useOverlay();
  const { refetch } = useOAIQuery({
    path: '/api/admin/projects',
    variables: { limit: 1000, page: 1 },
  });

  const openMemberError = () => {
    return overlay.open(({ isOpen, close }) => (
      <Popover open={isOpen} onOpenChange={() => close()} modal>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-project.guide.invalid-member')}
          submitButton={{
            children: t('button.confirm'),
            onClick: () => jumpStepByKey('members'),
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
            onClick: () => jumpStepByKey('project-info'),
          }}
        />
      </Popover>
    ));
  };

  const { mutate } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects',
    queryOptions: {
      async onSuccess(data) {
        await refetch();
        await router.push({
          pathname: Path.CREATE_PROJECT_COMPLETE,
          query: { projectId: data?.id },
        });
        reset();
      },
      onError(error) {
        if (error.code === ErrorCode.Member.MemberInvalidUser) {
          openMemberError();
        } else if (error.code === ErrorCode.Project.ProjectAlreadyExists) {
          openProjectError();
        } else {
          toast.negative({ title: error.message });
        }
      },
    },
  });

  const isDefaultInput = useMemo(
    () => isObjectEqual(CREATE_PROJECT_DEFAULT_INPUT, input),
    [input],
  );

  useWarnIfSavedChanges(!isDefaultInput, Path.CREATE_PROJECT_COMPLETE);

  const onComplete = () => {
    mutate({
      ...input.projectInfo,
      roles: input.roles,
      apiKeys: input.apiKeys,
      issueTracker: { data: input.issueTracker },
      members: input.members.map(({ role, user }) => ({
        roleName: role.name,
        userId: user?.id ?? 0,
      })),
    });
  };

  return (
    <CreateInputTemplate
      currentStepIndex={currentStep.index}
      lastStep={CREATE_PROJECT_MAIN_STEP_LIST.length - 1}
      onNext={nextStep}
      onPrev={prevStep}
      title={CREATE_PROJECT_STEPPER_TEXT[currentStep.key]}
      actionButton={actionButton}
      onComplete={onComplete}
      validate={validate}
      disableNextBtn={disableNextBtn ?? isLoading}
      helpText={CREATE_PROJECT_HELP_TEXT[currentStep.key]}
      onClickBack={onClickBack}
      scrollable={scrollable}
    >
      {children}
    </CreateInputTemplate>
  );
};

export default CreateProjectInputTemplate;
