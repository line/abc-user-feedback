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
import { useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { ErrorCode } from '@ufb/shared';
import { Popover, PopoverModalContent, toast } from '@ufb/ui';

import { CreateInputTemplate, Path, useOAIMutation } from '@/shared';
import { isDefaultField } from '@/entities/field';

import { useCreateChannelStore } from '../create-channel-model';
import { CREATE_CHANNEL_STEP_KEY_LIST } from '../create-channel-type';
import { CREATE_CHANNEL_STEPPER_TEXT } from '../create-channel.constant';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
  disableNextBtn?: boolean;
  isLoading?: boolean;
}

const CreateChannelInputTemplate: React.FC<IProps> = (props) => {
  const { children, actionButton, validate, disableNextBtn, isLoading } = props;

  const { t } = useTranslation();

  const {
    currentStep,
    nextStep,
    prevStep,
    getCurrentStepKey,
    input,
    reset,
    jumpStepByKey,
  } = useCreateChannelStore();

  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const queryClient = useQueryClient();

  const overlay = useOverlay();

  const openCreateChannelError = () => {
    return overlay.open(({ isOpen, close }) => (
      <Popover modal open={isOpen} onOpenChange={() => close()}>
        <PopoverModalContent
          title={t('text.guide')}
          description={t('main.create-channel.guide.invalid-channel')}
          submitButton={{
            children: t('button.confirm'),
            onClick: () => jumpStepByKey('channel-info'),
          }}
        />
      </Popover>
    ));
  };

  const { mutate } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/channels',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess(data) {
        await router.replace({
          pathname: Path.CREATE_CHANNEL_COMPLETE,
          query: { projectId, channelId: data?.id },
        });
        reset();
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects/{projectId}/channels'],
        });
      },
      onError(error) {
        if (error.code === ErrorCode.Channel.ChannelAlreadyExists) {
          openCreateChannelError();
        } else {
          toast.negative({ title: error.message });
        }
      },
    },
  });

  const onComplete = () => {
    if (projectId < 1) {
      alert('Invalid Project id');
      return;
    }

    mutate({
      ...input.channelInfo,
      fields: input.fields.filter((v) => !isDefaultField(v)),
      imageConfig: input.imageConfig,
    });
  };

  return (
    <CreateInputTemplate
      currentStep={currentStep}
      lastStep={CREATE_CHANNEL_STEP_KEY_LIST.length - 1}
      onNext={nextStep}
      onPrev={prevStep}
      title={CREATE_CHANNEL_STEPPER_TEXT[getCurrentStepKey()]}
      actionButton={actionButton}
      onComplete={onComplete}
      validate={validate}
      disableNextBtn={disableNextBtn ?? isLoading}
    >
      {children}
    </CreateInputTemplate>
  );
};

export default CreateChannelInputTemplate;
