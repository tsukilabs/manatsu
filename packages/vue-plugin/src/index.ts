import { type App, type Plugin, inject } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';
import {
  type DarkMode,
  type ErrorHandler,
  privateSymbols,
  setGlobalManatsu,
  symbols
} from '@manatsu/shared';
import { provideDialog } from './dialog';
import { isDarkMode, provideDarkMode } from './dark-mode';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: DarkMode;
  errorHandler?: Nullish<ErrorHandler>;
  /**
   * Automatically place a `m-dynamic-dialog` component inside the `m-scaffold`.
   * @default true
   */
  placeDialogOnScaffold?: boolean;
}

export interface ManatsuPluginGlobal {
  isDarkMode: () => boolean;
  setDarkMode: (darkMode: DarkMode) => void;
  toggleDarkMode: () => void;
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      provideDarkMode(app, options.darkMode);
      provideDialog(app, options.placeDialogOnScaffold);

      // Using `any` so we can let `$mana` remain read-only.
      (app.config.globalProperties.$mana as any) = createGlobalProps(app);

      // Error handling
      const errorHandler = (options.errorHandler ?? handleError).bind(app);
      app.config.errorHandler = errorHandler;
      app.provide(privateSymbols.errorHandler, errorHandler);

      setGlobalManatsu({ app });
    }
  };

  return manatsu;
}

function createGlobalProps(app: App): ManatsuPluginGlobal {
  const mana: ManatsuPluginGlobal = {
    isDarkMode,
    setDarkMode: (darkMode) => {
      app.runWithContext(() => {
        const darkModeRef = inject(symbols.darkMode);
        if (darkModeRef) darkModeRef.value = darkMode;
      });
    },
    toggleDarkMode: () => {
      app.runWithContext(() => {
        const darkModeRef = inject(symbols.darkMode);
        if (darkModeRef) darkModeRef.value = !darkModeRef.value;
      });
    }
  };

  return mana;
}

// This will be changed to something more useful once Tauri v2 is released.
function handleError(this: App, err: unknown) {
  console.error(err);
}
