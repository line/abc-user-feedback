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
import * as IronSession from 'iron-session';
import { createMocks } from 'node-mocks-http';

import { simpleMockHttp } from '@/msw';
import handler from '@/pages/api/oauth';

jest.mock('iron-session');

describe('OAuth API', () => {
  test('success', async () => {
    const jwt = {
      accessToken: faker.string.nanoid(),
      refreshToken: faker.string.nanoid(),
    };
    simpleMockHttp({
      method: 'get',
      path: '/api/admin/auth/signIn/oauth',
      status: 200,
      data: jwt,
    });

    const mockSave = jest.fn();
    jest.spyOn(IronSession, 'getIronSession').mockImplementation(async () => ({
      destroy: jest.fn(),
      save: mockSave,
      updateConfig: jest.fn(),
    }));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { code: faker.string.nanoid() },
    });

    await handler(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res._getData()).toEqual(jwt);
  });

  test('error', async () => {
    const jwt = {
      accessToken: faker.string.nanoid(),
      refreshToken: faker.string.nanoid(),
    };

    simpleMockHttp({
      method: 'get',
      path: '/api/admin/auth/signIn/oauth',
      status: 500,
    });

    const mockSave = jest.fn();
    jest.spyOn(IronSession, 'getIronSession').mockImplementation(async () => ({
      destroy: jest.fn(),
      save: mockSave,
      updateConfig: jest.fn(),
    }));

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { code: faker.string.nanoid() },
    });

    await handler(req, res);

    expect(mockSave).not.toHaveBeenCalled();
    expect(res._getData()).not.toEqual(jwt);
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
    simpleMockHttp({ method: 'get', path: '/api/admin/auth/signIn/oauth' });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: faker.helpers.arrayElement(['GET', 'PUT', 'PATCH', 'DELETE']),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toEqual(405);
  });
});
