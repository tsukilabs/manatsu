import type { App } from 'vue';
import type { ManatsuPluginGlobal } from '@manatsu/vue-plugin/src/index.ts';
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
    readonly $mana: ManatsuPluginGlobal;
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

export { type ManatsuOptions, createManatsu } from '@manatsu/vue-plugin/src/index.ts';

export type {
  ButtonVariant,
  CardVariant,
  ColumnSortFn,
  SidebarItem,
  TopAppbarMenuItem
} from '@manatsu/components/src/index.ts';

export {
  type DialogOptions,
  type ErrorLog,
  type MaybeNullishRef,
  type VersionSnapshot,
  defineEmptyComponent,
  getCurrentApp,
  getRouter,
  handleError,
  injectStrict,
  symbols
} from '@manatsu/shared';

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

export {
  type UseInvokeOptions,
  type UseInvokeReturn,
  invokeOnKeyDown,
  invokeOnKeyPressed,
  invokeOnKeyStroke,
  invokeOnKeyUp,
  navigateOnKeyDown,
  navigateOnKeyPressed,
  navigateOnKeyStroke,
  navigateOnKeyUp,
  onKeyDown,
  onKeyPressed,
  onKeyStroke,
  onKeyUp,
  useDialog,
  useElementSize,
  useInvoke,
  useListen
} from '@manatsu/composables/src/index.ts';

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
