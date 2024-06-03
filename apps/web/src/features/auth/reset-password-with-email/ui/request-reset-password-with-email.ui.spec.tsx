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

import RequestResetPasswordWithEmail from './request-reset-password-with-email.ui';

import { simpleMockHttp } from '@/msw';
import { act, render, screen, waitFor } from '@/utils/test-utils';

describe('RequestResetPasswordWithEmail', () => {
  test('match snapshot', () => {
    const component = render(<RequestResetPasswordWithEmail />);
    expect(component.container).toMatchSnapshot();
  });

  test('back button', async () => {
    render(<RequestResetPasswordWithEmail />);
    const backBtn = screen.getByRole('button', { name: 'button.back' });

    await act(() => userEvent.click(backBtn));
    // next-router-mock is not supported to back yet
    // await waitFor(() => expect(mockRouter).toMatchObject({ pathname: '/' }));
  });

  test('validation', async () => {
    render(<RequestResetPasswordWithEmail />);
    const emailInput = screen.getByPlaceholderText('input.placeholder.email');

    const submitBtn = screen.getByRole('button', {
      name: 'auth.reset-password.button.send-email',
    });

    expect(submitBtn).toBeDisabled();

    await act(() => userEvent.type(emailInput, faker.string.sample()));

    expect(submitBtn).toBeDisabled();

    await act(async () => {
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, faker.internet.email());
    });

    expect(submitBtn).not.toBeDisabled();
  });

  describe('Submittion', () => {
    beforeEach(async () => {
      render(<RequestResetPasswordWithEmail />);
      const emailInput = screen.getByPlaceholderText('input.placeholder.email');
      await act(() => userEvent.type(emailInput, faker.internet.email()));
    });

    test('on Success', async () => {
      simpleMockHttp('post', '/api/admin/users/password/reset/code');

      const submitBtn = screen.getByRole('button', {
        name: 'auth.reset-password.button.send-email',
      });
      await act(() => userEvent.click(submitBtn));
      await waitFor(() =>
        expect(
          screen.getByText(new RegExp('success', 'i')),
        ).toBeInTheDocument(),
      );
    });
    test('on Error', async () => {
      simpleMockHttp('post', '/api/admin/users/password/reset/code', 500);

      const submitBtn = screen.getByRole('button', {
        name: 'auth.reset-password.button.send-email',
      });
      await act(() => userEvent.click(submitBtn));
      await waitFor(() =>
        expect(screen.getByText(new RegExp('error', 'i'))).toBeInTheDocument(),
      );
    });
  });
});
