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
import { toast } from '@ufb/ui';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { Path } from '@/constants/path';
import { useUser } from '@/hooks';

interface IProps {}
const OAuthCallbackPage: NextPage<IProps> = ({}) => {
  const { signInOAuth } = useUser();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  const router = useRouter();
  const code = useMemo(
    () => router.query?.code as string | undefined,
    [router.query],
  );

  useEffect(() => {
    if (!code) return;
    signInOAuth({ code }).catch(() => {
      toast.negative({ title: 'OAuth2.0 Login Error' });
      router.replace(Path.SIGN_IN);
      setStatus('error');
    });
  }, [code]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <h1 className="font-32-bold animate-bounce">
        {status === 'loading'
          ? 'Loading...'
          : status === 'error'
          ? 'Error!!!'
          : ''}
      </h1>
    </div>
  );
};

export default OAuthCallbackPage;
