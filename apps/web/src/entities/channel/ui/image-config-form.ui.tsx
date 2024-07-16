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
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Badge, TextInput } from '@ufb/ui';

import type { ChannelImageConfig } from '../channel.type';

interface IProps {
  readOnly?: boolean;
}

const ImageConfigForm: React.FC<IProps> = (props) => {
  const { readOnly = false } = props;

  const { t } = useTranslation();

  const [inputDomain, setInputDomain] = useState('');

  const { register, formState, watch, setValue, setError, clearErrors } =
    useFormContext<ChannelImageConfig>();

  const domainWhiteList = watch('domainWhiteList');

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

    setValue('domainWhiteList', domainWhiteList.concat(inputDomain));
    clearErrors('domainWhiteList');
    setInputDomain('');
  };

  const removeDomainWhiteList = (index: number) => {
    if (!domainWhiteList) return;
    setValue(
      'domainWhiteList',
      domainWhiteList.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <TextInput
        label="Access Key ID"
        placeholder={t('placeholder', { name: 'Access Key ID' })}
        {...register('accessKeyId')}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.accessKeyId?.message}
        isValid={!formState.errors.accessKeyId}
        disabled={readOnly}
      />
      <TextInput
        {...register('secretAccessKey')}
        label="Secret Access Key"
        placeholder={t('placeholder', { name: 'Secret Access Key' })}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.secretAccessKey?.message}
        isValid={!formState.errors.secretAccessKey}
        disabled={readOnly}
      />
      <TextInput
        {...register('endpoint')}
        label="End Point"
        placeholder={t('placeholder', { name: 'End Point' })}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.endpoint?.message}
        isValid={!formState.errors.endpoint}
        disabled={readOnly}
      />
      <TextInput
        {...register('region')}
        label="Region"
        placeholder={t('placeholder', { name: 'Region' })}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.region?.message}
        isValid={!formState.errors.region}
        disabled={readOnly}
      />
      <TextInput
        {...register('bucket')}
        label="Bucket Name"
        placeholder={t('placeholder', { name: 'Bucket Name' })}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.bucket?.message}
        isValid={!formState.errors.bucket}
        disabled={readOnly}
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-20-bold">Image URL Domain Whitelist</h2>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={!!domainWhiteList}
            onChange={(e) => {
              setValue('domainWhiteList', e.target.checked ? [] : null);
            }}
            disabled={readOnly}
          />
        </div>
        {domainWhiteList && (
          <>
            <TextInput
              label="URL Domain"
              placeholder="example.com"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              rightChildren={
                <button
                  type="button"
                  className="btn btn-xs btn-rounded btn-primary"
                  onClick={addDomainWhiteList}
                  disabled={readOnly}
                >
                  {t('button.register')}
                </button>
              }
              isValid={!formState.errors.domainWhiteList}
              hint={formState.errors.domainWhiteList?.message}
              isSubmitting={formState.isSubmitting}
              isSubmitted={formState.isSubmitted}
              required
              disabled={readOnly}
            />
            <div className="flex items-center gap-2">
              {domainWhiteList.map((domain, index) => (
                <Badge
                  key={index}
                  type="secondary"
                  right={{
                    iconName: 'Close',
                    onClick: () => removeDomainWhiteList(index),
                    disabled: readOnly,
                  }}
                >
                  {domain}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageConfigForm;
