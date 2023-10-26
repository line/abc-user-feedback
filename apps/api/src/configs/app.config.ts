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

import { registerAs } from '@nestjs/config';
import * as yup from 'yup';

export const appConfigSchema = yup.object({
  APP_PORT: yup.number().default(4000),
  APP_ADDRESS: yup.string().default('0.0.0.0'),
});

export const appConfig = registerAs('app', () => ({
  port: process.env.APP_PORT,
  address: process.env.APP_ADDRESS,
}));
