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
import * as path from 'path';
import { Command } from 'commander';
import { load } from 'js-toml';
import type { Answers } from 'prompts';
import prompts from 'prompts';

const program = new Command();

program.description(
  'UserFeedback CLI that helps to run web frontend and server easily.',
);

program
  .command('init')
  .description(
    'Start the appropriate Docker Compose file based on architecture to setup the UserFeedback infrastructure.',
  )
  .action(async () => {
    const architecture: Answers<string> = await prompts({
      type: 'select',
      name: 'value',
      message: 'Select your architecture:',
      choices: [
        { title: 'arm', value: 'arm' },
        { title: 'amd', value: 'amd' },
      ],
      initial: 0,
    });

    const composeFile =
      architecture.value === 'amd' ?
        'docker-compose.infra-amd64.yml'
      : 'docker-compose.infra-arm64.yml';

    const composeFilePath = path.join(__dirname + '/../', composeFile);

    const dockerComposeCommand = `docker-compose -f ${composeFilePath.toString()} down`;
    execSync(dockerComposeCommand);

    console.log('Prune Docker containers before running Docker Compose...');
    execSync('docker container prune -f', { stdio: 'inherit' });

    console.log(`Running Docker Compose with ${composeFilePath.toString()}...`);
    execSync(`docker-compose -f ${composeFilePath.toString()} up  -d`, {
      stdio: 'inherit',
    });
  });

program
  .command('start')
  .description(
    'Pull UserFeedback Docker image and run container with environment variables',
  )
  .action(() => {
    const sourceConfigPath = path.join(__dirname + '/../config.toml');
    const destinationConfigPath = path.join(process.cwd(), 'config.toml');
    fs.copyFileSync(sourceConfigPath, destinationConfigPath);
    console.log(
      'config.toml has been created. Please fill in the required environment variables.',
    );

    const sourceTemplatePath = path.join(
      __dirname + '/../docker-compose.template.yml',
    );
    const destinationTemplatePath = path.join(
      process.cwd(),
      'docker-compose.template.yml',
    );
    fs.copyFileSync(sourceTemplatePath, destinationTemplatePath);

    interface TomlConfig {
      web: Record<string, string>;
      api: Record<string, string>;
    }

    const tomlContent = fs.readFileSync(destinationConfigPath, 'utf-8');
    const tomlConfig = load(tomlContent) as TomlConfig;

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

    let dockerComposeTemplate = fs.readFileSync(
      destinationTemplatePath,
      'utf-8',
    );

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
