import { type InjectionKey, inject } from 'vue';
import { ManatsuError } from './error';
import { getCurrentApp } from './global';

const sortCollator = new Intl.Collator(void 0, {
  usage: 'sort',
  numeric: true,
  sensitivity: 'variant'
});

/**
 * Compare two values so they can be sorted.
 *
 * Both are coerced to strings before being compared with a collator.
 */
export function compare(a: unknown, b: unknown): number {
  return sortCollator.compare(String(a), String(b));
}

/**
 * Same as `inject`, but throws an error if the value was not provided.
 * This is called within the app context.
 *
 * @example
 * ```ts
 * app.runWithContext(() => inject(key))
 * ```
 */
export function injectStrict<T>(key: InjectionKey<T> | string): T {
  const app = getCurrentApp();
  const value = app.runWithContext(() => inject(key));

  // eslint-disable-next-line no-undefined
  if (value === undefined) {
    throw new ManatsuError('value was not provided');
  }

  return value;
}
