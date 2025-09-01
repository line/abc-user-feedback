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
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { Icon, RadioCard, RadioCardGroup } from '@ufb/react';

import { TextInput } from '@/shared';

import type { AuthInfo } from '../tenant.type';

interface IProps {
  disabled?: boolean;
}

const OAuthConfigForm: React.FC<IProps> = ({ disabled }) => {
  const { register, formState, setValue, watch } = useFormContext<AuthInfo>();
  const { t } = useTranslation();

  const loginButtonType = watch('oauthConfig.loginButtonType') ?? 'CUSTOM';

  return (
    <div className="flex flex-col gap-6">
      <RadioCardGroup
        value={loginButtonType}
        onValueChange={(v: 'GOOGLE' | 'CUSTOM') =>
          setValue('oauthConfig.loginButtonType', v, { shouldDirty: true })
        }
      >
        <RadioCard
          value="GOOGLE"
          icon={<Icon name="RiGoogleFill" />}
          title="Google Login"
        />
        <RadioCard
          value="CUSTOM"
          icon={<Icon name="RiToolsFill" />}
          title="Custom Login"
        />
      </RadioCardGroup>
      <div className="flex flex-col gap-4">
        <TextInput
          {...register('oauthConfig.clientId')}
          label="Client ID"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.clientId?.message}
          disabled={disabled}
          required
        />
        <TextInput
          {...register('oauthConfig.clientSecret')}
          label="Client Secret 1"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.clientSecret?.message}
          disabled={disabled}
          required
        />
        <TextInput
          {...register('oauthConfig.authCodeRequestURL')}
          label="Authorization Code Request URL"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.authCodeRequestURL?.message}
          disabled={disabled}
          required
        />
        <TextInput
          {...register('oauthConfig.scopeString')}
          label="Scope"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.scopeString?.message}
          disabled={disabled}
          required
        />
        <TextInput
          {...register('oauthConfig.accessTokenRequestURL')}
          label="Access Token Request URL"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.accessTokenRequestURL?.message}
          disabled={disabled}
          required
        />
        <TextInput
          {...register('oauthConfig.userProfileRequestURL')}
          label="User Profile Request URL"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.userProfileRequestURL?.message}
          disabled={disabled}
          required
        />
        <TextInput
          {...register('oauthConfig.emailKey')}
          label="Email Key in Response of User Profile"
          placeholder={t('v2.placeholder.text')}
          error={formState.errors.oauthConfig?.emailKey?.message}
          disabled={disabled}
          required
        />
        {loginButtonType === 'CUSTOM' && (
          <TextInput
            {...register('oauthConfig.loginButtonName')}
            label="Login Button Name"
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.oauthConfig?.loginButtonName?.message}
            disabled={disabled}
            required
          />
        )}
      </div>
    </div>
  );
};

export default OAuthConfigForm;
