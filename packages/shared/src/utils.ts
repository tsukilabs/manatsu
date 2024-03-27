import { type InjectionKey, defineComponent, inject } from 'vue';
import { getCurrentApp } from './global';
import { privateSymbols } from './symbols';

const sortCollator = new Intl.Collator(undefined, {
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

export function defineEmptyComponent() {
  return defineComponent({
    render() {
      return null;
    }
  });
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

  if (value === undefined) {
    throw new Error('injection failed: value was not provided');
  }

  return value;
}

export function handleError(error: unknown) {
  const errorHandler = injectStrict(privateSymbols.errorHandler);
  const app = getCurrentApp();
  errorHandler?.call(app, error);
}
