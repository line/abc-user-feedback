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

export const opensearchConfigSchema = Joi.object({
  OS_USE: Joi.boolean().default(false),
  OS_NODE: Joi.string().when('OS_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  OS_USERNAME: Joi.string().allow('').when('OS_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  OS_PASSWORD: Joi.string().allow('').when('OS_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const opensearchConfig = registerAs('opensearch', () => ({
  use: process.env.OS_USE === 'true',
  node: process.env.OS_NODE,
  username: process.env.OS_USERNAME,
  password: process.env.OS_PASSWORD,
}));
