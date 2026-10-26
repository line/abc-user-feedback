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
import { maskBody, maskHeaders } from './mask-sensitive';

describe('mask-sensitive', () => {
  it('masks sensitive headers case-insensitively', () => {
    expect(
      maskHeaders({
        Authorization: 'Bearer a',
        'x-api-key': 'key',
        cookie: 'c',
        host: 'localhost',
      }),
    ).toEqual({
      Authorization: '****',
      'x-api-key': '****',
      cookie: '****',
      host: 'localhost',
    });
  });

  it('masks nested sensitive body fields', () => {
    expect(
      maskBody({
        password: 'p',
        oauthConfig: { clientId: 'id', clientSecret: 's' },
        list: [{ password: 'p2' }],
      }),
    ).toEqual({
      password: '****',
      oauthConfig: { clientId: 'id', clientSecret: '****' },
      list: [{ password: '****' }],
    });
  });

  it('masks API credentials and authorization codes in the body', () => {
    expect(
      maskBody({ apiKey: 'k', accessToken: 't', code: 'c', name: 'n' }),
    ).toEqual({ apiKey: '****', accessToken: '****', code: '****', name: 'n' });
  });
});
