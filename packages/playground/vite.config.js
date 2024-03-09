import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dev from 'vite-plugin-vue-devtools';
import autoImport from 'unplugin-auto-import/vite';
import vueImport from 'unplugin-vue-components/vite';
import vueImportConfig from '@tb-dev/vue-import-config';
import autoImportConfig from '@tb-dev/auto-import-config';

const autoImportOptions = autoImportConfig({
  manatsu: false
});

export default defineConfig({
  plugins: [vue(), dev(), autoImport(autoImportOptions), vueImport(vueImportConfig())],
  clearScreen: false,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url))
    }
  },
  server: {
    port: 1425,
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
