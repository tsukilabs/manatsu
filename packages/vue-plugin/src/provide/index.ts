import { type App, readonly } from 'vue';
import { symbols } from '@manatsu/shared';
import { useWindowFocus, useWindowSize } from '@vueuse/core';
import { provideDialog } from './dialog';
import { provideErrorHandler } from './error';
import { provideDarkMode } from './dark-mode';
import type { ManatsuOptions } from '../types';

export { isDarkMode, setDarkMode, toggleDarkMode } from './dark-mode';

export function provide(app: App, options: ManatsuOptions) {
  app.runWithContext(() => {
    provideDarkMode(app, options.darkMode);
    provideDialog(app, options.placeDialogOnScaffold);
    provideErrorHandler(app, options.errorHandler);

    const focus = useWindowFocus();
    app.provide(symbols.windowFocus, readonly(focus));

    const { height, width } = useWindowSize();
    app.provide(symbols.windowHeight, readonly(height));
    app.provide(symbols.windowWidth, readonly(width));
  });
}
