#!/usr/bin/env node
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
import { Command } from 'commander';

import init from './command/init';
import start from './command/start';
import stop from './command/stop';

const program = new Command();

// program
program.description(
  'ABC User Feedback CLI that helps to run web frontend and server easily.',
);

program
  .command('init')
  .description(
    'Start the appropriate Docker Compose file based on architecture to setup the ABC User Feedback infrastructure.',
  )
  .action(init);

program
  .command('start')
  .description(
    'Pull ABC User Feedback Docker image and run container with environment variables',
  )
  .action(start);

program
  .command('stop')
  .description('Stop the running Docker containers for app and web services')
  .action(stop);

program.parse(process.argv);
