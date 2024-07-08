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

import { useUserStore } from '../user.model';
import type { User } from '../user.type';
import UserBox from './user-box.ui';

import { render, screen, waitFor } from '@/test-utils';

describe('UserBox', () => {
  test('no logged in user', () => {
    useUserStore.setState({ user: null });
    render(<UserBox />);
  });
  test('logged in user', async () => {
    const user: User = {
      department: null,
      email: faker.internet.email(),
      id: faker.number.int(),
      name: faker.string.sample(),
      signUpMethod: 'EMAIL',
      type: 'GENERAL',
    };
    useUserStore.setState({ user: user });
    render(<UserBox />);
    const userBox = screen.getByText(user.email);

    expect(userBox).toBeInTheDocument();

    await waitFor(async () => {
      await userEvent.click(userBox);
    });
    expect(screen.getByText('header.profile')).toBeInTheDocument();
    expect(screen.getByText('header.sign-out')).toBeInTheDocument();
  });
  test('snapshot', () => {
    const user: User = {
      department: null,
      email: 'test@test.com',
      id: faker.number.int(),
      name: faker.string.sample(),
      signUpMethod: 'EMAIL',
      type: 'GENERAL',
    };
    useUserStore.setState({ user: user });
    const { container } = render(<UserBox />);
    expect(container).toMatchSnapshot();
  });
  test('snapshot when open', async () => {
    const user: User = {
      department: null,
      email: 'test@test.com',
      id: faker.number.int(),
      name: faker.string.sample(),
      signUpMethod: 'EMAIL',
      type: 'GENERAL',
    };
    useUserStore.setState({ user: user });
    const { container } = render(<UserBox />);
    const userBox = screen.getByText(user.email);
    await waitFor(async () => {
      await userEvent.click(userBox);
    });
    expect(container).toMatchSnapshot();
  });
});
