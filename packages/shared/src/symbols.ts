import type { InjectionKey, Ref } from 'vue';
import type { DarkMode } from './types';

type BooleanSymbol = InjectionKey<Readonly<Ref<boolean>>>;
type NumberSymbol = InjectionKey<Readonly<Ref<number>>>;

const darkMode = Symbol('m-options-dark-mode') as InjectionKey<Ref<DarkMode>>;

const scaffoldBottomHeight = Symbol('m-scaffold-bottom-height') as NumberSymbol;
const scaffoldContentHeight = Symbol('m-scaffold-content-height') as NumberSymbol;
const scaffoldSidebarWidth = Symbol('m-scaffold-sidebar-width') as NumberSymbol;
const scaffoldTopHeight = Symbol('m-scaffold-top-height') as NumberSymbol;

export const symbols = {
  darkMode,
  scaffoldBottomHeight,
  scaffoldContentHeight,
  scaffoldSidebarWidth,
  scaffoldTopHeight
} as const;

const scaffoldDialog = Symbol('m-options-scaffold-dialog') as BooleanSymbol;

export const privateSymbols = {
  scaffoldDialog
} as const;
