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
import type { ConfigType } from '@nestjs/config';

import type { appConfig } from '@/configs/app.config';
import type { jwtConfig } from '@/configs/jwt.config';
import type { mysqlConfig } from '@/configs/mysql.config';
import type { opensearchConfig } from '@/configs/opensearch.config';
import type { smtpConfig } from '@/configs/smtp.config';

export interface ConfigServiceType {
  app: ConfigType<typeof appConfig>;
  opensearch: ConfigType<typeof opensearchConfig>;
  smtp: ConfigType<typeof smtpConfig>;
  jwt: ConfigType<typeof jwtConfig>;
  mysql: ConfigType<typeof mysqlConfig>;
}
