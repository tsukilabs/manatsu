import path from 'node:path';
import fs from 'node:fs/promises';
import process from 'node:process';
import { existsSync as exists } from 'node:fs';
import { Octokit } from '@octokit/core';
import { PackageManager, defineConfig } from 'miho';
import { type Options as ExecaOptions, execa } from 'execa';

export default defineConfig({
  recursive: true,
  packageManager: PackageManager.PNPM,
  commit: {
    push: true,
    all: true
  },
  jobs: {
    skip: ['publish'],
    build: async () => {
      const dist = path.join(process.cwd(), 'packages/manatsu/dist');
      const components = path.join(process.cwd(), 'packages/components/dist');

      if (exists(dist)) {
        await fs.rm(dist, { recursive: true });
      }

      const options: ExecaOptions = { stdio: 'inherit' };
      await Promise.all([
        execa('pnpm', ['-F', 'manatsu', 'build'], options),
        execa('pnpm', ['-F', 'components', 'build'], options)
      ]);

      const dts = path.join(components, 'index.d.ts');
      await fs.rename(dts, path.join(dist, 'index.d.ts'));

      await execa('pnpm', ['minify'], options);
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
