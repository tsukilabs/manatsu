import './style/main.scss';

export { Command } from './enum';
export { createManatsu } from './plugin';

export * from '@manatsu/components/src/index.ts';

export { type MaybeNullishRef, isDarkMode } from '@manatsu/shared';

// Composables should be exported individually, because some of them are for internal use only.
// One can still import the others directly from the @manatsu/composables package,
// but we won't give any guarantees about their stability.
export {
  useDarkMode,
  useHeight,
  useInvoke,
  usePixelHeight,
  usePixelWidth,
  useWidth
} from '@manatsu/composables/src/index.ts';
