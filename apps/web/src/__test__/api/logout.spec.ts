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

import handler from '@/pages/api/logout';

jest.mock('iron-session');
const mockDestory = jest.fn();
const mockSave = jest.fn();

jest.spyOn(IronSession, 'getIronSession').mockImplementation(async () => ({
  destroy: mockDestory,
  save: mockSave,
  updateConfig: jest.fn(),
}));

describe('Logout API', () => {
  test('logout', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(mockDestory).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
    expect(res._getData()).toEqual({ ok: true });
  });
  test('method not allowed', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: faker.helpers.arrayElement(['POST', 'PUT', 'PATCH', 'DELETE']),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toEqual(405);
  });
});
