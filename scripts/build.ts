import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { existsSync as exists } from 'node:fs';
import { execa } from 'execa';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(dirname, '../packages/manatsu/dist');
const components = path.resolve(dirname, '../packages/components/dist');

try {
  if (exists(dist)) {
    await fs.rm(dist, { recursive: true });
  }

  await Promise.all([
    execa('pnpm', ['-F', 'manatsu', 'build']),
    execa('pnpm', ['-F', 'components', 'build'])
  ]);

  const dts = path.join(components, 'index.d.ts');
  await fs.rename(dts, path.join(dist, 'index.d.ts'));

  await execa('pnpm', ['minify'], { stdio: 'inherit' });
} catch (err) {
  console.error(err);
  process.exit(1);
}
