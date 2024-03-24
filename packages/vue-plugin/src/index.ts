import type { App, Plugin } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';
import {
  type DarkMode,
  type ErrorHandler,
  injectStrict,
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
      (app.config.globalProperties.$mana as any) = createGlobalProps();

      // Error handling
      const errorHandler = (options.errorHandler ?? defaultErrorHandler).bind(app);
      app.config.errorHandler = errorHandler;
      app.provide(privateSymbols.errorHandler, errorHandler);

      setGlobalManatsu({ app });
    }
  };

  return manatsu;
}

function createGlobalProps(): ManatsuPluginGlobal {
  const mana: ManatsuPluginGlobal = {
    isDarkMode,
    setDarkMode: (darkMode) => {
      const darkModeRef = injectStrict(symbols.darkMode);
      darkModeRef.value = darkMode;
    },
    toggleDarkMode: () => {
      const darkModeRef = injectStrict(symbols.darkMode);
      darkModeRef.value = !darkModeRef.value;
    }
  };

  return mana;
}

// This will be changed to something useful once Tauri v2 is released.
function defaultErrorHandler(this: App, err: unknown) {
  console.error(err);
}
