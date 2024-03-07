import './style/main.scss';
import type { App } from 'vue';
import type { ManatsuGlobal } from '@manatsu/vue-plugin/src/index.ts';
import {
  MButton,
  MCard,
  MCheckbox,
  MDialog,
  MDynamicDialog,
  MDynamicLink,
  MInputText,
  MRadio,
  MScaffold,
  MTable,
  MTableColumn,
  MToolbar,
  MTopAppbar
} from '@manatsu/components/src/index.ts';

declare module 'vue' {
  export interface ComponentCustomProperties {
    readonly $mana: ManatsuGlobal;
  }

  export interface GlobalComponents {
    MButton: typeof MButton;
    MCard: typeof MCard;
    MCheckbox: typeof MCheckbox;
    MDialog: typeof MDialog;
    MDynamicDialog: typeof MDynamicDialog;
    MDynamicLink: typeof MDynamicLink;
    MInputText: typeof MInputText;
    MRadio: typeof MRadio;
    MScaffold: typeof MScaffold;
    MTable: typeof MTable;
    MTableColumn: typeof MTableColumn;
    MToolbar: typeof MToolbar;
    MTopAppbar: typeof MTopAppbar;
  }
}

export { type MaybeNullishRef, symbols } from '@manatsu/shared';

export { createManatsu } from '@manatsu/vue-plugin/src/index.ts';

export { defineInvoke, useElementSize } from '@manatsu/composables/src/index.ts';

export {
  MButton,
  MCard,
  MCheckbox,
  MDialog,
  MDynamicDialog,
  MDynamicLink,
  MInputText,
  MRadio,
  MScaffold,
  MTable,
  MTableColumn,
  MToolbar,
  MTopAppbar
};

export type {
  ButtonVariant,
  CardVariant,
  SidebarItem,
  TopAppbarMenuItem
} from '@manatsu/components/src/index.ts';

/**
 * Globally registers all components.
 * @param app Vue app instance.
 */
export function registerComponents(app: App) {
  app.component('MButton', MButton);
  app.component('MCard', MCard);
  app.component('MCheckbox', MCheckbox);
  app.component('MDialog', MDialog);
  app.component('MDynamicDialog', MDynamicDialog);
  app.component('MDynamicLink', MDynamicLink);
  app.component('MInputText', MInputText);
  app.component('MRadio', MRadio);
  app.component('MScaffold', MScaffold);
  app.component('MTable', MTable);
  app.component('MTableColumn', MTableColumn);
  app.component('MToolbar', MToolbar);
  app.component('MTopAppbar', MTopAppbar);
}
