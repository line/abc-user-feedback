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
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { load } from 'js-toml';

const program = new Command();

program.description(
  'UserFeedback CLI that helps to run web frontend and server easily.',
);

program
  .command('init')
  .description(
    'Start the appropriate Docker Compose file based on architecture to setup the UserFeedback infrastructure.',
  )
  .action(() => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'architecture',
          message: 'Select your architecture:',
          choices: ['arm', 'amd'],
        },
      ])
      .then((answers) => {
        const architecture = answers.architecture;
        const composeFile =
          architecture === 'amd' ?
            'docker-compose.infra-amd64.yml'
          : 'docker-compose.infra-arm64.yml';

        console.log(`Running Docker Compose with ${composeFile}...`);

        execSync(`docker-compose -f ../../docker/${composeFile} up -d`);
      });
  });

program
  .command('start')
  .description(
    'Pull UserFeedback Docker image and run container with environment variables',
  )
  .action(() => {
    const configPath = path.resolve(process.cwd(), 'config.toml');

    const templatePath = path.resolve(
      process.cwd(),
      'docker-compose.template.yml',
    );

    if (!fs.existsSync(configPath)) {
      console.error('api.config.toml file not found');
      process.exit(1);
    }

    if (!fs.existsSync(templatePath)) {
      console.error('docker-compose.template.yml file not found');
      process.exit(1);
    }

    const tomlContent = fs.readFileSync(configPath, 'utf-8');
    const tomlConfig = load(tomlContent);

    const webEnvVars = [
      'NEXT_PUBLIC_API_BASE_URL',
      'NEXT_PUBLIC_MAX_DAYS',
      'API_BASE_URL',
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

    const dockerComposeCommand = `docker-compose -f ${dockerComposePath} up -d`;
    console.log(`Running Docker Compose with command: ${dockerComposeCommand}`);
    execSync(dockerComposeCommand);
  });

program
  .command('stop')
  .description('Stop the running Docker containers for app and web services')
  .action(() => {
    const dockerComposePath = path.resolve(
      process.cwd(),
      'docker-compose.generated.yml',
    );

    if (!fs.existsSync(dockerComposePath)) {
      console.error(
        'docker-compose.generated.yml file not found. Please run "ufb-cli start" first.',
      );
      process.exit(1);
    }

    const dockerComposeCommand = `docker-compose -f ${dockerComposePath} down`;
    console.log(
      `Stopping Docker Compose with command: ${dockerComposeCommand}`,
    );
    execSync(dockerComposeCommand);
  });

program.parse(process.argv);
