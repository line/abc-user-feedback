/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USERNAME: Joi.string().optional().allow(''),
  SMTP_PASSWORD: Joi.string().optional().allow(''),
  SMTP_SENDER: Joi.string().required(),
  SMTP_TLS: Joi.boolean().optional().default(false),
  SMTP_CIPHER_SPEC: Joi.string().when('SMTP_TLS', {
    is: true,
    then: Joi.optional().default('TLSv1.2'),
    otherwise: Joi.optional(),
  }),
  SMTP_OPPORTUNISTIC_TLS: Joi.boolean().when('SMTP_TLS', {
    is: true,
    then: Joi.optional().default(true),
    otherwise: Joi.optional(),
  }),
});

export const smtpConfig = registerAs('smtp', () => ({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '25'),
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  sender: process.env.SMTP_SENDER,
  tls: process.env.SMTP_TLS === 'true',
  cipherSpec: process.env.SMTP_CIPHER_SPEC,
  opportunisticTLS: process.env.SMTP_OPPORTUNISTIC_TLS === 'true',
}));
