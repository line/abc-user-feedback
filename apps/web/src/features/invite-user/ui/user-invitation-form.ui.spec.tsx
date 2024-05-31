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

import UserInvitationForm from './user-invitation-form.ui';

import { simpleMockHttp } from '@/msw';
import { act, render, screen, waitFor } from '@/utils/test-utils';

describe('ResetPasswordWithEmailForm', () => {
  test('match snapshot', () => {
    const component = render(<UserInvitationForm code="code" email="email" />);
    expect(component.container).toMatchSnapshot();
  });

  test('validation', async () => {
    render(<UserInvitationForm code="code" email={faker.internet.email()} />);

    const sendEmailBtn = screen.getByRole('button', {
      name: 'button.setting',
    });
    const passwordInput = screen.getByPlaceholderText(
      'input.placeholder.password',
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      'input.placeholder.confirm-password',
    );

    await act(async () => {
      await userEvent.type(passwordInput, faker.string.alphanumeric(8));
      await userEvent.type(confirmPasswordInput, faker.string.alphanumeric(9));
    });

    expect(sendEmailBtn).toBeDisabled();

    await act(async () => {
      await userEvent.clear(passwordInput);
      await userEvent.clear(confirmPasswordInput);

      const password = faker.string.alphanumeric(8);
      await userEvent.type(passwordInput, password);
      await userEvent.type(confirmPasswordInput, password);
    });

    await waitFor(() => expect(sendEmailBtn).not.toBeDisabled());
  });
  describe('Submittion', () => {
    beforeEach(async () => {
      render(<UserInvitationForm code="code" email={faker.internet.email()} />);

      const passwordInput = screen.getByPlaceholderText(
        'input.placeholder.password',
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        'input.placeholder.confirm-password',
      );
      await act(async () => {
        const password = faker.string.alphanumeric(8);
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPasswordInput, password);
      });
    });
    test('on Success', async () => {
      simpleMockHttp('post', '/api/admin/auth/signUp/invitation', 'success');

      const submitBtn = screen.getByRole('button', {
        name: 'button.setting',
      });
      await act(() => userEvent.click(submitBtn));

      await waitFor(() =>
        expect(
          screen.getByText(new RegExp('success', 'i')),
        ).toBeInTheDocument(),
      );
    });
    test('on Error', async () => {
      simpleMockHttp('post', '/api/admin/auth/signUp/invitation', 'error');

      const submitBtn = screen.getByRole('button', {
        name: 'button.setting',
      });
      await act(() => userEvent.click(submitBtn));

      await waitFor(() =>
        expect(screen.getByText(new RegExp('error', 'i'))).toBeInTheDocument(),
      );
    });
  });
});
