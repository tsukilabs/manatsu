import { usePreferredDark } from '@vueuse/core';
import { type App, type Plugin, inject, ref, watchEffect } from 'vue';
import {
  type DarkMode,
  type ManatsuGlobal,
  type ManatsuOptions,
  darkModeKey,
  isDarkMode,
  setDarkMode
} from '@manatsu/shared';

declare module 'vue' {
  interface ComponentCustomProperties {
    $mana: ManatsuGlobal;
  }
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      provideDarkMode(app, options.darkMode ?? 'auto');

      const globalProps = generateGlobalProps.bind(app);
      app.config.globalProperties.$mana = globalProps();
    }
  };

  return manatsu;
}

function generateGlobalProps(this: App): ManatsuGlobal {
  const mana: ManatsuGlobal = {
    isDarkMode,
    setDarkMode: (darkMode) => {
      this.runWithContext(() => {
        const darkModeRef = inject(darkModeKey);
        if (darkModeRef) darkModeRef.value = darkMode;
      });
    },
    toggleDarkMode: () => {
      this.runWithContext(() => {
        const darkMode = inject(darkModeKey);
        if (darkMode) darkMode.value = !darkMode.value;
      });
    }
  };

  return mana;
}

function provideDarkMode(app: App, initial: DarkMode) {
  const darkModeRef = ref(initial);
  app.provide(darkModeKey, darkModeRef);

  const preferredDark = usePreferredDark();
  watchEffect(() => {
    if (darkModeRef.value === 'auto') {
      setDarkMode(preferredDark.value);
    } else {
      setDarkMode(darkModeRef.value);
    }
  });
}
