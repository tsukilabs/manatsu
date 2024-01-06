import uno from 'unocss/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dev from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [vue({ script: { defineModel: true } }), dev(), uno({ mode: 'vue-scoped' })],
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
