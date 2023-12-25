import { PackageManager, defineConfig } from 'miho';

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
    build: true,
    publish: false
  }
});
