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
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { Badge, Divider, Icon } from '@ufb/react';

import { ComboboxInputbox } from '@/shared';
import type { AuthInfo } from '@/entities/tenant';

interface Props {
  disabled?: boolean;
}

const EmailConfigForm: React.FC<Props> = ({ disabled }) => {
  const { t } = useTranslation();
  const [inputDomain, setInputDomain] = useState('');
  const { formState, watch, setValue, setError, clearErrors } =
    useFormContext<AuthInfo>();

  const allowDomains = watch('allowDomains');

  const addDomainWhiteList = (value: string) => {
    if (!value.startsWith('@')) {
      setError('allowDomains', { message: t('hint.invalid-domain') });
      return;
    }
    value = value.slice(1);

    if (allowDomains?.includes(value)) {
      setError('allowDomains', {
        message: t('hint.name-already-exists', { name: 'Domain' }),
      });
      return;
    }

    if (!/[a-z]+\.[a-z]{2,3}/.test(value)) {
      setError('allowDomains', { message: t('hint.invalid-domain') });
      return;
    }

    setValue('allowDomains', (allowDomains ?? []).concat(value), {
      shouldDirty: true,
    });
    clearErrors('allowDomains');
    setInputDomain('');
  };
  const removeDomainWhiteList = (index: number) => {
    if (!allowDomains) return;
    setValue(
      'allowDomains',
      allowDomains.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <div className="flex gap-4">
      <ComboboxInputbox
        clearError={() => clearErrors('allowDomains')}
        inputValue={inputDomain}
        setInputValue={setInputDomain}
        onSelectValue={addDomainWhiteList}
        error={formState.errors.allowDomains?.message}
        disabled={disabled}
        placeholder="@example.com"
      >
        Whiltelist 설정
      </ComboboxInputbox>
      <Divider orientation="vertical" className="h-5" variant="subtle" />
      <div className="flex items-center gap-2">
        {!allowDomains || allowDomains.length === 0 ?
          <p className="text-neutral-tertiary">
            {t('v2.text.all-email-domains-allow')}
          </p>
        : allowDomains.map((domain, index) => (
            <Badge key={index} className="flex items-center" variant="subtle">
              @{domain}
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
  );
};

export default EmailConfigForm;
