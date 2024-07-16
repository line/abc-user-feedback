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
import mockRouter from 'next-router-mock';

import { Path } from '@/shared';
import type { Tenant } from '@/entities/tenant';
import { useTenantStore } from '@/entities/tenant';

import CreateTenantPage from '@/pages/tenant/create';
import { render, waitFor } from '@/test-utils';

describe('Create Tenant Page', () => {
  test('match snapshot', async () => {
    const { container } = render(<CreateTenantPage />);
    expect(container).toMatchSnapshot();
  });

  test('should route sign-in page when tenant is defined', async () => {
    useTenantStore.setState({ tenant: {} as Tenant });
    const createTenantPage = CreateTenantPage.getLayout!(<CreateTenantPage />);

    render(<>{createTenantPage}</>);
    await waitFor(() =>
      expect(mockRouter).toMatchObject({ pathname: Path.SIGN_IN }),
    );
  });
});
