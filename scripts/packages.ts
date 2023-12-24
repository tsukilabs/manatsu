import { join } from 'node:path';
import { cwd } from 'node:process';
import { execa } from 'execa';

export type PackageName = 'manatsu' | 'components' | 'composables';

export function packages(...exclude: PackageName[]) {
  const pkgs: PackageName[] = ['manatsu', 'components', 'composables'];
  return pkgs.filter((pkg) => !exclude.includes(pkg));
}

export function packageRoot(pkgName: PackageName) {
  return join(cwd(), `packages/${pkgName}`);
}

export function dist(pkgName: PackageName) {
  return join(packageRoot(pkgName), 'dist');
}

export function build(pkgName: PackageName) {
  const pkg = pkgName === 'manatsu' ? pkgName : `@manatsu/${pkgName}`;
  return execa('pnpm', ['-F', pkg, 'build'], { stdio: 'inherit' });
}
