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
import { useTranslation } from 'next-i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  toast,
} from '@ufb/react';
import { ErrorCode } from '@ufb/shared';

import {
  CreateInputTemplate,
  isObjectEqual,
  Path,
  useAllChannels,
  useOAIMutation,
  useWarnIfSavedChanges,
} from '@/shared';
import { isDefaultField } from '@/entities/field';

import {
  CREATE_CHANNEL_DEFAULT_INPUT,
  useCreateChannelStore,
} from '../create-channel-model';
import { CREATE_CHANNEL_MAIN_STEP_LIST } from '../create-channel-type';
import {
  CREATE_CHANNEL_HELP_TEXT,
  CREATE_CHANNEL_STEPPER_TEXT,
} from '../create-channel.constant';

interface IProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
  disableNextBtn?: boolean;
  isLoading?: boolean;
  onClickBack?: () => void;
}

const CreateChannelInputTemplate: React.FC<IProps> = (props) => {
  const {
    children,
    actionButton,
    validate,
    disableNextBtn,
    isLoading,
    onClickBack,
  } = props;

  const { t } = useTranslation();

  const { currentStep, nextStep, prevStep, input, reset, jumpStepByKey } =
    useCreateChannelStore();

  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const overlay = useOverlay();
  const { refetch } = useAllChannels(projectId);

  const openCreateChannelError = () => {
    overlay.open(({ isOpen, close }) => (
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>{t('text.guide')}</DialogHeader>
          <DialogBody>
            <DialogDescription>
              {t('main.create-channel.guide.invalid-channel')}
            </DialogDescription>
          </DialogBody>
          <DialogFooter>
            <DialogClose>{t('v2.button.cancel')}</DialogClose>
            <Button onClick={() => jumpStepByKey('channel-info')}>
              {t('v2.button.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ));
  };

  const { mutate } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/channels',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess(data) {
        await refetch();
        await router.replace({
          pathname: Path.CREATE_CHANNEL_COMPLETE,
          query: { projectId, channelId: data?.id },
        });
        reset();
      },
      onError(error) {
        if (error.code === ErrorCode.Channel.ChannelAlreadyExists) {
          openCreateChannelError();
        } else {
          toast.error(error.message);
        }
      },
    },
  });

  const isDefaultInput = useMemo(
    () => isObjectEqual(CREATE_CHANNEL_DEFAULT_INPUT, input),
    [input],
  );

  useWarnIfSavedChanges(
    !isDefaultInput,
    Path.CREATE_CHANNEL_COMPLETE.replace(
      '[projectId]',
      router.query.projectId as string,
    ),
  );

  const onComplete = () => {
    mutate({
      ...input.channelInfo,
      fields: input.fields.filter((v) => !isDefaultField(v)),
    });
  };

  return (
    <CreateInputTemplate
      currentStepIndex={currentStep.index}
      lastStep={CREATE_CHANNEL_MAIN_STEP_LIST.length - 1}
      onNext={nextStep}
      onPrev={prevStep}
      title={CREATE_CHANNEL_STEPPER_TEXT[currentStep.key]}
      actionButton={actionButton}
      onComplete={onComplete}
      validate={validate}
      disableNextBtn={disableNextBtn ?? isLoading}
      helpText={CREATE_CHANNEL_HELP_TEXT[currentStep.key]}
      onClickBack={onClickBack}
    >
      {children}
    </CreateInputTemplate>
  );
};

export default CreateChannelInputTemplate;
