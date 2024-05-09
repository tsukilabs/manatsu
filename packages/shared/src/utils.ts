import { getName } from '@tauri-apps/api/app';
import { message } from '@tauri-apps/plugin-dialog';
import { type InjectionKey, defineComponent, inject } from 'vue';
import {
  type ErrorHandlerOptions,
  getCurrentApp,
  getErrorHandlerOptions,
  getGlobalManatsu
} from './global';

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

export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = getErrorHandlerOptions()
) {
  const manatsu = getGlobalManatsu();
  const { dialog = false, print = true } = options;

  try {
    manatsu.errorHandler?.call(manatsu.app, error);
  } catch (err) {
    console.warn(err);
  } finally {
    if (print) {
      console.error(error);
    }

    if (dialog) {
      const msg = error instanceof Error ? error.message : String(error);
      void showErrorMessage(msg);
    }
  }
}

async function showErrorMessage(error: string) {
  let title: string;
  try {
    title = await getName();
  } catch (err) {
    console.warn(err);
    title = 'Error';
  }

  try {
    await message(error, { title, kind: 'error' });
  } catch (err) {
    console.warn(err);
  }
}
