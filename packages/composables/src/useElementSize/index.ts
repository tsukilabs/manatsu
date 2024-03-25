import { type MaybeRefOrGetter, toRef } from 'vue';
import { type MaybeElement, useElementSize as original } from '@vueuse/core';

/**
 * Shortcut for `useElementSize` with `border-box` as the default box model.
 */
export function useElementSize<T extends MaybeElement>(element: MaybeRefOrGetter<T>) {
  return original(toRef(element), { height: 0, width: 0 }, { box: 'border-box' });
}
