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
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { useOAIMutation } from '@/shared';
import type { ChannelImageConfig } from '@/entities/channel';
import { channelImageConfigSchema } from '@/entities/channel';
import { ImageConfigForm } from '@/entities/channel/ui';

import { useCreateChannelStore } from '../create-channel-model';
import CreateChannelInputTemplate from './create-channel-input-template.ui';

interface IProps {}

const InputImageConfigStep: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { input, onChangeInput } = useCreateChannelStore();

  const methods = useForm<ChannelImageConfig>({
    resolver: zodResolver(channelImageConfigSchema),
    defaultValues: input.imageConfig,
  });

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const newValues = channelImageConfigSchema.safeParse(values);
      if (!newValues.data) return;
      onChangeInput('imageConfig', newValues.data);
    });
    return () => subscription.unsubscribe();
  }, []);

  const router = useRouter();
  const projectId = Number(router.query.projectId);

  const { mutate: testConection } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/channels/image-upload-url-test',
    pathParams: { projectId },
    queryOptions: {
      onSuccess(data) {
        if (data?.success) {
          toast.accent({ title: 'Test Connection Success' });
        } else {
          methods.setError('accessKeyId', { message: '' });
          methods.setError('bucket', { message: '' });
          methods.setError('endpoint', { message: '' });
          methods.setError('region', { message: '' });
          methods.setError('root', { message: '' });
          methods.setError('secretAccessKey', { message: '' });
          toast.negative({ title: 'Test Connection failed' });
        }
      },
      onError() {
        toast.negative({ title: 'Test Connection failed' });
      },
    },
  });

  const handleTestConnection = async () => {
    let isError = false;
    await methods.handleSubmit(() => {})();
    const { accessKeyId, bucket, endpoint, region, secretAccessKey } =
      methods.getValues();
    if (accessKeyId.length === 0) {
      methods.setError('accessKeyId', { message: t('hint.required') });
      isError = true;
    }
    if (bucket.length === 0) {
      methods.setError('bucket', { message: t('hint.required') });
      isError = true;
    }
    if (endpoint.length === 0) {
      methods.setError('endpoint', { message: t('hint.required') });
      isError = true;
    }
    if (region.length === 0) {
      methods.setError('region', { message: t('hint.required') });
      isError = true;
    }
    if (secretAccessKey.length === 0) {
      methods.setError('secretAccessKey', { message: t('hint.required') });
      isError = true;
    }
    if (isError) return;
    testConection(input.imageConfig);
  };

  const validate = async () => {
    const isValid = await methods.trigger();
    await methods.handleSubmit(() => {})();
    return isValid;
  };

  return (
    <CreateChannelInputTemplate
      validate={validate}
      actionButton={
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleTestConnection}
        >
          Test Connection
        </button>
      }
    >
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-20-bold">
            {t('title-box.image-storage-integration')}
          </h2>
        </div>
        <FormProvider {...methods}>
          <ImageConfigForm />
        </FormProvider>
      </div>
    </CreateChannelInputTemplate>
  );
};

export default InputImageConfigStep;
