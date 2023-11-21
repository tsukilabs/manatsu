import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { existsSync as exists } from 'node:fs';
import { execa } from 'execa';

try {
    await execa('pnpm', ['-F', 'manatsu', 'build'], { stdio: 'inherit' });
    await buildPresets();
    await execa('pnpm', ['minify'], { stdio: 'inherit' });
} catch (err) {
    console.error(err);
    process.exit(1);
}

async function buildPresets() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const lib = path.resolve(dirname, '../packages/manatsu/lib');

    const presets = path.resolve(dirname, '../packages/presets/dist');
    if (exists(presets)) await fs.rm(presets, { recursive: true });
    await execa('pnpm', ['-F', '@manatsu/presets', 'build'], {
        stdio: 'inherit'
    });

    await Promise.all([
        fs.rename(
            path.join(presets, 'index.d.ts'),
            path.join(lib, 'presets.d.ts')
        ),
        fs.rename(
            path.join(presets, 'presets.mjs'),
            path.join(lib, 'presets.mjs')
        ),
        fs.rename(
            path.join(presets, 'presets.cjs'),
            path.join(lib, 'presets.cjs')
        )
    ]);
}
