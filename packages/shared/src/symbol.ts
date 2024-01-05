import type { InjectionKey, Ref } from 'vue';
import type { DarkMode } from './types';

export type DarkModeSymbol = InjectionKey<Ref<DarkMode>>;
export const darkModeKey = Symbol('manatsu-dark-mode') as DarkModeSymbol;
