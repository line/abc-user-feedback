/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { Badge, Button, Divider, Icon, toast } from '@ufb/react';

import {
  ComboboxInputbox,
  SelectInput,
  TextInput,
  useOAIMutation,
} from '@/shared';

import type { ChannelImageConfig } from '../channel.type';

interface IProps {
  readOnly?: boolean;
}

const ImageConfigForm: React.FC<IProps> = (props) => {
  const { readOnly = false } = props;

  const { t } = useTranslation();

  const [inputDomain, setInputDomain] = useState('');
  const [connectionError, setConnectionError] = useState(false);

  const {
    register,
    formState,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useFormContext<ChannelImageConfig>();

  const domainWhiteList = watch('domainWhiteList');

  const addDomainWhiteList = (value: string) => {
    if (domainWhiteList?.includes(value)) {
      setError('domainWhiteList', {
        message: t('hint.name-already-exists', { name: 'Domain' }),
      });
      return;
    }

    if (!/[a-z]+\.[a-z]{2,3}/.test(value)) {
      setError('domainWhiteList', { message: t('hint.invalid-domain') });
      return;
    }

    setValue('domainWhiteList', (domainWhiteList ?? []).concat(value), {
      shouldDirty: true,
    });
    clearErrors('domainWhiteList');
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
  const { mutate: testConection } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/channels/image-upload-url-test',
    pathParams: { projectId: 0 },
    queryOptions: {
      onSuccess(data) {
        if (data?.success) {
          toast.success(t('v2.toast.success'));
        } else {
          setError('accessKeyId', { message: '' });
          setError('bucket', { message: '' });
          setError('endpoint', { message: '' });
          setError('region', { message: '' });
          setError('root', { message: '' });
          setError('secretAccessKey', { message: '' });
          toast.error('Test Connection failed');
          setConnectionError(false);
          setConnectionError(true);
        }
      },
      onError() {
        toast.error('Test Connection failed');
        setConnectionError(true);
      },
    },
  });

  const handleTestConnection = () => {
    let isError = false;
    const { accessKeyId, bucket, endpoint, region, secretAccessKey } =
      getValues();
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
    if (isError) {
      setConnectionError(true);
      return;
    }
    testConection(getValues());
  };

  return (
    <div>
      <div className="border-neutral-tertiary mb-4 flex flex-col gap-6 rounded border p-4">
        <h5 className="text-title-h5">
          {t('title-box.image-storage-integration')}
        </h5>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Access Key ID"
            placeholder={t('v2.placeholder.text')}
            {...register('accessKeyId')}
            error={formState.errors.accessKeyId?.message}
            disabled={readOnly}
          />
          <TextInput
            {...register('secretAccessKey')}
            label="Secret Access Key"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.secretAccessKey?.message}
            disabled={readOnly}
          />
          <TextInput
            {...register('endpoint')}
            label="End Point"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.endpoint?.message}
            disabled={readOnly}
          />
          <TextInput
            {...register('region')}
            label="Region"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.region?.message}
            disabled={readOnly}
          />
          <TextInput
            {...register('bucket')}
            label="Bucket Name"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.bucket?.message}
            disabled={readOnly}
          />
          <SelectInput
            options={[
              { label: 'Enable', value: 'true' },
              { label: 'Disable', value: 'false' },
            ]}
            value={
              typeof watch('enablePresignedUrlDownload') !== 'undefined' ?
                String(watch('enablePresignedUrlDownload'))
              : ''
            }
            placeholder={t('v2.placeholder.select')}
            onChange={(v) =>
              setValue('enablePresignedUrlDownload', v === 'true', {
                shouldDirty: true,
              })
            }
            label="Presigned URL Download"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="btn btn-secondary"
            onClick={handleTestConnection}
          >
            Test Connection
          </Button>
          {connectionError && (
            <div className="text-tint-red flex items-center gap-1">
              <Icon name="RiErrorWarningFill" size={20} />
              <span>{t('v2.text.test-connection-failed')}</span>
            </div>
          )}
        </div>
      </div>
      <div className="border-neutral-tertiary flex flex-col gap-2 rounded border p-4">
        <h5 className="text-title-h5">Image URL Domain Whitelist</h5>
        <div className="flex gap-4">
          <ComboboxInputbox
            clearError={() => clearErrors('domainWhiteList')}
            inputValue={inputDomain}
            setInputValue={setInputDomain}
            onSelectValue={addDomainWhiteList}
            error={formState.errors.domainWhiteList?.message}
            placeholder="example.com"
          >
            Whitelist
          </ComboboxInputbox>
          <Divider orientation="vertical" className="h-5" variant="subtle" />
          <div className="flex items-center gap-2">
            {!domainWhiteList || domainWhiteList.length === 0 ?
              <p className="text-neutral-tertiary">
                {t('v2.text.all-image-url-allow')}
              </p>
            : domainWhiteList.map((domain, index) => (
                <Badge
                  key={index}
                  className="flex items-center"
                  variant="subtle"
                >
                  {domain}
                  <Icon
                    name="RiCloseLine"
                    onClick={() => removeDomainWhiteList(index)}
                    size={16}
                  />
                </Badge>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConfigForm;
