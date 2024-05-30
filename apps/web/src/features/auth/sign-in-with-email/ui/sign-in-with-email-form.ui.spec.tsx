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

import type { Tenant } from '@/entities/tenant';
import { useTenantStore } from '@/entities/tenant';

import SignInWithEmailForm from './sign-in-with-email-form.ui';

import { render, screen } from '@/utils/test-utils';

const DEFAULT_TENANT: Tenant = {
  allowDomains: [],
  isRestrictDomain: false,
  description: null,
  id: 1,
  oauthConfig: null,
  siteName: 'siteName',
  useEmail: true,
  useEmailVerification: true,
  useOAuth: true,
  isPrivate: false,
};

describe('SignInWithEmailForm', () => {
  test('match snapshot when tenant is not private', () => {
    useTenantStore.setState({ state: { ...DEFAULT_TENANT, isPrivate: false } });
    const component = render(<SignInWithEmailForm />);
    expect(component.container).toMatchSnapshot();

    expect(screen.getByText('button.sign-in')).toBeInTheDocument();

    expect(screen.queryByText('button.sign-up')).toBeInTheDocument();
  });
  test('match snapshot when tenant is private', () => {
    useTenantStore.setState({ state: { ...DEFAULT_TENANT, isPrivate: true } });
    const component = render(<SignInWithEmailForm />);
    expect(component.container).toMatchSnapshot();

    expect(screen.getByText('button.sign-in')).toBeInTheDocument();
    expect(screen.queryByText('button.sign-up')).not.toBeInTheDocument();
  });
});
