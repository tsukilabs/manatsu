import { join } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  plugins: [dts({ rollupTypes: true })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: join(__dirname, 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.mjs';
          case 'cjs':
            return 'index.cjs';
          default:
            throw new Error(`Invalid format: ${format}`);
        }
      }
    },
    rollupOptions: {
      external: ['vue']
    }
  }
});
