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

import { z } from 'zod';

export const changePasswordFormSchema = z
  .object({
    password: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine(({ password, newPassword }) => password !== newPassword, {
    message: 'must not equal Password',
    path: ['newPassword'],
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: 'must equal New Password',
      path: ['confirmNewPassword'],
    },
  );
