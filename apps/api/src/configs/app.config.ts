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
import { v4 as uuidv4 } from 'uuid';

export const appConfigSchema = Joi.object({
  APP_PORT: Joi.number().default(4000),
  APP_ADDRESS: Joi.string().default('0.0.0.0'),
  BASE_URL: Joi.string().required(),
  ENABLE_AUTO_FEEDBACK_DELETION: Joi.boolean().default(false),
  AUTO_FEEDBACK_DELETION_PERIOD_DAYS: Joi.number().when(
    'ENABLE_AUTO_FEEDBACK_DELETION',
    {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    },
  ),
});

export const appConfig = registerAs('app', () => ({
  port: process.env.APP_PORT,
  address: process.env.APP_ADDRESS,
  baseUrl: process.env.APP_BASE_URL,
  enableAutoFeedbackDeletion:
    process.env.ENABLE_AUTO_FEEDBACK_DELETION === 'true',
  autoFeedbackDeletionPeriodDays:
    process.env.AUTO_FEEDBACK_DELETION_PERIOD_DAYS,
  serverId: uuidv4(),
}));
