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
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Path } from '@/shared';
import { useOAuthCallback } from '@/features/auth/sign-in-with-oauth';

interface IProps {}

const OAuthCallbackPage: NextPage<IProps> = () => {
  const { status } = useOAuthCallback();
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {status === 'loading' && (
        <p className="font-32-bold animate-bounce">Loading...</p>
      )}
      {status === 'error' && (
        <div>
          <p className="font-32-bold">Error!!!</p>
          <button className="btn" onClick={() => router.replace(Path.SIGN_IN)}>
            Go to home
          </button>
        </div>
      )}
    </div>
  );
};

export default OAuthCallbackPage;
