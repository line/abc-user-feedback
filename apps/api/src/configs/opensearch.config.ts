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

export const opensearchConfigSchema = Joi.object({
  OPENSEARCH_USE: Joi.boolean().default(false),
  OPENSEARCH_NODE: Joi.string().when('OPENSEARCH_USE', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  OPENSEARCH_USERNAME: Joi.string().optional().default(''),
  OPENSEARCH_PASSWORD: Joi.string().optional().default(''),
});

export const opensearchConfig = registerAs('opensearch', () => ({
  use: process.env.OPENSEARCH_USE === 'true',
  node: process.env.OPENSEARCH_NODE,
  username: process.env.OPENSEARCH_USERNAME,
  password: process.env.OPENSEARCH_PASSWORD,
}));
