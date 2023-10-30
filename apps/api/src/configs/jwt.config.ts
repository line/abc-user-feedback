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

export const jwtConfigSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRED_TIME: Joi.string().default('10m'),
  REFESH_TOKEN_EXPIRED_TIME: Joi.string().default('1h'),
});

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenExpiredTime: process.env.ACCESS_TOKEN_EXPIRED_TIME,
  refreshTokenExpiredTime: process.env.REFESH_TOKEN_EXPIRED_TIME,
}));
