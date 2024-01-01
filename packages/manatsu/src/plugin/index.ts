import { usePreferredDark } from '@vueuse/core';
import { type Plugin, ref, watchEffect } from 'vue';
import { darkModeKey } from '../symbol';
import { setDarkMode } from './dark-mode';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: boolean | 'auto';
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const darkMode = ref(options.darkMode ?? 'auto');
      const preferredDark = usePreferredDark();
      app.provide(darkModeKey, darkMode);

      watchEffect(() => {
        if (darkMode.value === 'auto') {
          setDarkMode(preferredDark.value);
        } else {
          setDarkMode(darkMode.value);
        }
      });
    }
  };

  return manatsu;
}
