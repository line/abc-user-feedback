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
const fs = require('fs');
const glob = require('glob');
const util = require('util');
const globAsync = util.promisify(glob);
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

async function concatCssFiles(source, output) {
  try {
    // Use glob to match all css files in the source files
    const files = await globAsync(source);

    // Concatenate the content of all matched CSS files
    const combinedCss = files
      .map((file) => fs.readFileSync(file, 'utf8'))
      .join('');

    // Write the combined content to output css file
    fs.writeFileSync(output, combinedCss);
  } catch (error) {
    console.error('Error concatenating CSS files:', error);
    process.exit(1);
  }
}

async function executeCommands() {
  try {
    await runCommand('npm run build:postcss-base');
    await concatCssFiles('dist/base/*.css', 'dist/base.css');
    await runCommand('npm run build:prejss-base');

    await runCommand('npm run build:postcss-utilities');
    await concatCssFiles('dist/utilities/*.css', 'dist/utilities.css');
    await runCommand('npm run build:prejss-utilities');

    await runCommand('npm run build:postcss-components');
    await concatCssFiles('dist/components/*.css', 'dist/components.css');
    await runCommand('npm run build:prejss-components');
  } catch (error) {
    console.error('Error executing commands:', error);
  }
}

// Run the commands asynchronously
executeCommands();
