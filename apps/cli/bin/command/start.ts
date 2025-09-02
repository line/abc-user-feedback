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
import * as fs from 'fs';
import os from 'os';
import { load } from 'js-toml';

import getDestinationPath from '../utils/get-destination-path';
import getSourcePath from '../utils/get-source-path';
import logger from '../utils/logger';

const WEB_ENV_VARS = ['NEXT_PUBLIC_API_BASE_URL'];
const API_ENV_VARS = [
  'JWT_SECRET',
  'MYSQL_PRIMARY_URL',
  'BASE_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SENDER',
  'SMTP_BASE_URL',
  'AUTO_MIGRATION',
  'MASTER_API_KEY',
  'NODE_OPTIONS',
];

interface TomlConfig {
  web: Record<string, string>;
  api: Record<string, string>;
}

const startDockerComposeInfra = () => {
  const composeFile = 'docker-compose.infra.yml';

  const composeFilePath = getSourcePath(composeFile);

  execSync(
    `docker compose -p abc-user-feedback -f ${composeFilePath.toString()} up  -d`,
    { stdio: 'inherit' },
  );
};

function startDockerCompose() {
  const tomlConfig = getConfig();
  const templatePath = getSourcePath('docker-compose.template.yml');

  let dockerComposeTemplate = fs.readFileSync(templatePath, 'utf-8');

  WEB_ENV_VARS.forEach((varName) => {
    const regex = new RegExp(`\\$\\{${varName}\\}`, 'g');
    dockerComposeTemplate = dockerComposeTemplate.replace(
      regex,
      tomlConfig.web[varName],
    );
  });
  API_ENV_VARS.forEach((varName) => {
    const regex = new RegExp(`\\$\\{${varName}\\}`, 'g');
    dockerComposeTemplate = dockerComposeTemplate.replace(
      regex,
      tomlConfig.api[varName],
    );
  });

  const dockerComposePath = getDestinationPath('docker-compose.generated.yml');

  fs.writeFileSync(dockerComposePath, dockerComposeTemplate);
  execSync(
    `docker compose -p abc-user-feedback -f ${dockerComposePath} up -d`,
    { stdio: 'inherit' },
  );
}

const validateEnvironmentVars = (
  missingVars: string[],
  serviceName: string,
) => {
  if (missingVars.length > 0) {
    logger.error(
      `Missing required environment variables for ${serviceName} service: ${missingVars.join(', ')}`,
    );
    process.exit(1);
  }
};

// 서비스가 정상적으로 시작되었는지 확인하는 함수
function checkServicesStatus() {
  logger.info('Checking services status...');

  const servicesStatus = execSync(
    'docker compose -p abc-user-feedback ps --format json',
    { encoding: 'utf-8' },
  );
  return servicesStatus.length > 0;
}

function getConfig() {
  const tomiConfigPath = getDestinationPath('config.toml');
  const tomlContent = fs.readFileSync(tomiConfigPath, 'utf-8');
  const tomlConfig = load(tomlContent) as TomlConfig;
  return tomlConfig;
}

function validateConfig() {
  const tomlConfig = getConfig();
  const missingWebEnvVars = WEB_ENV_VARS.filter(
    (varName) => !tomlConfig.web[varName],
  );
  const missingApiEnvVars = API_ENV_VARS.filter(
    (varName) => !tomlConfig.api[varName],
  );

  validateEnvironmentVars(missingWebEnvVars, 'web');
  validateEnvironmentVars(missingApiEnvVars, 'api');
}

export default () => {
  const isRunning = checkServicesStatus();
  if (isRunning) {
    logger.info('Docker Compose is already running.');
    return;
  }

  if (fs.existsSync(getDestinationPath('config.toml')) === false) {
    logger.error(
      'config.toml file is missing. Please run "npx auf-cli init" first.',
    );
    return;
  }

  logger.info('Validating config.toml file');

  validateConfig();
  logger.info('Config file is valid.');

  logger.info('Starting Docker Compose Infrastructure');
  startDockerComposeInfra();

  logger.info('Starting Docker Compose');
  startDockerCompose();

  logger.info(`Running Docker Compose with command`);
  logger.info('\x1b[32m', '\nStarted ABC User Feedback services.\n', '\x1b[0m');

  const serviceInfos = {
    'API URL': 'http://localhost:4000',
    'WEB URL': 'http://localhost:3000',
    'DB URL': 'http://localhost:13306',
    'OPENSEARCH URL': 'http://localhost:9200',
    'OPENSEARCH ADMIN URL': 'http://localhost:5601',
    'SMTP4DEV Web URL': 'http://localhost:5080',
  };

  for (const [key, value] of Object.entries(serviceInfos)) {
    logger.info(`${key.padStart(20)}: ${value}`);
  }

  logger.info(
    '\n\nNOTE: You can check out email in smtp4dev: ' +
      serviceInfos['SMTP4DEV Web URL'],
  );
};
