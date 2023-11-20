import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import manatsu from '../plugins/vite';
import { ManatsuDark } from '../themes/manatsu-dark';

export default defineConfig({
    plugins: [vue(), manatsu(ManatsuDark)]
});
