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

import { Badge, Input, toast } from '@ufb/ui';

import { useCreateChannel } from '@/contexts/create-channel.context';
import { useOAIMutation } from '@/hooks';
import type { InputImageConfigType } from '@/types/channel.type';
import CreateChannelInputTemplate from './CreateChannelInputTemplate';

type InputErrorType = {
  accessKeyId?: string;
  bucket?: string;
  endpoint?: string;
  region?: string;
  secretAccessKey?: string;
  domainWhiteList?: string;
};

const defaultInputError = {};

interface IProps {}

const InputImageSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { input, onChangeInput } = useCreateChannel();
  const router = useRouter();

  const projectId = useMemo(
    () => Number(router.query.projectId),
    [router.query.projectId],
  );

  const [inputError, setInputError] =
    useState<InputErrorType>(defaultInputError);

  const setError = useCallback(
    <T extends keyof InputErrorType>(key: T, value: { message: string }) => {
      setInputError((prev) => ({ ...prev, [key]: value.message }));
    },
    [],
  );
  const [isSubmittedWhiteList, setIsSubmittedWhiteList] =
    useState<boolean>(false);
  const [isSubmittedConfig, setIsSubmittedConfig] = useState<boolean>(false);

  const [inputDomain, setInputDomain] = useState('');

  const {
    accessKeyId,
    bucket,
    endpoint,
    region,
    secretAccessKey,
    domainWhiteList,
  } = useMemo(
    () =>
      input.imageConfig ?? {
        accessKeyId: '',
        bucket: '',
        endpoint: '',
        region: '',
        secretAccessKey: '',
        domainWhiteList: null,
      },
    [input.imageConfig],
  );

  const resetError = useCallback(() => {
    setInputError(defaultInputError);
    setIsSubmittedConfig(false);
    setIsSubmittedWhiteList(false);
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
        domainWhiteList,
        [key]: value,
      });
    },
    [input.channelInfo],
  );

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

  const handleTestConnection = () => {
    setIsSubmittedConfig(true);
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
    testConection(input.imageConfig);
  };

  const addDomainWhiteList = () => {
    if (!domainWhiteList) return;

    if (domainWhiteList.includes(inputDomain)) {
      setError('domainWhiteList', {
        message: t('hint.name-already-exists', { name: 'Domain' }),
      });
      return;
    }

    if (!/[a-z]+\.[a-z]{2,3}/.test(inputDomain)) {
      setError('domainWhiteList', { message: t('hint.invalid-domain') });
      return;
    }

    onChangeProjectInfo('domainWhiteList', domainWhiteList.concat(inputDomain));
    setInputError(defaultInputError);
    setInputDomain('');
  };

  const removeDomainWhiteList = (index: number) => {
    if (!domainWhiteList) return;
    onChangeProjectInfo(
      'domainWhiteList',
      domainWhiteList.filter((_, i) => i !== index),
    );
  };
  const validate = () => {
    setIsSubmittedWhiteList(true);
    if (domainWhiteList?.length === 0) {
      setError('domainWhiteList', { message: t('hint.required') });
      return false;
    }
    return true;
  };

  return (
    <CreateChannelInputTemplate
      disableNextBtn={!!inputError.domainWhiteList}
      validate={validate}
    >
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-20-bold">
            {t('image-mgmt-setting.image-storage-integration-setting')}
          </h2>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleTestConnection}
          >
            Test Connection
          </button>
        </div>
        <Input
          label="Access Key ID"
          placeholder={t('placeholder', { name: 'Access Key ID' })}
          value={accessKeyId}
          onChange={(e) => onChangeProjectInfo('accessKeyId', e.target.value)}
          isSubmitted={isSubmittedConfig}
          isValid={!inputError.accessKeyId}
          hint={inputError.accessKeyId}
        />
        <Input
          label="Secret Access Key ID"
          placeholder={t('placeholder', { name: 'Secret Access Key ID' })}
          value={secretAccessKey}
          onChange={(e) =>
            onChangeProjectInfo('secretAccessKey', e.target.value)
          }
          isSubmitted={isSubmittedConfig}
          isValid={!inputError.secretAccessKey}
          hint={inputError.secretAccessKey}
        />
        <Input
          label="End Point"
          placeholder={t('placeholder', { name: 'End Point' })}
          value={endpoint}
          onChange={(e) => onChangeProjectInfo('endpoint', e.target.value)}
          isSubmitted={isSubmittedConfig}
          isValid={!inputError.endpoint}
          hint={inputError.endpoint}
        />
        <Input
          label="Region"
          placeholder={t('placeholder', { name: 'Region' })}
          value={region}
          onChange={(e) => onChangeProjectInfo('region', e.target.value)}
          isSubmitted={isSubmittedConfig}
          isValid={!inputError.region}
          hint={inputError.region}
        />
        <Input
          label="Bucket Name"
          placeholder={t('placeholder', { name: 'Bucket Name' })}
          value={bucket}
          onChange={(e) => onChangeProjectInfo('bucket', e.target.value)}
          isSubmitted={isSubmittedConfig}
          isValid={!inputError.bucket}
          hint={inputError.bucket}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-20-bold">Image URL Domain Whitelist</h2>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={!!domainWhiteList}
            onChange={(e) => {
              setIsSubmittedWhiteList(false);
              onChangeProjectInfo(
                'domainWhiteList',
                e.target.checked ? [] : null,
              );
            }}
          />
        </div>
        {domainWhiteList && (
          <>
            <Input
              label="URL Domain"
              placeholder="example.com"
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
              isValid={!inputError.domainWhiteList}
              hint={inputError.domainWhiteList}
              isSubmitted={isSubmittedWhiteList}
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
                  }}
                >
                  {domain}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </CreateChannelInputTemplate>
  );
};

export default InputImageSetting;
