import { usePreferredDark } from '@vueuse/core';
import { type App, type Plugin, inject, ref, watchEffect } from 'vue';
import { type DarkMode, isDarkMode, setDarkMode, symbols } from '@manatsu/shared';

interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: DarkMode;
}

export interface ManatsuGlobal {
  isDarkMode: () => boolean;
  setDarkMode: (darkMode: DarkMode) => void;
  toggleDarkMode: () => void;
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
        const darkModeRef = inject(symbols.darkMode);
        if (darkModeRef) darkModeRef.value = darkMode;
      });
    },
    toggleDarkMode: () => {
      this.runWithContext(() => {
        const darkMode = inject(symbols.darkMode);
        if (darkMode) darkMode.value = !darkMode.value;
      });
    }
  };

  return mana;
}

function provideDarkMode(app: App, initial: DarkMode) {
  const darkModeRef = ref(initial);
  app.provide(symbols.darkMode, darkModeRef);

  const preferredDark = usePreferredDark();
  watchEffect(() => {
    if (darkModeRef.value === 'auto') {
      setDarkMode(preferredDark.value);
    } else {
      setDarkMode(darkModeRef.value);
    }
  });
}
