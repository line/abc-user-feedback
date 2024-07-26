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
  SMTP_HOST: Joi.string().when('SMTP_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SMTP_PORT: Joi.number().when('SMTP_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SMTP_USERNAME: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  SMTP_SENDER: Joi.string().when('SMTP_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SMTP_BASE_URL: Joi.string().when('SMTP_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const smtpConfig = registerAs('smtp', () => ({
  use: process.env.SMTP_USE === 'true',
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '25'),
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  sender: process.env.SMTP_SENDER,
  baseUrl: process.env.SMTP_BASE_URL,
}));
