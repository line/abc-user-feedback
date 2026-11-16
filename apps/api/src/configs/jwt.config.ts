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

// Values published in compose files, the CLI template and the docs. A token
// signed with any of them could be forged by anyone.
export const KNOWN_DEFAULT_JWT_SECRETS = [
  'jwtsecretjwtsecretjwtsecret',
  'jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret',
  'changeme',
  'changemechangemechangeme',
];

export const jwtConfigSchema = Joi.object({
  JWT_SECRET: Joi.string()
    .required()
    .invalid(...KNOWN_DEFAULT_JWT_SECRETS)
    .messages({
      'any.invalid':
        'JWT_SECRET is a publicly known default. Set it to a random value, e.g. `openssl rand -hex 32`.',
    }),
  ACCESS_TOKEN_EXPIRED_TIME: Joi.string().default('10m'),
  REFRESH_TOKEN_EXPIRED_TIME: Joi.string().default('1h'),
});

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenExpiredTime: process.env.ACCESS_TOKEN_EXPIRED_TIME,
  refreshTokenExpiredTime: process.env.REFRESH_TOKEN_EXPIRED_TIME,
}));
