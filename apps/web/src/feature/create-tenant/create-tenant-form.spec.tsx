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
import toast from 'react-hot-toast';

import { act, render, screen, waitFor } from '@/utils/test-utils';

const TestComponent = () => {
  const onClick = () => {
    toast.success('Success');
  };
  return <button onClick={onClick}>test</button>;
};
describe('CreateTenantForm', () => {
  test('test ', async () => {
    render(<TestComponent />);
    const btn = screen.getByRole('button');
    await act(async () => {
      await userEvent.click(btn);
    });

    await waitFor(() => screen.getByText('Success'));
    expect(screen.queryByText('Success')).toBeInTheDocument();
  });
});
