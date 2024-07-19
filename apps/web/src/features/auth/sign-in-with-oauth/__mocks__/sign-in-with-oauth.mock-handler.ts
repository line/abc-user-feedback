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
import { faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';

import { env } from '@/env';

export const signInWithOAuthMockHandlers = [
  http.get(
    `${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/auth/signIn/oauth/loginURL`,
    () => {
      return HttpResponse.json({ url: faker.internet.url() }, { status: 200 });
    },
  ),
];
