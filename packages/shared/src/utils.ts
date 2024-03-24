import { isNullish } from '@tb-dev/utils';
import { type InjectionKey, inject } from 'vue';
import { getCurrentApp } from './global';
import { privateSymbols } from './symbols';

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

export interface InjectStrictOptions<E extends Error = Error> {
  error?: string | E;
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
export function injectStrict<T>(
  key: InjectionKey<T> | string,
  options: InjectStrictOptions = {}
): T {
  const app = getCurrentApp();
  const value = app.runWithContext(() => inject(key));

  // eslint-disable-next-line no-undefined
  if (isNullish(value)) {
    options.error ??= 'value was not provided';
    if (options.error instanceof Error) {
      throw options.error;
    } else {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error(options.error);
    }
  }

  return value as T;
}

export function handleError(error: unknown) {
  const errorHandler = injectStrict(privateSymbols.errorHandler, {
    error: 'error handler was not provided'
  });

  const app = getCurrentApp();
  errorHandler?.call(app, error);
}
