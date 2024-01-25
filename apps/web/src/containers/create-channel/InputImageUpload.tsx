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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Input, toast } from '@ufb/ui';

import { useCreateChannel } from '@/contexts/create-channel.context';
import { useOAIMutation } from '@/hooks';
import type { InputImageConfigType } from '@/types/channel.type';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

const defaultInputError = {};

interface IProps {}

const InputImageUpload: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { input, onChangeInput } = useCreateChannel();
  const router = useRouter();
  const projectId = useMemo(
    () => Number(router.query.projectId),
    [router.query.projectId],
  );

  const [inputError, setInputError] = useState<{
    name?: string;
    description?: string;
  }>(defaultInputError);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const { accessKeyId, bucket, endpoint, region, secretAccessKey } = useMemo(
    () =>
      input.imageConfig ?? {
        accessKeyId: '',
        bucket: '',
        endpoint: '',
        region: '',
        secretAccessKey: '',
      },
    [input.imageConfig],
  );

  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmitted(false);
    setIsLoading(false);
  }, [defaultInputError]);

  useEffect(() => {
    resetError();
  }, [input.channelInfo]);

  const onChangeProjectInfo = useCallback(
    <T extends keyof InputImageConfigType>(
      key: T,
      value: InputImageConfigType[T],
    ) => {
      onChangeInput('imageConfig', {
        accessKeyId,
        bucket,
        endpoint,
        region,
        secretAccessKey,
        [key]: value,
      });
    },
    [input.channelInfo],
  );
  const { mutate: testConection } = useOAIMutation({
    method: 'post',
    path: '/api/projects/{projectId}/channels/image-upload-url-test',
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

  const handleTestConnection = () => {
    if (!input.imageConfig) return;
    testConection(input.imageConfig);
  };

  return (
    <CreateChannelInputTemplate
      disableNextBtn={
        !!inputError.name || !!inputError.description || isLoading
      }
    >
      <Input
        label="Access Key ID"
        placeholder={t('placeholder', { name: 'Access Key ID' })}
        value={accessKeyId}
        onChange={(e) => onChangeProjectInfo('accessKeyId', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.name}
        hint={inputError.name}
      />
      <Input
        label="Secret Access Key ID"
        placeholder={t('placeholder', { name: 'Secret Access Key ID' })}
        value={bucket}
        onChange={(e) => onChangeProjectInfo('secretAccessKey', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
      />
      <Input
        label="End Point"
        placeholder={t('placeholder', { name: 'End Point' })}
        value={endpoint}
        onChange={(e) => onChangeProjectInfo('endpoint', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.name}
        hint={inputError.name}
      />
      <Input
        label="Region"
        placeholder={t('placeholder', { name: 'Region' })}
        value={region}
        onChange={(e) => onChangeProjectInfo('region', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
      />
      <Input
        label="Bucket Name"
        placeholder={t('placeholder', { name: 'Bucket Name' })}
        value={secretAccessKey}
        onChange={(e) => onChangeProjectInfo('bucket', e.target.value)}
        isSubmitted={isSubmitted}
        isValid={!inputError.description}
        hint={inputError.description}
      />
      <button
        className="btn btn-secondary btn-lg w-fit"
        type="button"
        onClick={handleTestConnection}
      >
        Test Connection
      </button>
    </CreateChannelInputTemplate>
  );
};

export default InputImageUpload;
