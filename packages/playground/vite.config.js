import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dev from 'vite-plugin-vue-devtools';
import autoImport from 'unplugin-auto-import/vite';
import autoImportOptions from '@tb-dev/auto-import-config';

export default defineConfig({
  plugins: [vue(), dev(), autoImport(autoImportOptions())],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**']
    }
  },
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: false
  }
});
