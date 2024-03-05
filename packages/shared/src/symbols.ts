import type { InjectionKey, Ref } from 'vue';
import type { DarkMode } from './types';

type SizeSymbol = InjectionKey<Readonly<Ref<number>>>;

const darkMode = Symbol('m-dark-mode') as InjectionKey<Ref<DarkMode>>;

const scaffoldBottomHeight = Symbol('m-scaffold-bottom-height') as SizeSymbol;
const scaffoldContentHeight = Symbol('m-scaffold-content-height') as SizeSymbol;
const scaffoldSidebarWidth = Symbol('m-scaffold-sidebar-width') as SizeSymbol;
const scaffoldTopHeight = Symbol('m-scaffold-top-height') as SizeSymbol;

export const symbols = {
  darkMode,
  scaffoldBottomHeight,
  scaffoldContentHeight,
  scaffoldSidebarWidth,
  scaffoldTopHeight
} as const;
