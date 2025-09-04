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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

import { toast } from '@ufb/react';

import type { IFetchError } from '@/shared';

import { useAuth } from '../contexts';

export const useOAuthCallback = () => {
  const router = useRouter();

  const { signInWithOAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  const code = router.query.code as string | undefined;

  const signIn = async () => {
    if (!code) return;
    try {
      await signInWithOAuth({ code });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const message = error.response.data as IFetchError;
        toast.error(
          message.message ??
            message.axiosError?.error ??
            'An error occurred during OAuth2.0 login. Please contact the administrator.',
        );
      } else {
        toast.error(
          'An error occurred during OAuth2.0 login. Please contact the administrator.',
        );
      }
      setStatus('error');
    }
  };

  useEffect(() => {
    void signIn();
  }, [code]);

  return { status };
};
