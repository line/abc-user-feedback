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
import mockRouter from 'next-router-mock';

import { render, screen } from '@/test-utils';
import MainLayout from './main-layout.ui';

describe('MainLayout', () => {
  beforeEach(() => {
    mockRouter.pathname = '/';
  });
  test('snapshot default', () => {
    const { container } = render(<MainLayout />);
    expect(container).toMatchSnapshot();
  });

  test('snapshot center', () => {
    const { container } = render(<MainLayout center />);
    expect(container).toMatchSnapshot();
  });

  test('snapshot with sidenav', () => {
    mockRouter.pathname = '/main/project/[projectId]';
    const { container } = render(<MainLayout />);

    expect(container).toMatchSnapshot();
  });

  test('should render children', () => {
    const TEXT = faker.string.sample();
    render(<MainLayout>{TEXT}</MainLayout>);
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });
});
