import { getCurrentApp, getGlobalManatsu } from './global';
import { type InjectionKey, defineComponent, inject } from 'vue';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EmptyComponent = defineComponent({
  render() {
    return null;
  }
});

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
  try {
    const manatsu = getGlobalManatsu();
    manatsu.errorHandler?.call(manatsu.app, error);
  } catch (err) {
    console.warn(err);
  }
}
