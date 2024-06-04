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
import { env } from 'process';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { signInWithOAuthMockHandlers } from './features/auth/sign-in-with-oauth/__mocks__/sign-in-with-oauth.mock-handler';
import type { OAIMethodPathKeys, OAIMethods } from './types/openapi.type';

export const server = setupServer(...signInWithOAuthMockHandlers);

export const simpleMockHttp = <M extends OAIMethods>(
  method: M,
  path: OAIMethodPathKeys<M>,
  status: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500 = 200,
  body: Record<string, unknown> = {},
) =>
  server.use(
    http[method](`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, () =>
      HttpResponse.json(body, { status }),
    ),
  );
