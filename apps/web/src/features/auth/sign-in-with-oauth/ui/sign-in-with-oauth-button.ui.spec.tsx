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
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';

import type { Tenant } from '@/entities/tenant';
import { useTenantStore } from '@/entities/tenant';

import SignInWithOAuthButton from './sign-in-with-oauth-button.ui';

import { simpleMockHttp } from '@/msw';
import { render, screen, waitFor } from '@/test-utils';

describe('SignInWithOAuthButton', () => {
  test('match snapshot', () => {
    const component = render(<SignInWithOAuthButton />);
    expect(component.container).toMatchSnapshot();
  });
  test('loginUrl', async () => {
    useTenantStore.setState({ tenant: { useOAuth: true } as Tenant });
    const pathname = `/${Array.from({
      length: faker.number.int({ min: 1, max: 5 }),
    })
      .map(() => faker.string.alphanumeric({ length: { min: 1, max: 5 } }))
      .join('/')}`;

    simpleMockHttp({
      method: 'get',
      path: '/api/admin/auth/signIn/oauth/loginURL',
      status: 200,
      data: { url: pathname },
    });

    render(<SignInWithOAuthButton />);

    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled());
    await userEvent.click(screen.getByRole('button'));

    expect(mockRouter).toMatchObject({ asPath: pathname });
  });
});
