import { type App, type Plugin, inject } from 'vue';
import { type DarkMode, symbols } from '@manatsu/shared';
import { provideDialog } from './dialog';
import { isDarkMode, provideDarkMode } from './dark-mode';

interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: DarkMode;
  /**
   * Automatically place a `m-dynamic-dialog` component inside the `m-scaffold`.
   * @default true
   */
  scaffoldDialog?: boolean;
}

export interface ManatsuGlobal {
  isDarkMode: () => boolean;
  setDarkMode: (darkMode: DarkMode) => void;
  toggleDarkMode: () => void;
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      provideDarkMode(app, options.darkMode);
      provideDialog(app, options.scaffoldDialog);

      // Using `any` so we can let `$mana` remain read-only.
      const globalProps = createGlobalProps.bind(app);
      (app.config.globalProperties.$mana as any) = globalProps();
    }
  };

  return manatsu;
}

function createGlobalProps(this: App): ManatsuGlobal {
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
        const darkModeRef = inject(symbols.darkMode);
        if (darkModeRef) darkModeRef.value = !darkModeRef.value;
      });
    }
  };

  return mana;
}
