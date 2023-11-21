import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { existsSync as exists } from 'node:fs';
import { execa } from 'execa';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(dirname, '../packages/manatsu/dist');

try {
  if (exists(dist)) await fs.rm(dist, { recursive: true });
  await execa('pnpm', ['-F', 'manatsu', 'build'], { stdio: 'inherit' });

  await buildVue();
  await execa('pnpm', ['minify'], { stdio: 'inherit' });
} catch (err) {
  console.error(err);
  process.exit(1);
}

async function buildVue() {
  const targetVueDist = path.join(dist, 'vue');
  if (!exists(targetVueDist))
    await fs.mkdir(targetVueDist, { recursive: true });

  const localVueDist = path.resolve(dirname, '../packages/vue/dist');
  if (exists(localVueDist)) await fs.rm(localVueDist, { recursive: true });
  await execa('pnpm', ['-F', '@manatsu/vue', 'build'], {
    stdio: 'inherit'
  });

  await Promise.all([
    fs.rename(
      path.join(localVueDist, 'index.d.ts'),
      path.join(targetVueDist, 'index.d.ts')
    ),
    fs.rename(
      path.join(localVueDist, 'index.js'),
      path.join(targetVueDist, 'index.mjs')
    ),
    fs.rename(
      path.join(localVueDist, 'index.cjs'),
      path.join(targetVueDist, 'index.cjs')
    )
  ]);
}
