import './style/main.scss';
import type { App } from 'vue';
import {
  MButton,
  MCard,
  MCheckbox,
  MDynamicLink,
  MInputText,
  MRadio,
  MScaffold,
  MTopAppbar
} from '@manatsu/components/src/index.ts';

declare module 'vue' {
  interface ComponentCustomProperties {
    $mana: import('./plugin').ManatsuGlobal;
  }

  interface GlobalComponents {
    MButton: typeof MButton;
    MCard: typeof MCard;
    MCheckbox: typeof MCheckbox;
    MDynamicLink: typeof MDynamicLink;
    MInputText: typeof MInputText;
    MRadio: typeof MRadio;
    MScaffold: typeof MScaffold;
    MTopAppbar: typeof MTopAppbar;
  }
}

export { createManatsu } from './plugin';

export { type MaybeNullishRef, isDarkMode } from '@manatsu/shared';

export { MButton, MCard, MCheckbox, MDynamicLink, MInputText, MRadio, MScaffold, MTopAppbar };

export type {
  ButtonVariant,
  CardVariant,
  SidebarItem,
  TopAppbarMenuItem
} from '@manatsu/components/src/index.ts';

export {
  useDarkMode,
  useHeight,
  useInvoke,
  usePixelHeight,
  usePixelWidth,
  useWidth
} from '@manatsu/composables/src/index.ts';

/**
 * Globally registers all components.
 * @param app Vue app instance.
 */
export function registerComponents(app: App) {
  app.component('MButton', MButton);
  app.component('MCard', MCard);
  app.component('MCheckbox', MCheckbox);
  app.component('MDynamicLink', MDynamicLink);
  app.component('MInputText', MInputText);
  app.component('MRadio', MRadio);
  app.component('MScaffold', MScaffold);
  app.component('MTopAppbar', MTopAppbar);
}
