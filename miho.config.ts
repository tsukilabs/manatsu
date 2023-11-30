import path from 'node:path';
import fs from 'node:fs/promises';
import process from 'node:process';
import { existsSync as exists } from 'node:fs';
import { Octokit } from '@octokit/core';
import { PackageManager, defineConfig } from 'miho';
import { type Options as ExecaOptions, execa } from 'execa';

type PackageName = 'manatsu' | 'components' | 'themes';

function getDistDir(packageName: PackageName) {
  return path.join(process.cwd(), `packages/${packageName}/dist`);
}

function buildPackage(packageName: PackageName) {
  const options: ExecaOptions = { stdio: 'inherit' };
  return execa('pnpm', ['-F', packageName, 'build'], options);
}

export default defineConfig({
  packageManager: PackageManager.PNPM,
  recursive: true,
  commit: {
    push: true,
    all: true
  },
  jobs: {
    skip: ['publish'],
    build: async () => {
      const manatsu = getDistDir('manatsu');
      const components = getDistDir('components');

      if (exists(manatsu)) {
        await fs.rm(manatsu, { recursive: true });
      }

      // Build.
      const packages = ['manatsu', 'components', 'themes'] as const;
      await Promise.all(packages.map((pkg) => buildPackage(pkg)));

      // Move files.
      const dts = path.join(components, 'index.d.ts');
      await fs.rename(dts, path.join(manatsu, 'index.d.ts'));
    },
    publish: async () => {
      const { version } = await import('./package.json');
      const { GITHUB_TOKEN } = await import('./config.json');
      const octokit = new Octokit({ auth: GITHUB_TOKEN });

      await octokit.request('POST /repos/{owner}/{repo}/releases', {
        tag_name: version,
        name: version,
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
