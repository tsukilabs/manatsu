import type { InjectionKey, Ref } from 'vue';
import type { DarkMode } from './types';

type RefSymbol<T> = InjectionKey<Readonly<Ref<T>>>;
type WritableRefSymbol<T> = InjectionKey<Ref<T>>;

const darkMode = Symbol('m-options-dark-mode') as WritableRefSymbol<DarkMode>;

const scaffoldBottomHeight = Symbol('m-scaffold-bottom-height') as RefSymbol<number>;
const scaffoldContentHeight = Symbol('m-scaffold-content-height') as RefSymbol<number>;
const scaffoldSidebarWidth = Symbol('m-scaffold-sidebar-width') as RefSymbol<number>;
const scaffoldTopHeight = Symbol('m-scaffold-top-height') as RefSymbol<number>;

export const symbols = {
  darkMode,
  scaffoldBottomHeight,
  scaffoldContentHeight,
  scaffoldSidebarWidth,
  scaffoldTopHeight
} as const;

const placeDialogOnScaffold = Symbol('m-options-dialog-on-scaffold') as RefSymbol<boolean>;
const dynamicDialogVisible = Symbol('m-options-dialog-visible') as WritableRefSymbol<boolean>;

export const privateSymbols = {
  dynamicDialogVisible,
  placeDialogOnScaffold
} as const;
