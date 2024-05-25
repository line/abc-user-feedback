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

import { useOAuthCallback } from '@/features/auth/sign-in-with-oauth';

interface IProps {}

const OAuthCallbackPage: NextPage<IProps> = () => {
  const { status } = useOAuthCallback();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <p className="font-32-bold animate-bounce">
        {status === 'loading' ?
          'Loading...'
        : status === 'error' ?
          'Error!!!'
        : ''}
      </p>
    </div>
  );
};

export default OAuthCallbackPage;
