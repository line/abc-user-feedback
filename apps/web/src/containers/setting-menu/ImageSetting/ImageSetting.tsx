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
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Badge, Input, TextInput, toast } from '@ufb/ui';

import {
  HelpCardDocs,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';

import { SettingMenuTemplate } from '@/components';

interface IForm {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  domainWhiteList: string[] | null;
}

const schema: Zod.ZodType<IForm> = z.object({
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  endpoint: z.string(),
  region: z.string(),
  bucket: z.string(),
  domainWhiteList: z.array(z.string()).or(z.null()),
});

type InputDomainState = {
  isSubmitted: boolean;
  isValid: boolean;
  hint?: string;
};

interface IProps {
  channelId: number;
  projectId: number;
}

const ImageSetting: React.FC<IProps> = ({ channelId, projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const [inputDomain, setInputDomain] = useState('');
  const [inputDomainState, setInputDomainState] = useState<InputDomainState>({
    isSubmitted: false,
    isValid: true,
  });

  const {
    register,
    formState,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
  } = useForm<IForm>({ resolver: zodResolver(schema) });

  const domainWhiteList = watch('domainWhiteList');

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess() {
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
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
    reset({
      ...data.imageConfig,
      domainWhiteList: data.imageConfig?.domainWhiteList ?? null,
    });
  }, [data]);

  const onSubmit = (input: IForm) => {
    if (!data) return;
    if (input.domainWhiteList?.length === 0) {
      setInputDomainState({
        isSubmitted: true,
        isValid: false,
        hint: t('hint.required'),
      });
    }
    mutate({ ...data, imageConfig: input });
  };

  const handleTestConnection = handleSubmit(
    ({ accessKeyId, bucket, endpoint, region, secretAccessKey }) => {
      let isError = false;
      if (accessKeyId.length === 0) {
        setError('accessKeyId', { message: t('hint.required') });
        isError = true;
      }
      if (bucket.length === 0) {
        setError('bucket', { message: t('hint.required') });
        isError = true;
      }
      if (endpoint.length === 0) {
        setError('endpoint', { message: t('hint.required') });
        isError = true;
      }
      if (region.length === 0) {
        setError('region', { message: t('hint.required') });
        isError = true;
      }
      if (secretAccessKey.length === 0) {
        setError('secretAccessKey', { message: t('hint.required') });
        isError = true;
      }
      if (isError) return;
      testConection({ accessKeyId, bucket, endpoint, region, secretAccessKey });
    },
  );

  const addDomainWhiteList = () => {
    if (!domainWhiteList) return;

    if (domainWhiteList.includes(inputDomain)) {
      setInputDomainState({
        isSubmitted: true,
        isValid: false,
        hint: t('hint.name-already-exists', { name: 'Domain' }),
      });
      return;
    }

    if (!/[a-z]+\.[a-z]{2,3}/.test(inputDomain)) {
      setInputDomainState({
        isSubmitted: true,
        isValid: false,
        hint: t('hint.invalid-domain'),
      });
      return;
    }

    setValue('domainWhiteList', domainWhiteList.concat(inputDomain), {
      shouldDirty: true,
    });

    setInputDomainState({ isSubmitted: false, isValid: true });
    setInputDomain('');
  };

  const removeDomainWhiteList = (index: number) => {
    if (!domainWhiteList) return;
    setValue(
      'domainWhiteList',
      domainWhiteList.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.image-mgmt')}
      actionBtn={{
        children: t('button.save'),
        disabled: !perms.includes('channel_image_update') || !formState.isDirty, // TODO: 권한 추가후 수정해야함.
        onClick: handleSubmit(onSubmit),
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
      <form id="form">
        <div className="mb-6 flex flex-col gap-2">
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
          <TextInput
            {...register('accessKeyId')}
            label="Access Key ID"
            placeholder={t('placeholder', { name: 'Access Key ID' })}
            disabled={!perms.includes('channel_image_update')}
            isValid={!formState.errors.accessKeyId}
            hint={formState.errors.accessKeyId?.message}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
          />
          <TextInput
            {...register('secretAccessKey')}
            label="Secret Access Key"
            placeholder={t('placeholder', { name: 'Secret Access Key' })}
            disabled={!perms.includes('channel_image_update')}
            isValid={!formState.errors.secretAccessKey}
            hint={formState.errors.secretAccessKey?.message}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
          />
          <TextInput
            {...register('endpoint')}
            label="End Point"
            placeholder={`${t('placeholder', {
              name: 'End Point',
            })} (ex: https://s3.ap-northeast-2.amazonaws.com)`}
            disabled={!perms.includes('channel_image_update')}
            isValid={!formState.errors.endpoint}
            hint={formState.errors.endpoint?.message}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
          />
          <TextInput
            {...register('region')}
            label="Region"
            placeholder={`${t('placeholder', {
              name: 'Region',
            })} (ex: ap-northeast-2)`}
            disabled={!perms.includes('channel_image_update')}
            isValid={!formState.errors.region}
            hint={formState.errors.region?.message}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
          />
          <TextInput
            {...register('bucket')}
            label="Bucket Name"
            placeholder={t('placeholder', { name: 'Bucket Name' })}
            disabled={!perms.includes('channel_image_update')}
            isValid={!formState.errors.bucket}
            hint={formState.errors.bucket?.message}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-20-bold">Image URL Domain Whitelist</h2>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              disabled={!perms.includes('channel_image_update')}
              checked={!!domainWhiteList}
              onChange={(e) =>
                setValue('domainWhiteList', e.target.checked ? [] : null, {
                  shouldDirty: true,
                })
              }
            />
          </div>
          {domainWhiteList && (
            <>
              <Input
                label="URL Domain"
                placeholder="example.com"
                disabled={!perms.includes('channel_image_update')}
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                rightChildren={
                  <button
                    type="button"
                    className="btn btn-xs btn-rounded btn-primary"
                    onClick={addDomainWhiteList}
                  >
                    {t('button.register')}
                  </button>
                }
                isValid={!inputDomainState}
                hint={inputDomainState.hint}
                isSubmitted={inputDomainState.isSubmitted}
                required
              />
              <div className="flex items-center gap-2">
                {domainWhiteList.map((domain, index) => (
                  <Badge
                    key={index}
                    type="secondary"
                    right={{
                      iconName: 'Close',
                      onClick: () => removeDomainWhiteList(index),
                      disabled: !perms.includes('channel_image_update'),
                    }}
                  >
                    {domain}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </form>
    </SettingMenuTemplate>
  );
};

export default ImageSetting;
