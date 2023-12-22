import { join } from 'node:path';
import fs from 'node:fs/promises';
import process from 'node:process';
import { packageRoot, packages } from './packages';

const readme = 'README.md';
const srcReadme = join(process.cwd(), readme);

try {
  await Promise.all(
    packages().map((pkg) => {
      const destReadme = join(packageRoot(pkg), readme);
      return fs.copyFile(srcReadme, destReadme);
    })
  );
} catch (err) {
  console.error(err);
  process.exit(1);
}
