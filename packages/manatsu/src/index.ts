import type { App } from 'vue';
import type { ManatsuPluginGlobal } from '@manatsu/vue-plugin/src/index.ts';
import {
  MButton,
  MCard,
  MCheckbox,
  MChip,
  MDialog,
  MDynamicDialog,
  MDynamicLink,
  MEllipsis,
  MInputText,
  MRadio,
  MScaffold,
  MSelect,
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
    MChip: typeof MChip;
    MDialog: typeof MDialog;
    MDynamicDialog: typeof MDynamicDialog;
    MDynamicLink: typeof MDynamicLink;
    MEllipsis: typeof MEllipsis;
    MInputText: typeof MInputText;
    MRadio: typeof MRadio;
    MScaffold: typeof MScaffold;
    MSelect: typeof MSelect;
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
  ChipVariant,
  ColumnSortFn,
  SelectOption,
  SidebarItem,
  TopAppbarMenuItem
} from '@manatsu/components/src/index.ts';

export {
  type ComputedSymbol,
  type DialogOptions,
  type ErrorLog,
  type MaybeNullishRef,
  type RefSymbol,
  type ShallowRefSymbol,
  type VersionSnapshot,
  type WritableRefSymbol,
  type WritableShallowRefSymbol,
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
  MChip,
  MDialog,
  MDynamicDialog,
  MDynamicLink,
  MEllipsis,
  MInputText,
  MRadio,
  MScaffold,
  MSelect,
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
  app.component('MChip', MChip);
  app.component('MDialog', MDialog);
  app.component('MDynamicDialog', MDynamicDialog);
  app.component('MDynamicLink', MDynamicLink);
  app.component('MEllipsis', MEllipsis);
  app.component('MInputText', MInputText);
  app.component('MRadio', MRadio);
  app.component('MScaffold', MScaffold);
  app.component('MSelect', MSelect);
  app.component('MTable', MTable);
  app.component('MTableColumn', MTableColumn);
  app.component('MToolbar', MToolbar);
  app.component('MTopAppbar', MTopAppbar);
}
