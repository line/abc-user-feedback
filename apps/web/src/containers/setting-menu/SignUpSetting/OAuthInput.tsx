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
import { Input } from '@ufb/ui';
import { useFormContext } from 'react-hook-form';

import { ISignUpInfoForm } from './SignUpSetting';

interface IProps {}

const OAuthInput: React.FC<IProps> = () => {
  const { register } = useFormContext<ISignUpInfoForm>();
  return (
    <div className="flex flex-col gap-3 border rounded p-3">
      <Input
        {...register('oauthConfig.clientId')}
        label="Client ID"
        size="sm"
        required
      />
      <Input
        {...register('oauthConfig.clientSecret')}
        label="Client Secret"
        size="sm"
        required
      />
      <Input
        {...register('oauthConfig.authCodeRequestURL')}
        label="Authorization Code Request URL"
        size="sm"
        required
      />
      <Input
        {...register('oauthConfig.scopeString')}
        label="Scope"
        size="sm"
        required
      />
      <Input
        {...register('oauthConfig.accessTokenRequestURL')}
        label="Access Token Request URL"
        size="sm"
        required
      />
      <Input
        {...register('oauthConfig.userProfileRequestURL')}
        label="User Profile Request URL"
        size="sm"
        required
      />
      <Input
        {...register('oauthConfig.emailKey')}
        label="Email Key in Response of User Profile"
        size="sm"
        required
      />
    </div>
  );
};

export default OAuthInput;
