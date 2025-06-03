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

import * as fs from 'fs';

import getDestinationPath from '../utils/get-destination-path';
import getSourcePath from '../utils/get-source-path';
import logger from '../utils/logger';

export default () => {
  const sourceConfigPath = getSourcePath('config.toml');
  const destinationConfigPath = getDestinationPath('config.toml');

  if(fs.existsSync(destinationConfigPath)) {
    logger.info('config.toml already exists. Skipping copy.');
    return;
  }
  fs.copyFileSync(sourceConfigPath, destinationConfigPath);
  logger.info(
    'config.toml has been created. Please fill in the required environment variables.',
  );
  logger.info('Checkout API and Web Configuration for more details.');
  logger.info(
    '[API] https://github.com/line/abc-user-feedback/blob/main/apps/api/README.md#environment-variables ',
  );
  logger.info(
    '[Web] https://github.com/line/abc-user-feedback/blob/main/apps/web/README.md#environment-variables ',
  );
};
