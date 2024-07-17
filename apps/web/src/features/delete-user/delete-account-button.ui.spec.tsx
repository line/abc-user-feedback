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
import { http } from 'msw';

import * as user from '@/entities/user';

import { server, simpleMockHttp } from '@/msw';
import { render, screen, waitFor } from '@/test-utils';
import DeleteAccountButton from './delete-account-button.ui';

jest.mock('@/entities/user');

const TEST_USER: user.User = {
  id: faker.number.int(),
  email: faker.internet.email(),
  name: faker.string.alphanumeric(8),
  type: faker.helpers.arrayElement(['GENERAL', 'SUPER']),
  department: faker.helpers.arrayElement([null, faker.string.alphanumeric(8)]),
  signUpMethod: 'EMAIL',
};

server.use(
  http.get('/api/logout', () => {
    return;
  }),
);

describe('DeleteAccountButton', () => {
  test('match snapshot', () => {
    jest.spyOn(user, 'useUserStore').mockImplementation(() => ({
      signInWithEmail: jest.fn(),
      _signIn: jest.fn(),
      setUser: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    }));
    const component = render(<DeleteAccountButton user={TEST_USER} />);
    expect(component.container).toMatchSnapshot();
  });

  describe('Submittion', () => {
    const mockSignOut = jest.fn();
    beforeEach(async () => {
      jest.spyOn(user, 'useUserStore').mockImplementation(() => ({
        signInWithEmail: jest.fn(),
        _signIn: jest.fn(),
        setUser: jest.fn(),
        signInWithOAuth: jest.fn(),
        signOut: mockSignOut,
      }));
      render(<DeleteAccountButton user={TEST_USER} />);
      const btn = screen.getByRole('button', {
        name: 'main.profile.button.delete-account',
      });
      await userEvent.click(btn);
    });

    test('on Success', async () => {
      simpleMockHttp({
        method: 'delete',
        path: '/api/admin/users/{id}',
        params: { id: TEST_USER.id },
      });

      const deleteBtn = screen.getByRole('button', {
        name: 'button.delete',
      });
      await userEvent.click(deleteBtn);
      await waitFor(() => expect(mockSignOut).toHaveBeenCalled());
    });
    test('on Error', async () => {
      simpleMockHttp({
        method: 'delete',
        path: '/api/admin/users/{id}',
        params: { id: TEST_USER.id },
        status: 500,
      });

      const deleteBtn = screen.getByRole('button', {
        name: 'button.delete',
      });
      await userEvent.click(deleteBtn);

      await waitFor(() =>
        expect(screen.getByText(new RegExp('error', 'i'))).toBeInTheDocument(),
      );
      await waitFor(() => expect(mockSignOut).not.toHaveBeenCalled());
    });
  });
});
