import type { MaybeRefOrGetter } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';

export interface ManatsuGlobal {
  isDarkMode: () => boolean;
  setDarkMode: (darkMode: DarkMode) => void;
  toggleDarkMode: () => void;
}

export type DarkMode = boolean | 'auto';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: DarkMode;
}

export type MaybeNullishRef<T> = MaybeRefOrGetter<Nullish<T>>;
