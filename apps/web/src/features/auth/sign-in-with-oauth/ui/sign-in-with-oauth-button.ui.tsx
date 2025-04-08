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

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Button } from '@ufb/react';

import { useOAIQuery } from '@/shared';
import { useTenantStore } from '@/entities/tenant';

interface IProps {}

const SignInWithOAuthButton: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { tenant } = useTenantStore();

  const callback_url = (router.query.callback_url ?? '') as string;

  const { data } = useOAIQuery({
    path: '/api/admin/auth/signIn/oauth/loginURL',
    queryOptions: { enabled: tenant?.useOAuth ?? false },
    variables: { callback_url },
  });

  if (tenant?.oauthConfig?.loginButtonType === 'GOOGLE') {
    return (
      <Button
        variant="outline"
        size="medium"
        disabled={!data?.url}
        onClick={() => router.push(data?.url ?? '')}
      >
        <Image
          src="/assets/images/google.svg"
          alt="Google"
          width={24}
          height={24}
        />
        Google {t('button.sign-in')}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="medium"
      disabled={!data?.url}
      onClick={() => router.push(data?.url ?? '')}
    >
      {tenant?.oauthConfig?.loginButtonName ??
        `OAuth 2.0 ${t('button.sign-in')}`}
    </Button>
  );
};

export default SignInWithOAuthButton;
