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

import { http, HttpResponse } from 'msw';
import mockRouter from 'next-router-mock';

import { useTenantState } from '../tenant.model';
import { TenantGuard } from './tenant-guard.ui';

import { Path } from '@/constants/path';
import { env } from '@/env.mjs';
import { server } from '@/msw';
import { render, screen, waitFor } from '@/utils/test-utils';

const INITIAL_PATH = '/';

describe('TenantGuard', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl(INITIAL_PATH);
  });
  test('Not found tenant', async () => {
    server.use(
      http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json({ statusCode: 404 }, { status: 404 });
      }),
    );
    render(<TenantGuard />);
    await waitFor(() => {
      expect(mockRouter).toMatchObject({ pathname: Path.CREATE_TENANT });
    });
  });
  test('Found tenant', async () => {
    const MOCK_TENANT_DATA = { id: 1 };

    server.use(
      http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/api/admin/tenants`, () => {
        return HttpResponse.json(MOCK_TENANT_DATA, { status: 200 });
      }),
    );

    const TenantTestComponent = () => {
      const tenant = useTenantState();
      return (
        <TenantGuard>
          <p>{tenant?.id}</p>
        </TenantGuard>
      );
    };

    render(<TenantTestComponent />);

    await waitFor(() => {
      expect(screen.getByText(MOCK_TENANT_DATA.id)).toBeInTheDocument();
    });
  });
});
