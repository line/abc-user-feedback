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
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

export const mysqlConfigSchema = Joi.object({
  MYSQL_PRIMARY_URL: Joi.string().required(),
  MYSQL_SECONDARY_URLS: Joi.string().custom((value, helpers) => {
    const urls = JSON.parse(value);
    for (const url of urls) {
      if (!url.startsWith('mysql://')) {
        return helpers.error('any.invalid');
      }
    }
    return value;
  }, 'custom validation'),
  AUTO_MIGRATION: Joi.boolean().default(true),
});

export const mysqlConfig = registerAs('mysql', () => ({
  main_url: process.env.MYSQL_PRIMARY_URL,
  sub_urls:
    process.env.MYSQL_SECONDARY_URLS ?
      JSON.parse(process.env.MYSQL_SECONDARY_URLS)
    : [],
  auto_migration: process.env.AUTO_MIGRATION === 'true',
}));
