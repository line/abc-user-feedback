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
import type { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';
import { createMocks } from 'node-mocks-http';

import { simpleMockHttp } from '@/msw';
import handler from '@/pages/api/login';

describe('Login API', () => {
  test('success', async () => {
    const jwt = {
      accessToken: faker.string.nanoid(),
      refreshToken: faker.string.nanoid(),
    };
    simpleMockHttp('post', '/api/admin/auth/signIn/email', 201, jwt);

    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body,
    });

    req.session = { destroy: jest.fn(), save: jest.fn() };

    await handler(req, res);

    expect(res._getData()).toEqual(jwt);
    expect(req.session.save).toHaveBeenCalled();
  });
  test('error', async () => {
    const data = { message: 'error' };

    simpleMockHttp('post', '/api/admin/auth/signIn/email', 500, data);

    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body,
    });

    await handler(req, res);

    expect(res._getData()).toEqual(data);
  });
  test('invalid input', async () => {
    const body = {};

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toEqual(400);
  });

  test('method not allowed', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: faker.helpers.arrayElement(['GET', 'PUT', 'PATCH', 'DELETE']),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toEqual(405);
  });
});
