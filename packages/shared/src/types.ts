export interface ManatsuGlobal {
  setDarkMode: (darkMode: DarkMode) => void;
  toggleDarkMode: () => void;
}

export type DarkMode = boolean | 'auto';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: DarkMode;
}
