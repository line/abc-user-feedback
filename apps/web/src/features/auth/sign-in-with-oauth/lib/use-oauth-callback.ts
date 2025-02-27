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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { toast } from '@ufb/react';

import { useUserStore } from '@/entities/user';

export const useOAuthCallback = () => {
  const router = useRouter();

  const { signInWithOAuth } = useUserStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  const code = router.query.code as string | undefined;
  const callback_url = router.query.callback_url as string | undefined;

  useEffect(() => {
    if (!code) return;

    signInWithOAuth({ code, callback_url }).catch(() => {
      toast.error('OAuth2.0 Login Error');
      setStatus('error');
    });
  }, [code, callback_url]);

  return { status };
};
