import { type App, readonly } from 'vue';
import { symbols } from '@manatsu/shared';
import { useWindowFocus, useWindowSize } from '@vueuse/core';
import { provideDialog } from './dialog';
import { provideErrorHandler } from './error';
import type { ManatsuOptions } from '../types';
import { isDarkMode, provideDarkMode } from './dark-mode';

export { isDarkMode };

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
