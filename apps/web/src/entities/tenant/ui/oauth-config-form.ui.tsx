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
import { useFormContext } from 'react-hook-form';

import { TextInput } from '@ufb/ui';

import type { AuthInfo } from '../tenant.type';

interface IProps {}

const OAuthConfigForm: React.FC<IProps> = () => {
  const { register, formState } = useFormContext<AuthInfo>();
  return (
    <div className="flex flex-col gap-3 rounded border p-3">
      <TextInput
        {...register('oauthConfig.clientId')}
        label="Client ID"
        hint={formState.errors.oauthConfig?.clientSecret?.message}
        isValid={!formState.errors.oauthConfig?.clientSecret}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
      <TextInput
        {...register('oauthConfig.clientSecret')}
        label="Client Secret"
        hint={formState.errors.oauthConfig?.clientSecret?.message}
        isValid={!formState.errors.oauthConfig?.clientSecret}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
      <TextInput
        {...register('oauthConfig.authCodeRequestURL')}
        label="Authorization Code Request URL"
        hint={formState.errors.oauthConfig?.authCodeRequestURL?.message}
        isValid={!formState.errors.oauthConfig?.authCodeRequestURL}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
      <TextInput
        {...register('oauthConfig.scopeString')}
        label="Scope"
        hint={formState.errors.oauthConfig?.scopeString?.message}
        isValid={!formState.errors.oauthConfig?.scopeString}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
      <TextInput
        {...register('oauthConfig.accessTokenRequestURL')}
        label="Access Token Request URL"
        hint={formState.errors.oauthConfig?.accessTokenRequestURL?.message}
        isValid={!formState.errors.oauthConfig?.accessTokenRequestURL}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
      <TextInput
        {...register('oauthConfig.userProfileRequestURL')}
        label="User Profile Request URL"
        hint={formState.errors.oauthConfig?.userProfileRequestURL?.message}
        isValid={!formState.errors.oauthConfig?.userProfileRequestURL}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
      <TextInput
        {...register('oauthConfig.emailKey')}
        label="Email Key in Response of User Profile"
        hint={formState.errors.oauthConfig?.emailKey?.message}
        isValid={!formState.errors.oauthConfig?.emailKey}
        isSubmitted={formState.isSubmitted}
        isSubmitting={formState.isSubmitting}
        size="sm"
        required
      />
    </div>
  );
};

export default OAuthConfigForm;
