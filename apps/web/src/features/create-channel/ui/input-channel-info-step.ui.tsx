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

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { useAllChannels } from '@/shared';
import { EMPTY_FUNCTION } from '@/shared/utils/empty-function';
import type { ChannelInfo } from '@/entities/channel';
import { ChannelInfoForm, channelInfoSchema } from '@/entities/channel';

import { useCreateChannelStore } from '../create-channel-model';
import CreateChannelInputTemplate from './create-channel-input-template.ui';

interface IProps {}

const InputChannelInfoStep: React.FC<IProps> = () => {
  const { onChangeInput, input, setEditingStepIndex } = useCreateChannelStore();
  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const { data } = useAllChannels(projectId);

  const methods = useForm<ChannelInfo>({
    resolver: zodResolver(channelInfoSchema),
    defaultValues: input.channelInfo,
  });

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const newValues = channelInfoSchema.safeParse(values);
      if (!newValues.data) return;
      onChangeInput('channelInfo', newValues.data);
      setEditingStepIndex(0);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <CreateChannelInputTemplate
      validate={async () => {
        const isValid = await methods.trigger();
        await methods.handleSubmit(EMPTY_FUNCTION)();
        const isDuplicated = data?.items.some(
          (v) => v.name === methods.getValues('name'),
        );
        if (isDuplicated) {
          methods.setError('name', { message: 'Duplicated name' });
          return false;
        }
        return isValid;
      }}
    >
      <FormProvider {...methods}>
        <ChannelInfoForm type="create" />
      </FormProvider>
    </CreateChannelInputTemplate>
  );
};

export default InputChannelInfoStep;
