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
import { spawn } from 'child_process';

export function run(cmd: string, args: string[] = [], cwd?: string) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      cwd,
      shell: process.platform === 'win32',
    });
    p.on('close', (code) =>
      code === 0 ? resolve() : (
        reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))
      ),
    );
  });
}

export function runWithStdin(
  cmd: string,
  args: string[] = [],
  input: string,
  cwd?: string,
) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: ['pipe', 'inherit', 'inherit'],
      cwd,
      shell: process.platform === 'win32',
    });

    p.stdin.write(input);
    p.stdin.end();

    p.on('close', (code) =>
      code === 0 ? resolve() : (
        reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))
      ),
    );
  });
}
