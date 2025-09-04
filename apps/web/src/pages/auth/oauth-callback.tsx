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
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Button } from '@ufb/react';

import { Path } from '@/shared';
import { useOAuthCallback } from '@/features/auth';

interface IProps {}

const OAuthCallbackPage: NextPage<IProps> = () => {
  const { status } = useOAuthCallback();
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      {status === 'loading' && (
        <p className="text-title-h1 animate-bounce">Loading...</p>
      )}
      {status === 'error' && (
        <>
          <p className="text-title-h1">Error!!!</p>
          <p className="text-title-h4">Please check the toast.</p>
          <Button onClick={() => router.push(Path.SIGN_IN)}>Go to home</Button>
        </>
      )}
    </div>
  );
};

export default OAuthCallbackPage;
