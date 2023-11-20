import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { minify, type MinifyOptions } from 'terser';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const lib = path.resolve(dirname, '../packages/manatsu/lib');

async function files(dir: string): Promise<string[]> {
    const targets: string[] = [];
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
        const direntPath = path.join(dir, dirent.name);
        if (dirent.isFile() && path.extname(dirent.name) === '.js') {
            targets.push(direntPath);
        } else if (dirent.isDirectory()) {
            targets.push(...(await files(direntPath)));
        }
    }

    return targets;
}

const options: MinifyOptions = {
    ecma: 2020,
    format: {
        preserve_annotations: true
    }
};

try {
    for (const file of await files(lib)) {
        const content = await fs.readFile(file, 'utf-8');
        const result = await minify(content, options);
        if (!result.code) throw new Error(`Could not minify ${file}`);
        await fs.writeFile(file, result.code, 'utf-8');
    }
} catch (err) {
    console.error(err);
    process.exit(1);
}
