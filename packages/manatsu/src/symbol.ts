import type { InjectionKey, Ref } from 'vue';
import type { ExtractRequired } from '@tb-dev/utility-types';
import type { ManatsuOptions } from './index';

export type DarkModeSymbol = InjectionKey<
  Ref<ExtractRequired<ManatsuOptions, 'darkMode'>>
>;
export const darkModeKey = Symbol('manatsu-dark-mode') as DarkModeSymbol;
