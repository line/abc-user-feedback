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
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import mockRouter from 'next-router-mock';

import { Path } from '@/constants/path';
import { env } from '@/env.mjs';
import { server } from '@/msw';
import { act, render, screen, waitFor } from '@/utils/test-utils';
import CreateTenantForm from './create-tenant-form.ui';
import { DEFAULT_SUPER_ACCOUNT } from './default-super-account.constant';

describe('CreateTenantForm', () => {
  test('should render the form', async () => {
    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json({ statusCode: 200 }, { status: 201 });
      }),
      http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json({ statusCode: 200 }, { status: 201 });
      }),
    );
    render(<CreateTenantForm />);

    const button = screen.getByRole('button');
    const input = screen.getByPlaceholderText('Please enter the site name');

    await userEvent.type(input, 'test');

    await act(async () => {
      await userEvent.click(button);
    });

    await waitFor(() => {
      expect(mockRouter).toMatchObject({ pathname: Path.SIGN_IN });
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(DEFAULT_SUPER_ACCOUNT.email, 'i')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(DEFAULT_SUPER_ACCOUNT.password, 'i')),
      ).toBeInTheDocument();
    });
  });
});
