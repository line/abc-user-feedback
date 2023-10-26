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
import Joi from 'joi';

export const smtpConfigSchema = Joi.object({
  SMTP_USE: Joi.boolean().default(false),
  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(25),
  SMTP_USERNAME: Joi.string().default(''),
  SMTP_PASSWORD: Joi.string().default(''),
  SMTP_SENDER: Joi.string().default('noreplay@linecorp.com'),
  SMTP_BASE_URL: Joi.string().default('http://localhost:3000'),
});

export const smtpConfig = registerAs('smtp', () => ({
  use: process.env.SMTP_USE === 'true',
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  password: process.env.SMTP_USERNAME,
  username: process.env.SMTP_PASSWORD,
  sender: process.env.SMTP_SENDER,
  baseUrl: process.env.SMTP_BASE_URL,
}));
