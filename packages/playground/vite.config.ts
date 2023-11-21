/// <reference types="vite/client" />
import * as path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import uno from 'unocss/vite';

export default defineConfig({
  plugins: [
    vue(),
    uno({
      configFile: path.join(__dirname, 'uno.config.ts')
    })
  ]
});
