import { type InjectionKey, defineComponent, inject } from 'vue';
import { symbols } from './symbols';
import { getCurrentApp } from './global';

export function defineEmptyComponent() {
  return defineComponent({
    render() {
      return null;
    }
  });
}

/** Same as `inject`, but throws an error if the value was not provided. */
export function injectStrict<T>(key: InjectionKey<T> | string): T {
  const app = getCurrentApp();
  const value = app.runWithContext(() => inject(key));

  if (value === undefined) {
    throw new Error('injection failed: value was not provided');
  }

  return value;
}

export function handleError(error: unknown) {
  const errorHandler = injectStrict(symbols.errorHandler);
  const app = getCurrentApp();
  errorHandler?.call(app, error);
}
