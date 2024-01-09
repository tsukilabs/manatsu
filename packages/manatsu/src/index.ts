import './style/main.scss';

export { createManatsu } from './plugin';
export * from '@manatsu/components/src/index.ts';
export * from '@manatsu/composables/src/index.ts';

export type { MaybeNullishRef } from '@manatsu/shared';
export { isDarkMode, toggleDarkMode } from '@manatsu/shared';
