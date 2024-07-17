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

import type { Tenant } from '@/entities/tenant';
import { useTenantStore } from '@/entities/tenant';

import SignInPage from '@/pages/auth/sign-in';
import { render, screen } from '@/test-utils';

const DEFAULT_TENANT: Tenant = {
  id: 1,
  siteName: faker.string.sample(),
  description: null,
  allowDomains: [],
  isPrivate: false,
  useEmail: true,
  isRestrictDomain: false,
  oauthConfig: null,
  useEmailVerification: true,
  useOAuth: true,
};

describe('Sign In Page', () => {
  test('should render all allow', () => {
    useTenantStore.setState({ tenant: { ...DEFAULT_TENANT } });
    const signInPage = SignInPage.getLayout?.(<SignInPage />);

    const { container } = render(<>{signInPage}</>);
    expect(container).toMatchSnapshot();

    const signInBtn = screen.queryByRole('button', { name: 'button.sign-in' });
    expect(signInBtn).toBeInTheDocument();

    const signUpBtn = screen.queryByRole('button', { name: 'button.sign-up' });
    expect(signUpBtn).toBeInTheDocument();

    const oauthBtn = screen.queryByRole('button', { name: /OAuth2.0/ });
    expect(oauthBtn).toBeInTheDocument();
  });
  test('should render when isPrivate is false', () => {
    useTenantStore.setState({ tenant: { ...DEFAULT_TENANT, isPrivate: true } });
    const signInPage = SignInPage.getLayout?.(<SignInPage />);

    const { container } = render(<>{signInPage}</>);
    expect(container).toMatchSnapshot();

    const signInBtn = screen.queryByRole('button', { name: 'button.sign-in' });
    expect(signInBtn).toBeInTheDocument();

    const signUpBtn = screen.queryByRole('button', { name: 'button.sign-up' });
    expect(signUpBtn).not.toBeInTheDocument();

    const oauthBtn = screen.queryByRole('button', { name: /OAuth2.0/ });
    expect(oauthBtn).toBeInTheDocument();
  });
  test('should render when useOAuth is false', () => {
    useTenantStore.setState({ tenant: { ...DEFAULT_TENANT, useOAuth: false } });
    const signInPage = SignInPage.getLayout?.(<SignInPage />);

    const { container } = render(<>{signInPage}</>);
    expect(container).toMatchSnapshot();

    const signInBtn = screen.queryByRole('button', { name: 'button.sign-in' });
    expect(signInBtn).toBeInTheDocument();

    const signUpBtn = screen.queryByRole('button', { name: 'button.sign-up' });
    expect(signUpBtn).toBeInTheDocument();

    const oauthBtn = screen.queryByRole('button', { name: /OAuth2.0/ });
    expect(oauthBtn).not.toBeInTheDocument();
  });
  test('should render when useEmail is false', () => {
    useTenantStore.setState({ tenant: { ...DEFAULT_TENANT, useEmail: false } });
    const signInPage = SignInPage.getLayout?.(<SignInPage />);

    const { container } = render(<>{signInPage}</>);
    expect(container).toMatchSnapshot();

    const signInBtn = screen.queryByRole('button', { name: 'button.sign-in' });
    expect(signInBtn).not.toBeInTheDocument();

    const signUpBtn = screen.queryByRole('button', { name: 'button.sign-up' });
    expect(signUpBtn).not.toBeInTheDocument();

    const oauthBtn = screen.queryByRole('button', { name: /OAuth2.0/ });
    expect(oauthBtn).toBeInTheDocument();
  });
});
