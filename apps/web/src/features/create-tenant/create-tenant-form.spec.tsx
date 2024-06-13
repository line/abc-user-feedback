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
import { http, HttpResponse } from 'msw';

import CreateTenantForm from './create-tenant-form.ui';
import { DEFAULT_SUPER_ACCOUNT } from './default-super-account.constant';

import { env } from '@/env.mjs';
import { server } from '@/msw';
import { render, screen, waitFor } from '@/utils/test-utils';

describe('CreateTenantForm', () => {
  test('An input length  should be at least 3', async () => {
    render(<CreateTenantForm />);
    const input = screen.getByPlaceholderText('Please enter the site name');
    const submitBtn = screen.getByRole('button');

    await userEvent.type(input, faker.string.alphanumeric(1));

    expect(submitBtn).toBeDisabled();
  });

  test('On Success', async () => {
    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json({}, { status: 200 });
      }),
      http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json({}, { status: 200 });
      }),
    );

    render(<CreateTenantForm />);
    const input = screen.getByPlaceholderText('Please enter the site name');
    const submitBtn = screen.getByRole('button');

    await userEvent.type(input, 'test');

    expect(submitBtn).not.toBeDisabled();

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(new RegExp('success', 'i'))).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(DEFAULT_SUPER_ACCOUNT.email, 'i')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(DEFAULT_SUPER_ACCOUNT.password, 'i')),
      ).toBeInTheDocument();
    });
  });
  test('On Error', async () => {
    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    render(<CreateTenantForm />);
    const input = screen.getByPlaceholderText('Please enter the site name');
    const submitBtn = screen.getByRole('button');

    await userEvent.type(input, 'test');
    await userEvent.click(submitBtn);

    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
  });
});
