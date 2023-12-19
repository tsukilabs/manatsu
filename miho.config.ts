import fs from 'node:fs/promises';
import { cwd } from 'node:process';
import { basename, join } from 'node:path';
import { existsSync as exists } from 'node:fs';
import { Octokit } from '@octokit/core';
import { PackageManager, defineConfig } from 'miho';
import { type Options as ExecaOptions, execa } from 'execa';

type PackageName = 'manatsu' | 'components';

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
    skip: ['publish'],
    build: async () => {
      const root = join(cwd(), 'dist');
      const manatsu = dist('manatsu');
      const components = dist('components');

      if (exists(root)) {
        await fs.rm(root, { recursive: true });
      }

      // Build.
      await fs.mkdir(root, { recursive: true });
      const packages: PackageName[] = ['manatsu', 'components'];
      await Promise.all(packages.map(build));

      // Copy files.
      let files = await fs.readdir(manatsu);
      files = files.map((f) => join(manatsu, f));
      await Promise.all(
        files.map((f) => fs.copyFile(f, join(root, basename(f))))
      );

      const indexDtsFile = 'index.d.ts';
      const componentsDtsFile = 'components.d.ts';

      const componentsDts = join(components, indexDtsFile);
      await fs.copyFile(componentsDts, join(root, componentsDtsFile));

      // Fix dts path.
      const indexDts = join(root, indexDtsFile);
      let indexDtsContent = await fs.readFile(indexDts, 'utf-8');
      indexDtsContent = indexDtsContent.replaceAll(
        '@manatsu/components/index.ts',
        `./${componentsDtsFile}`
      );
      await fs.writeFile(indexDts, indexDtsContent, 'utf-8');
    },

    publish: async () => {
      const { version } = await import('./package.json');
      const { GITHUB_TOKEN } = await import('./config.json');
      const octokit = new Octokit({ auth: GITHUB_TOKEN });

      await octokit.request('POST /repos/{owner}/{repo}/releases', {
        tag_name: `v${version}`,
        name: `v${version}`,
        draft: false,
        prerelease: true,
        generate_release_notes: true,
        owner: 'ferreira-tb',
        repo: 'manatsu',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          accept: 'application/vnd.github+json'
        }
      });
    }
  }
});

function dist(pkgName: PackageName) {
  return join(cwd(), `packages/${pkgName}/dist`);
}

function build(pkgName: PackageName) {
  const options: ExecaOptions = { stdio: 'inherit' };
  const pkg = pkgName === 'manatsu' ? pkgName : `@manatsu/${pkgName}`;
  return execa('pnpm', ['-F', pkg, 'build'], options);
}
