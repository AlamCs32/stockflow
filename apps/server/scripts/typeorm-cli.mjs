import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const typeormDir = path.dirname(require.resolve('typeorm'));
const cliPath = path.join(typeormDir, 'cli.js');
const tsxLoader = path.join(
  path.dirname(require.resolve('tsx/package.json')),
  'dist',
  'esm',
  'index.mjs'
);

const args = process.argv.slice(2);
const result = spawnSync(
  process.execPath,
  ['--import', pathToFileURL(tsxLoader).href, cliPath, ...args],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
  }
);
process.exit(result.status ?? 0);
