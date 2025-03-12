#!/usr/bin/env node
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
import { execSync } from 'child_process';
import * as fs from 'fs';
import os from 'os';
import * as path from 'path';
import { Command } from 'commander';
import { load } from 'js-toml';

const program = new Command();

program.description(
  'ABC User Feedback CLI that helps to run web frontend and server easily.',
);

function getArchitectureType() {
  const arch = os.arch();

  switch (arch) {
    case 'arm':
    case 'arm64':
      return 'arm';
    case 'ia32':
    case 'x32':
    case 'x64':
      return 'amd';
    default:
      return 'arm';
  }
}

program
  .command('init')
  .description(
    'Start the appropriate Docker Compose file based on architecture to setup the ABC User Feedback infrastructure.',
  )
  .action(() => {
    const architecture = getArchitectureType();
    console.log(`Your system architecture is detected as: ${architecture}`);

    const composeFile =
      architecture === 'amd' ?
        'docker-compose.infra-amd64.yml'
      : 'docker-compose.infra-arm64.yml';

    const composeFilePath = path.join(__dirname + '/../', composeFile);
    console.log(
      `Terminates existing Docker Compose with auf-cli project name...`,
    );
    execSync(`docker compose -p auf-cli down`);

    console.log(`Running Docker Compose with ${composeFilePath.toString()}...`);
    execSync(
      `docker compose -p auf-cli -f ${composeFilePath.toString()} up  -d`,
      {
        stdio: 'inherit',
      },
    );

    const sourceConfigPath = path.join(__dirname + '/../config.toml');
    const destinationConfigPath = path.join(process.cwd(), 'config.toml');
    fs.copyFileSync(sourceConfigPath, destinationConfigPath);
    console.log(
      'config.toml has been created. Please fill in the required environment variables.',
    );
  });

program
  .command('start')
  .description(
    'Pull ABC User Feedback Docker image and run container with environment variables',
  )
  .action(() => {
    if (fs.existsSync(path.join(process.cwd(), 'config.toml')) === false) {
      console.error(
        'config.toml file is missing. Please run "npx auf-cli init" first.',
      );
      return;
    }

    const destinationConfigPath = path.join(process.cwd(), 'config.toml');

    const templatePath = path.join(
      __dirname + '/../docker-compose.template.yml',
    );

    interface TomlConfig {
      web: Record<string, string>;
      api: Record<string, string>;
    }

    const tomlContent = fs.readFileSync(destinationConfigPath, 'utf-8');
    const tomlConfig = load(tomlContent) as TomlConfig;

    const webEnvVars = [
      'NEXT_PUBLIC_API_BASE_URL',
      'NEXT_PUBLIC_MAX_DAYS',
      'SESSION_PASSWORD',
    ];

    const apiEnvVars = [
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

    const missingWebEnvVars = webEnvVars.filter(
      (varName) => !tomlConfig.web[varName],
    );
    const missingApiEnvVars = apiEnvVars.filter(
      (varName) => !tomlConfig.api[varName],
    );

    if (missingWebEnvVars.length > 0) {
      console.error(
        `Missing required environment variables for web service: ${missingWebEnvVars.join(', ')}`,
      );
      process.exit(1);
    }

    if (missingApiEnvVars.length > 0) {
      console.error(
        `Missing required environment variables for api service: ${missingApiEnvVars.join(', ')}`,
      );
      process.exit(1);
    }

    let dockerComposeTemplate = fs.readFileSync(templatePath, 'utf-8');

    webEnvVars.forEach((varName) => {
      const regex = new RegExp(`\\$\\{${varName}\\}`, 'g');
      dockerComposeTemplate = dockerComposeTemplate.replace(
        regex,
        tomlConfig.web[varName],
      );
    });
    apiEnvVars.forEach((varName) => {
      const regex = new RegExp(`\\$\\{${varName}\\}`, 'g');
      dockerComposeTemplate = dockerComposeTemplate.replace(
        regex,
        tomlConfig.api[varName],
      );
    });

    const dockerComposePath = path.resolve(
      process.cwd(),
      'docker-compose.generated.yml',
    );
    fs.writeFileSync(dockerComposePath, dockerComposeTemplate);

    console.log('docker-compose.generated.yml has been created');

    const apiDockerImage = 'line/abc-user-feedback-api';
    const webDockerImage = 'line/abc-user-feedback-web';

    console.log(`Pulling Docker image ${apiDockerImage}, ${webDockerImage}...`);
    execSync(`docker pull ${apiDockerImage}`);
    execSync(`docker pull ${webDockerImage}`);

    const dockerComposeCommand = `docker compose -p auf-cli -f ${dockerComposePath} up -d`;
    console.log(`Running Docker Compose with command: ${dockerComposeCommand}`);
    execSync(dockerComposeCommand);

    console.log(
      '\x1b[32m',
      '\nStarted ABC User Feedback services.\n',
      '\x1b[0m',
    );
    const serviceInfos = {
      'API URL': 'http://localhost:4000',
      'WEB URL': 'http://localhost:3000',
      'DB URL': 'http://localhost:13306',
      'OPENSEARCH URL': 'http://localhost:9200',
      'OPENSEARCH ADMIN URL': 'http://localhost:5601',
      JWT_SECRET: tomlConfig.api.JWT_SECRET,
    };

    for (const [key, value] of Object.entries(serviceInfos)) {
      console.log(`${key.padStart(20)}: ${value}`);
    }
  });

program
  .command('stop')
  .description('Stop the running Docker containers for app and web services')
  .action(() => {
    const dockerComposeCommand = `docker compose -p auf-cli down`;
    console.log(
      `Stopping Docker Compose with command: ${dockerComposeCommand}`,
    );
    execSync(dockerComposeCommand);
  });

program
  .command('clean')
  .description('Delete existing mounted docker volumes')
  .action(() => {
    console.log('Deletes existing mounted docker volumes...');
    execSync(`rm -rf ${path.join(__dirname, '../volumes')}`);
  });

program.parse(process.argv);
