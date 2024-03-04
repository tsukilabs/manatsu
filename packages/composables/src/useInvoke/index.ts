import { type InvokeArgs, invoke } from '@tauri-apps/api/tauri';
import { type UseAsyncStateOptions, useAsyncState } from '@vueuse/core';

// prettier-ignore
interface UseInvokeOptions<Shallow extends boolean = true, Data = unknown> extends UseAsyncStateOptions<Shallow, Data> {
  initialState?: Data,
}

export function useInvoke<Data = unknown, Shallow extends boolean = true>(
  cmd: string,
  args: InvokeArgs | null = null,
  options: UseInvokeOptions<Shallow, Data> = {}
) {
  const { initialState = null, ...asyncStateOptions } = options;

  const cb = invoke<Data>(cmd, args ?? {});
  const state = useAsyncState(cb, initialState, asyncStateOptions);
  return state;
}
