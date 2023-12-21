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
const { exec } = require('child_process');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function executeCommands() {
  try {
    await runCommand(
      'node_modules/.bin/postcss --config src/base src/base/*.css --base src --dir dist',
    );
    await runCommand('cat dist/base/*.css > dist/base.css');
    await runCommand(
      'node_modules/.bin/prejss-cli dist/base.css --format commonjs',
    );

    await runCommand(
      'node_modules/.bin/postcss --config src/utilities src/utilities/*.css --base src --dir dist',
    );
    await runCommand('cat dist/utilities/*.css > dist/utilities.css');
    await runCommand(
      'node_modules/.bin/prejss-cli dist/utilities.css --format commonjs',
    );

    await runCommand(
      'node_modules/.bin/postcss --config src/components src/components/*.css --base src --dir dist',
    );
    await runCommand('cat dist/components/*.css > dist/components.css');
    await runCommand(
      'node_modules/.bin/prejss-cli dist/components.css --format commonjs',
    );
  } catch (error) {
    console.error('Error executing commands:', error);
  }
}

// Run the commands asynchronously
executeCommands();
