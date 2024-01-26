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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import { SettingMenuTemplate } from '@/components';
import { useOAIMutation, useOAIQuery } from '@/hooks';

interface IForm {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
}

const schema: Zod.ZodType<IForm> = z.object({
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  endpoint: z.string(),
  region: z.string(),
  bucket: z.string(),
});

interface IProps {
  channelId: number;
  projectId: number;
}

const ImageUploadSetting: React.FC<IProps> = ({ channelId, projectId }) => {
  const { t } = useTranslation();
  const { register, formState, handleSubmit, reset, getValues } =
    useForm<IForm>({
      resolver: zodResolver(schema),
    });

  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate } = useOAIMutation({
    method: 'put',
    path: '/api/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
  });

  const { mutate: testConection } = useOAIMutation({
    method: 'post',
    path: '/api/projects/{projectId}/channels/image-upload-url-test',
    pathParams: { projectId },
    queryOptions: {
      onSuccess(data) {
        console.log('data: ', data);
        if (data?.success) {
          toast.accent({ title: 'Test Connection Success' });
        } else {
          toast.negative({ title: 'Test Connection failed' });
        }
      },
      onError() {
        toast.negative({ title: 'Test Connection failed' });
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    reset(data.imageConfig);
  }, [data]);

  const onSubmit = (input: IForm) => {
    if (!data) return;
    mutate({ ...data, imageConfig: input });
  };
  const handleTestConnection = () => {
    if (!data) return;
    testConection(getValues());
  };

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.image-storage-integration-mgmt')}
      actionBtn={{
        children: t('button.save'),
        disabled: false, // TODO: 권한 추가후 수정해야함.
        onClick: handleSubmit(onSubmit),
        form: 'form',
      }}
    >
      <div className="flex items-center rounded border px-6 py-2">
        <p className="flex-1 whitespace-pre-line py-5">
          {t('help-card.image-storage-integration-mgmt')}
        </p>
        <div className="relative h-full w-[80px]">
          <Image
            src="/assets/images/image-upload-help.png"
            style={{ objectFit: 'contain' }}
            alt="image-upload-help"
            fill
          />
        </div>
      </div>
      <form id="form" className="flex flex-col gap-6">
        <TextInput
          {...register('accessKeyId')}
          label="Access Key ID"
          placeholder="input"
          isValid={!formState.errors.accessKeyId}
          hint={formState.errors.accessKeyId?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
        />
        <TextInput
          {...register('secretAccessKey')}
          label="Secret Access Key ID"
          placeholder="input"
          isValid={!formState.errors.secretAccessKey}
          hint={formState.errors.secretAccessKey?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
        />
        <TextInput
          {...register('endpoint')}
          label="End Point"
          placeholder="input"
          isValid={!formState.errors.endpoint}
          hint={formState.errors.endpoint?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
        />
        <TextInput
          {...register('region')}
          label="Region"
          placeholder="input"
          isValid={!formState.errors.region}
          hint={formState.errors.region?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
        />
        <TextInput
          {...register('bucket')}
          label="Bucket Name"
          placeholder="input"
          isValid={!formState.errors.bucket}
          hint={formState.errors.bucket?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
        />
        <button
          className="btn btn-secondary btn-lg w-fit"
          type="button"
          onClick={handleTestConnection}
        >
          Test Connection
        </button>
      </form>
    </SettingMenuTemplate>
  );
};

export default ImageUploadSetting;
