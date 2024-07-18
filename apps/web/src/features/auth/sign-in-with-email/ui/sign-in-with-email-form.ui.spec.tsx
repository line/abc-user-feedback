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

import type { Tenant } from '@/entities/tenant';
import { useTenantStore } from '@/entities/tenant';
import * as user from '@/entities/user';

import { render, screen, waitFor } from '@/test-utils';
import SignInWithEmailForm from './sign-in-with-email-form.ui';

jest.mock('@/entities/user');

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
  beforeEach(() => {
    useTenantStore.setState({ tenant: DEFAULT_TENANT });
    jest.spyOn(user, 'useUserStore').mockReturnValue({
      signInWithEmail: jest.fn(),
      _signIn: jest.fn(),
      setUser: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    });
  });
  test('match snapshot when tenant is not private', () => {
    useTenantStore.setState({
      tenant: { ...DEFAULT_TENANT, isPrivate: false },
    });
    const { container } = render(<SignInWithEmailForm />);
    expect(container).toMatchSnapshot();

    expect(screen.getByText('button.sign-in')).toBeInTheDocument();

    expect(screen.queryByText('button.sign-up')).toBeInTheDocument();
  });
  test('match snapshot when tenant is private', () => {
    useTenantStore.setState({ tenant: { ...DEFAULT_TENANT, isPrivate: true } });
    const { container } = render(<SignInWithEmailForm />);
    expect(container).toMatchSnapshot();

    expect(screen.getByText('button.sign-in')).toBeInTheDocument();
    expect(screen.queryByText('button.sign-up')).not.toBeInTheDocument();
  });

  test('validation', async () => {
    render(<SignInWithEmailForm />);

    const signInBtn = screen.getByRole('button', {
      name: 'button.sign-in',
    });
    const idInput = screen.getByPlaceholderText('ID');
    const passwordInput = screen.getByPlaceholderText('Password');

    await userEvent.type(idInput, faker.internet.email());
    await userEvent.type(passwordInput, faker.string.alphanumeric(9));

    expect(signInBtn).not.toBeDisabled();

    await userEvent.clear(idInput);
    await userEvent.clear(passwordInput);

    await userEvent.type(idInput, faker.string.alphanumeric(8));
    await userEvent.type(passwordInput, faker.string.alphanumeric(8));

    expect(signInBtn).toBeDisabled();

    await userEvent.clear(idInput);
    await userEvent.clear(passwordInput);

    await userEvent.type(idInput, faker.internet.email());
    await userEvent.type(passwordInput, faker.string.alphanumeric(7));

    expect(signInBtn).toBeDisabled();
  });

  describe('Submittion', () => {
    test('on Success', async () => {
      jest.spyOn(user, 'useUserStore').mockImplementation(() => ({
        signInWithEmail: jest.fn(),
        _signIn: jest.fn(),
        setUser: jest.fn(),
        signInWithOAuth: jest.fn(),
        signOut: jest.fn(),
      }));
      render(<SignInWithEmailForm />);

      const idInput = screen.getByPlaceholderText('ID');
      const passwordInput = screen.getByPlaceholderText('Password');

      await userEvent.type(idInput, faker.internet.email());
      await userEvent.type(passwordInput, faker.string.alphanumeric(9));

      const submitBtn = screen.getByRole('button', {
        name: 'button.sign-in',
      });
      await userEvent.click(submitBtn);

      await waitFor(() =>
        expect(
          screen.getByText(new RegExp('success', 'i')),
        ).toBeInTheDocument(),
      );
    });
    test('on Error', async () => {
      jest.spyOn(user, 'useUserStore').mockImplementation(() => ({
        signInWithEmail: jest.fn().mockRejectedValue(new Error()),
        _signIn: jest.fn(),
        setUser: jest.fn(),
        signInWithOAuth: jest.fn(),
        signOut: jest.fn(),
      }));
      render(<SignInWithEmailForm />);

      const idInput = screen.getByPlaceholderText('ID');
      const passwordInput = screen.getByPlaceholderText('Password');

      await userEvent.type(idInput, faker.internet.email());
      await userEvent.type(passwordInput, faker.string.alphanumeric(9));
      const submitBtn = screen.getByRole('button', {
        name: 'button.sign-in',
      });
      await userEvent.click(submitBtn);

      await waitFor(() =>
        expect(screen.getByText(new RegExp('error', 'i'))).toBeInTheDocument(),
      );
    });
  });
});
