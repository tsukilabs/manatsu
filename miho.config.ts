import { join } from 'node:path';
import fs from 'node:fs/promises';
import { cwd } from 'node:process';
import { Octokit } from '@octokit/core';
import { PackageManager, defineConfig } from 'miho';
import { type Options as ExecaOptions, execa } from 'execa';

type PackageName = 'manatsu' | 'components' | 'composables';
const execaOptions: ExecaOptions = { stdio: 'inherit' };

export default defineConfig({
  packageManager: PackageManager.PNPM,
  recursive: true,
  commit: {
    push: false,
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
    build: async () => {
      // Build.
      const packages: PackageName[] = ['manatsu', 'components', 'composables'];
      await Promise.all(packages.map(build));

      // Copy files.
      type Deps = Exclude<PackageName, 'manatsu'>[];
      const deps: Deps = ['components', 'composables'];

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
        await github(GITHUB_TOKEN);
      } else {
        const args = ['publish', '-r', '--no-git-checks'];
        await execa('pnpm', args, execaOptions);
      }
    }
  }
});

function dist(pkgName: PackageName) {
  return join(cwd(), `packages/${pkgName}/dist`);
}

function build(pkgName: PackageName) {
  const pkg = pkgName === 'manatsu' ? pkgName : `@manatsu/${pkgName}`;
  return execa('pnpm', ['-F', pkg, 'build'], execaOptions);
}

async function github(token: string) {
  const { version } = await import('./package.json');
  const octokit = new Octokit({ auth: token });

  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    tag_name: `v${version}`,
    name: `v${version}`,
    draft: false,
    prerelease: true,
    generate_release_notes: true,
    owner: 'manatsujs',
    repo: 'manatsu',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      accept: 'application/vnd.github+json'
    }
  });
}
