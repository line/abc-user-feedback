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

    p.stdin?.write(input);
    p.stdin?.end();

    p.on('close', (code) =>
      code === 0 ? resolve() : (
        reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))
      ),
    );
  });
}
