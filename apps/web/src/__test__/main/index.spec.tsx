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

import { MOCK_PROJECTS } from '@/entities/project/__mocks__/project.mock-data';
import type { Tenant } from '@/entities/tenant';
import { useTenantStore } from '@/entities/tenant';

import { simpleMockHttp } from '@/msw';
import MainIndexPage from '@/pages/main';
import { render } from '@/utils/test-utils';

describe('MainIndexPage', () => {
  test('should render without crashing', async () => {
    useTenantStore.setState({ state: {} as Tenant });
    simpleMockHttp({
      method: 'get',
      path: '/api/admin/projects',
      status: 200,
      data: {
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 1,
          totalPages: 1,
          currentPage: 1,
        },
        items: MOCK_PROJECTS,
      },
    });
    for (const project of MOCK_PROJECTS) {
      simpleMockHttp({
        method: 'get',
        path: '/api/admin/projects/{projectId}/feedback-count',
        params: { projectId: project.id },
        status: 200,
        data: {
          total: faker.number.int(),
        },
      });
    }
    const page = MainIndexPage.getLayout!(<MainIndexPage />);
    const { container } = render(<>{page}</>);
    expect(container).toMatchSnapshot();
  });
});
