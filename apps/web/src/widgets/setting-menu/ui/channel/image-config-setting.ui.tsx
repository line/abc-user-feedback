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
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import {
  HelpCardDocs,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import { EMPTY_FUNCTION } from '@/shared/utils/empty-function';
import type { ChannelImageConfig } from '@/entities/channel';
import { channelImageConfigSchema, ImageConfigForm } from '@/entities/channel';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  channelId: number;
  projectId: number;
}

const ImageConfigSetting: React.FC<IProps> = (props) => {
  const { channelId, projectId } = props;
  const { t } = useTranslation();

  const perms = usePermissions(projectId);

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

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
    await methods.handleSubmit(EMPTY_FUNCTION)();
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
    testConection(methods.getValues());
  };

  const methods = useForm<ChannelImageConfig>({
    resolver: zodResolver(channelImageConfigSchema),
  });

  console.log('methods: ', methods.formState.isDirty);
  useEffect(() => {
    if (data?.imageConfig) {
      methods.reset({
        ...data.imageConfig,
        domainWhiteList: data.imageConfig.domainWhiteList,
      });
    }
  }, [data]);

  const onSubmit = (input: ChannelImageConfig) => {
    if (!data) return;

    mutate({ ...data, imageConfig: input });
  };

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.image-mgmt')}
      actionBtn={{
        children: t('button.save'),
        disabled:
          !perms.includes('channel_image_update') ||
          !methods.formState.isDirty ||
          isPending,
        onClick: methods.handleSubmit(onSubmit),
        form: 'form',
      }}
    >
      <div className="flex items-center rounded border px-6 py-2">
        <p className="flex-1 whitespace-pre-line py-5">
          <HelpCardDocs i18nKey="help-card.image-config" />
        </p>
        <div className="relative h-full w-[80px]">
          <Image
            src="/assets/images/image-setting-help.png"
            style={{ objectFit: 'contain' }}
            alt="image-setting-help"
            fill
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="font-20-bold">
          {t('title-box.image-storage-integration')}
        </h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleTestConnection}
        >
          Test Connection
        </button>
      </div>
      <FormProvider {...methods}>
        <ImageConfigForm />
      </FormProvider>
    </SettingMenuTemplate>
  );
};

export default ImageConfigSetting;
