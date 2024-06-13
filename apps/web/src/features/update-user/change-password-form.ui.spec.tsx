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

import ChangePasswordForm from './change-password-form.ui';

import { simpleMockHttp } from '@/msw';
import { act, render, screen, waitFor } from '@/utils/test-utils';

describe('ResetPasswordWithEmailForm', () => {
  test('match snapshot', () => {
    const component = render(<ChangePasswordForm />);
    expect(component.container).toMatchSnapshot();
  });

  test('validation', async () => {
    render(<ChangePasswordForm />);

    const saveBtn = screen.getByRole('button', {
      name: 'button.save',
    });
    const passwordInput = screen.getByPlaceholderText(
      'input.placeholder.password',
    );
    const newPasswordInput = screen.getByPlaceholderText(
      'main.profile.placeholder.new-password',
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      'main.profile.placeholder.confirm-new-password',
    );

    await act(async () => {
      await userEvent.type(passwordInput, faker.string.alphanumeric(8));
      await userEvent.type(newPasswordInput, faker.string.alphanumeric(9));
      await userEvent.type(confirmPasswordInput, faker.string.alphanumeric(9));
    });

    expect(saveBtn).toBeDisabled();

    await act(async () => {
      await userEvent.clear(newPasswordInput);
      await userEvent.clear(confirmPasswordInput);

      const password = faker.string.alphanumeric(8);
      await userEvent.type(newPasswordInput, password);
      await userEvent.type(confirmPasswordInput, password);
    });

    await waitFor(() => expect(saveBtn).not.toBeDisabled());
  });
  describe('Submittion', () => {
    beforeEach(async () => {
      render(<ChangePasswordForm />);

      const passwordInput = screen.getByPlaceholderText(
        'input.placeholder.password',
      );
      const newPasswordInput = screen.getByPlaceholderText(
        'main.profile.placeholder.new-password',
      );
      const confirmPasswordInput = screen.getByPlaceholderText(
        'main.profile.placeholder.confirm-new-password',
      );
      await act(async () => {
        await userEvent.type(passwordInput, faker.string.alphanumeric(8));

        const password = faker.string.alphanumeric(8);
        await userEvent.type(newPasswordInput, password);
        await userEvent.type(confirmPasswordInput, password);
      });
    });
    test('on Success', async () => {
      simpleMockHttp({
        method: 'post',
        path: '/api/admin/users/password/change',
      });

      const submitBtn = screen.getByRole('button', {
        name: 'button.save',
      });
      await act(() => userEvent.click(submitBtn));

      await waitFor(() =>
        expect(
          screen.getByText(new RegExp('toast.save', 'i')),
        ).toBeInTheDocument(),
      );
    });
    test('on Error', async () => {
      simpleMockHttp({
        method: 'post',
        path: '/api/admin/users/password/change',
        status: 500,
      });

      const submitBtn = screen.getByRole('button', {
        name: 'button.save',
      });
      await act(() => userEvent.click(submitBtn));

      await waitFor(() =>
        expect(screen.getByText(new RegExp('error', 'i'))).toBeInTheDocument(),
      );
    });
  });
});
