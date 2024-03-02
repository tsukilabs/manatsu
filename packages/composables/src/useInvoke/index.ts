import { type InvokeArgs, invoke } from '@tauri-apps/api/tauri';
import { type UseAsyncStateOptions, useAsyncState } from '@vueuse/core';

// prettier-ignore
interface UseInvokeOptions<Shallow extends boolean = true, Data = unknown> extends UseAsyncStateOptions<Shallow, Data> {
  initialState?: Data,
}

export function useInvoke<Data = unknown, Shallow extends boolean = true>(
  cmd: string,
  args?: InvokeArgs | null,
  options: UseInvokeOptions<Shallow, Data> = {}
) {
  const { initialState, ...asyncStateOptions } = options;

  const cb = args ? () => invoke<Data>(cmd, args) : () => invoke<Data>(cmd);
  const state = useAsyncState(cb, initialState, asyncStateOptions);
  return state;
}
