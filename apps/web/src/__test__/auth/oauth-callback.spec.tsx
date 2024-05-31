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

import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';

import * as signInWithOAuth from '@/features/auth/sign-in-with-oauth';

import { Path } from '@/constants/path';
import OAuthCallbackPage from '@/pages/auth/oauth-callback';
import { render, screen, waitFor } from '@/utils/test-utils';

jest.mock('@/features/auth/sign-in-with-oauth');

describe('OAuthCallback Page', () => {
  test('status loading', () => {
    jest.spyOn(signInWithOAuth, 'useOAuthCallback').mockReturnValue({
      status: 'loading',
    });
    render(<OAuthCallbackPage />);
    expect(screen.queryByText('Loading...')).toBeInTheDocument();
  });
  test('status error', async () => {
    jest.spyOn(signInWithOAuth, 'useOAuthCallback').mockReturnValue({
      status: 'error',
    });
    render(<OAuthCallbackPage />);

    expect(screen.queryByText('Error!!!')).toBeInTheDocument();

    await waitFor(async () => {
      await userEvent.click(screen.getByRole('button'));
    });
    expect(mockRouter).toMatchObject({ pathname: Path.SIGN_IN });
  });
});
