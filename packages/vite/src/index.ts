import uno from 'unocss/vite';
import type { Plugin } from 'vite';
import type { Preset } from 'unocss';

export function manatsu(presets: Preset | Preset[] = []): Plugin[] {
    return uno({
        mode: 'vue-scoped',
        presets: Array.isArray(presets) ? presets : [presets]
    });
}
