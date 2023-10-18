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

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { useOAIQuery, useTenant } from '@/hooks';

interface IProps {}

const OAuthLoginButton: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { tenant } = useTenant();

  const callback_url = useMemo(() => {
    return router.query.callback_url
      ? (router.query.callback_url as string)
      : undefined;
  }, [router.query]);

  const { data } = useOAIQuery({
    path: '/api/auth/signIn/oauth/loginURL',
    queryOptions: { enabled: tenant?.useOAuth ?? false },
    variables: { callback_url },
  });

  return (
    <button
      type="button"
      className="btn btn-lg btn-blue"
      onClick={() => router.push(data?.url ?? '')}
    >
      OAuth2.0 {t('button.sign-in')}
    </button>
  );
};

export default OAuthLoginButton;
