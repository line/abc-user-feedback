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

import type { User } from '@/entities/user';

import { simpleMockHttp } from '@/msw';
import { render, screen, waitFor } from '@/test-utils';
import UserProfileForm from './user-profile-form.ui';

const TEST_USER: User = {
  id: faker.number.int(),
  email: faker.internet.email(),
  name: faker.string.alphanumeric(8),
  type: faker.helpers.arrayElement(['GENERAL', 'SUPER']),
  department: faker.helpers.arrayElement([null, faker.string.alphanumeric(8)]),
  signUpMethod: 'EMAIL',
};

describe('ResetPasswordWithEmailForm', () => {
  test('validation', async () => {
    render(<UserProfileForm user={TEST_USER} />);

    const saveBtn = screen.getByRole('button', {
      name: 'button.save',
    });

    expect(saveBtn).toBeDisabled();

    const nameInput = screen.getByPlaceholderText(
      'main.profile.placeholder.name',
    );
    const departmentInput = screen.getByPlaceholderText(
      'main.profile.placeholder.department',
    );

    expect(nameInput).toHaveValue(TEST_USER.name);
    if (TEST_USER.name) {
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, TEST_USER.name);
    }
    if (TEST_USER.department) {
      await userEvent.clear(departmentInput);
      await userEvent.type(departmentInput, TEST_USER.department);
    }
    expect(nameInput).toHaveValue(TEST_USER.name);

    expect(saveBtn).toBeDisabled();

    await userEvent.clear(nameInput);
    await userEvent.clear(departmentInput);

    await userEvent.type(nameInput, faker.string.alphanumeric(8));
    await userEvent.type(departmentInput, faker.string.alphanumeric(8));

    await waitFor(() => expect(saveBtn).not.toBeDisabled());
  });
  describe('Submittion', () => {
    beforeEach(async () => {
      render(<UserProfileForm user={TEST_USER} />);

      const nameInput = screen.getByPlaceholderText(
        'main.profile.placeholder.name',
      );
      const departmentInput = screen.getByPlaceholderText(
        'main.profile.placeholder.department',
      );
      await userEvent.type(nameInput, faker.string.alphanumeric(8));
      await userEvent.type(departmentInput, faker.string.alphanumeric(8));
    });
    test('on Success', async () => {
      simpleMockHttp({
        method: 'put',
        path: `/api/admin/users/{id}`,
        status: 200,
        params: { id: TEST_USER.id },
        data: TEST_USER,
      });

      const saveBtn = screen.getByRole('button', {
        name: 'button.save',
      });
      await userEvent.click(saveBtn);

      await waitFor(() =>
        expect(
          screen.getByText(new RegExp('v2.toast.success', 'i')),
        ).toBeInTheDocument(),
      );
      await waitFor(() => expect(saveBtn).toBeDisabled());
    });
    test('on Error', async () => {
      simpleMockHttp({
        method: 'put',
        path: `/api/admin/users/{id}`,
        status: 500,
        params: { id: TEST_USER.id },
      });

      const saveBtn = screen.getByRole('button', {
        name: 'button.save',
      });
      await userEvent.click(saveBtn);

      await waitFor(() =>
        expect(screen.getByText(new RegExp('error', 'i'))).toBeInTheDocument(),
      );
    });
  });
});
