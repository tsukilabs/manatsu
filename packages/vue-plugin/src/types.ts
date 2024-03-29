import type { Router } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';
import type { DarkMode, ErrorHandler } from '@manatsu/shared';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: DarkMode;
  errorHandler?: Nullish<ErrorHandler>;
  /**
   * Automatically place a dynamic dialog inside the scaffold.
   * @default true
   */
  placeDialogOnScaffold?: boolean;
  router?: Router;
}

export interface ManatsuPluginGlobal {
  isDarkMode: () => boolean;
  setDarkMode: (darkMode: DarkMode) => void;
  toggleDarkMode: () => void;
}
