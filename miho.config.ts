import { join } from 'node:path';
import fs from 'node:fs/promises';
import { execa } from 'execa';
import { PackageManager, defineConfig } from 'miho';
import { github } from './scripts/github';
import { type PackageName, build, dist, packages } from './scripts/packages';

export default defineConfig({
  packageManager: PackageManager.PNPM,
  recursive: true,
  commit: {
    push: true,
    all: true,
    message: (miho) => {
      const pkg = miho.getPackageByName('manatsu');
      if (!pkg) throw new Error('No package found.');
      const { newVersion } = pkg;
      if (!newVersion) return null;
      return `chore: bump version to ${newVersion}`;
    }
  },
  jobs: {
    // As the main branch is protected, this job should be executed on its own.
    skip: ['publish'],

    build: async () => {
      // Build.
      await Promise.all(packages().map(build));

      // Copy files.
      type Deps = Exclude<PackageName, 'manatsu'>[];
      const deps = packages('manatsu') as Deps;

      await Promise.all(
        deps.map((pkg): Promise<void> => {
          const distDir = dist(pkg);
          const pkgDts = join(distDir, 'index.d.ts');
          return fs.copyFile(pkgDts, join(dist('manatsu'), `${pkg}.d.ts`));
        })
      );

      // Fix dts path.
      const dts = join(dist('manatsu'), 'index.d.ts');
      let dtsContent = await fs.readFile(dts, 'utf-8');

      for (const dep of deps) {
        dtsContent = dtsContent.replaceAll(
          `@manatsu/${dep}/index.ts`,
          `./${dep}`
        );
      }

      await fs.writeFile(dts, dtsContent, 'utf-8');
    },

    publish: async () => {
      const { GITHUB, GITHUB_TOKEN } = await import('./config.json');
      if (GITHUB) {
        const { version } = await import('./package.json');
        await github(GITHUB_TOKEN, version);
      } else {
        const args = ['publish', '-r', '--no-git-checks'];
        await execa('pnpm', args, { stdio: 'inherit' });
      }
    }
  }
});
