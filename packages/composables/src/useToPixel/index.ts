import { toPixel } from '@tb-dev/utils';
import { type MaybeRefOrGetter, computed, toRef } from 'vue';

/**
 * Reactively add the pixel unit to a value.
 * If the value is a string, it is returned unchanged.
 */
export function useToPixel(unit: MaybeRefOrGetter<string | number>) {
  const unitRef = toRef(unit);
  return computed(() => toPixel(unitRef.value));
}
