import fs from 'fs';
import path from 'path';

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
export function writeFile(p: string, content: string) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
}
export function exists(p: string) {
  return fs.existsSync(p);
}
export function readFile(p: string) {
  return fs.readFileSync(p, 'utf8');
}
