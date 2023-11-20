import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { existsSync as exists } from 'node:fs';
import { execa } from 'execa';

try {
    await execa('pnpm', ['-F', 'manatsu', 'build'], { stdio: 'inherit' });

    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const lib = path.resolve(dirname, '../packages/manatsu/lib');

    await Promise.all([buildVite(dirname, lib), buildThemes(dirname, lib)]);
    await execa('pnpm', ['minify'], { stdio: 'inherit' });
} catch (err) {
    console.error(err);
    process.exit(1);
}

async function buildVite(dirname: string, lib: string) {
    const vite = path.resolve(dirname, '../packages/vite/dist');
    if (exists(vite)) await fs.rm(vite, { recursive: true });
    await execa('pnpm', ['-F', '@manatsu/vite', 'build'], { stdio: 'inherit' });

    const plugins = path.join(lib, 'plugins');
    if (!exists(plugins)) await fs.mkdir(plugins);

    // prettier-ignore
    await Promise.all([
        fs.rename(
            path.join(vite, 'index.d.ts'),
            path.join(plugins, 'vite.d.ts')
        ),
        fs.rename(
            path.join(vite, 'vite.js'),
            path.join(plugins, 'vite.js')
        )
    ]);
}

async function buildThemes(dirname: string, lib: string) {
    const themes = path.resolve(dirname, '../packages/themes/dist');
    if (exists(themes)) await fs.rm(themes, { recursive: true });
    await execa('pnpm', ['-F', '@manatsu/themes', 'build'], {
        stdio: 'inherit'
    });

    // prettier-ignore
    await Promise.all([
        fs.rename(
            path.join(themes, 'index.d.ts'),
            path.join(lib, 'themes.d.ts')
        ),
        fs.rename(
            path.join(themes, 'themes.js'),
            path.join(lib, 'themes.js')
        )
    ]);
}
