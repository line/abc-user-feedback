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
import { execSync } from 'child_process';

import logger from '../utils/logger';

export default () => {
  logger.info('Stopping All containers...');
  execSync('docker compose -p abc-user-feedback down', { stdio: 'inherit' });

  logger.info('Local data are backed up to docker volumne.');
  logger.info("For cleaning up, use 'npx auf-cli clean' command.");
};
